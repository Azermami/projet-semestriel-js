// filepath: /Users/bilal/Documents Local/Cours/3 IW/S2/Projet semestriel/projet-semestriel-js/src/taskManager.ts
import { getTasks, getProjects, saveTask, deleteTask, Project } from './storage.js';

interface Task {
    id: string;
    nom_tache: string;
    description: string;
    date_creation: string;
    date_limite: string;
    etat_tache: string;
    priorite: string;
    progression: number;
    id_projet: string;
    id_utilisateur_attribue: string;
}

document.addEventListener('DOMContentLoaded', () => {
    const taskList = getTasks();
    const projectList = getProjects();
    displayTasks(taskList, projectList);
    setupDateNavigation();
    setupTaskForm();
});

function displayTasks(tasks: Task[], projects: Project[], date: Date = new Date()) {
    const taskListElement = document.getElementById("tasksList");
    if (!taskListElement) return;

    taskListElement.innerHTML = '';
    
    const todayTasks = filterTasksForDate(tasks, date);
    const todayProjects = filterProjectsForDate(projects, date);
    
    if (todayTasks.length === 0 && todayProjects.length === 0) {
        taskListElement.innerHTML = '<p>Aucune tâche ni projet pour ce jour</p>';
        return;
    }
    
    displayTaskItems(todayTasks, projects, taskListElement);
    
    updateCurrentDateDisplay(date);
}



function displayTaskItems(tasks: Task[], projects: Project[], container: HTMLElement) {
    if (tasks.length === 0) return;

    const tasksSection = document.createElement('div');
    tasksSection.className = 'tasks-section';
    tasksSection.innerHTML = '<h3>Tâches du jour</h3>';
    
    tasks.forEach(task => {
        const taskElement = createTaskElement(task, projects);
        tasksSection.appendChild(taskElement);
    });
    container.appendChild(tasksSection);
}

function createTaskElement(task: Task, projects: Project[]): HTMLElement {
    const project = projects.find(proj => proj.id === task.id_projet);
    const taskElement = document.createElement("div");
    taskElement.className = "task-item";
    taskElement.innerHTML = `
        <h4>${task.nom_tache}</h4>
        <p>${task.description}</p>
        <p>Projet: ${project ? project.nom_projet : "Aucun projet associé"}</p>
        <p>Date limite: ${formatDate(task.date_limite)}</p>
        <p>Priorité: ${task.priorite}</p>
        <p>Progression: ${task.progression}%</p>
        <div class="task-actions">
            <button class="editTaskBtn" data-id="${task.id}">Modifier</button>
            <button class="deleteTaskBtn" data-id="${task.id}">Supprimer</button>
        </div>
    `;
    return taskElement;
}

function filterTasksForDate(tasks: Task[], date: Date): Task[] {
    const targetDate = date.toISOString().split('T')[0];
    return tasks.filter(task => task.date_limite.startsWith(targetDate));
}

function filterProjectsForDate(projects: Project[], date: Date): Project[] {
    const targetDate = date.toISOString().split('T')[0];
    return projects.filter(project => project.date_limite.startsWith(targetDate));
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function updateCurrentDateDisplay(date: Date) {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        currentDateElement.textContent = formatDate(date.toISOString());
    }
}

function setupDateNavigation() {
    let currentDate = new Date();
    const prevButton = document.querySelector('.nav-btn:first-child') as HTMLButtonElement;
    const nextButton = document.querySelector('.nav-btn:last-child') as HTMLButtonElement;

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => navigateDate(-1));
        nextButton.addEventListener('click', () => navigateDate(1));
    }

    function navigateDate(days: number) {
        currentDate.setDate(currentDate.getDate() + days);
        const taskList = getTasks();
        const projectList = getProjects();
        displayTasks(taskList, projectList, currentDate);
    }
}

function getRandomColor(): string {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function setupTaskForm() {
    const taskForm = document.getElementById("addTaskForm") as HTMLFormElement;
    if (!taskForm) return;

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskId = (document.getElementById("taskId") as HTMLInputElement)?.value;
        const newTask: Task = {
            id: taskId || Date.now().toString(),
            nom_tache: (document.getElementById("taskTitle") as HTMLInputElement).value.trim(),
            description: (document.getElementById("taskDescription") as HTMLTextAreaElement).value.trim(),
            date_creation: new Date().toISOString(),
            date_limite: (document.getElementById("taskDeadline") as HTMLInputElement).value,
            etat_tache: 'pending',
            priorite: (document.getElementById("taskPriority") as HTMLSelectElement).value,
            progression: 0,
            id_projet: (document.getElementById("taskProject") as HTMLSelectElement).value,
            id_utilisateur_attribue: JSON.parse(localStorage.getItem("loggedInUser") || "{}").id
        };

        if (!newTask.nom_tache || !newTask.description || !newTask.date_limite) {
            alert("Tous les champs sont obligatoires !");
            return;
        }

        saveTask(newTask);
        displayTasks(getTasks(), getProjects());
        taskForm.reset();
        
        if (taskId) {
            (document.getElementById("taskId") as HTMLInputElement).remove();
            alert("Tâche modifiée avec succès !");
        } else {
            alert("Tâche ajoutée avec succès !");
        }
    });
}

// Add these functions to handle task actions
function addTaskButtonListeners() {
    document.querySelectorAll(".editTaskBtn").forEach(button => {
        button.addEventListener("click", (e) => {
            const taskId = (e.target as HTMLButtonElement).dataset.id;
            if (taskId) editTask(taskId);
        });
    });

    document.querySelectorAll(".deleteTaskBtn").forEach(button => {
        button.addEventListener("click", (e) => {
            const taskId = (e.target as HTMLButtonElement).dataset.id;
            if (taskId) deleteTaskAndRefresh(taskId);
        });
    });
}

function editTask(taskId: string) {
    const taskToEdit = getTasks().find(task => task.id === taskId);
    if (!taskToEdit) return;

    (document.getElementById("taskTitle") as HTMLInputElement).value = taskToEdit.nom_tache;
    (document.getElementById("taskDescription") as HTMLTextAreaElement).value = taskToEdit.description;
    (document.getElementById("taskDeadline") as HTMLInputElement).value = taskToEdit.date_limite.split('T')[0];
    (document.getElementById("taskPriority") as HTMLSelectElement).value = taskToEdit.priorite;
    (document.getElementById("taskProject") as HTMLSelectElement).value = taskToEdit.id_projet;

    let taskIdInput = document.getElementById("taskId") as HTMLInputElement;
    if (!taskIdInput) {
        taskIdInput = document.createElement("input");
        taskIdInput.type = "hidden";
        taskIdInput.id = "taskId";
        document.getElementById("addTaskForm")?.appendChild(taskIdInput);
    }
    taskIdInput.value = taskToEdit.id;
}

function deleteTaskAndRefresh(taskId: string) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
        deleteTask(taskId);
        displayTasks(getTasks(), getProjects());
        alert("Tâche supprimée avec succès !");
    }
}
