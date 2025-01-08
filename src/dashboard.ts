import { initDarkMode } from './dark-mode.js';
interface Project {
    id: string;
    title: string;
    description: string;
    priority?: string;
    deadline?: string;
    date_creation: string;
    date_limite: string;
}

// Interface pour définir la structure d'une tâche
interface Task {
    id: string;
    nom_tache: string;
    description: string;
    priorite?: string;
    etat_tache?: string;
    deadline?: string;
    date_creation: string;
    date_limite: string;
    id_utilisateur_attribue: string;
}

// Initialisation après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    displayProjectsInDashboard();
    displayAllTasks(); // Affiche toutes les tâches, sans filtre de date
    updateDashboardStats();
    displayUsername(); // Affiche le nom d'utilisateur
    initDateNavigation(); // Gère la navigation par date
});

// Affiche le nom d'utilisateur connecté
function displayUsername(): void {
    const username = localStorage.getItem('currentUser');
    const usernameElement = document.getElementById('usernameDisplay');
    if (usernameElement && username) {
        usernameElement.textContent = `Bienvenue, ${username}!`;
    }
}

// Récupère tous les projets depuis le stockage local
function getProjects(): Project[] {
    const projectsJson = localStorage.getItem('projects');
    return projectsJson ? JSON.parse(projectsJson) : [];
}

// Récupère toutes les tâches depuis le stockage local
function getTasks(): Task[] {
    const tasksJson = localStorage.getItem('tasks');
    return tasksJson ? JSON.parse(tasksJson) : [];
}

// Affiche tous les projets sur le tableau de bord
function displayProjectsInDashboard(): void {
    const projects = getProjects();
    const projectsList = document.getElementById('projectsList');
    if (!projectsList) {
        console.error('Élément #projectsList introuvable.');
        return;
    }

    projectsList.innerHTML = '';
    projects.forEach((project: Project) => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-item';
        const progress = calculateProgress(project.date_creation, project.date_limite);

        projectElement.innerHTML = `
            <div class="project-indicator" style="background-color: ${getRandomColor()}"></div>
            <div class="project-content">
                <div class="project-title">${project.title}</div>
                <div class="project-description">${project.description}</div>
                <div class="project-progress">Progression: ${progress}%</div>
            </div>
        `;
        projectsList.appendChild(projectElement);
    });
}

// Affiche toutes les tâches dans la liste des tâches
function displayAllTasks(): void {
    const tasks = getTasks();
    displayTasks(tasks);
}

// Affiche les tâches filtrées ou triées
function displayTasks(tasks: Task[]): void {
    const tasksList = document.getElementById('tasksList');
    if (!tasksList) {
        console.error('Élément #tasksList introuvable.');
        return;
    }

    tasks.sort((a, b) => new Date(a.date_limite).getTime() - new Date(b.date_limite).getTime());
    tasksList.innerHTML = '';
    if (tasks.length === 0) {
        tasksList.innerHTML = '<p>Aucune tâche disponible.</p>';
        return;
    }

    tasks.forEach((task: Task) => {
        const daysLeft = calculateDaysLeft(task.date_limite);
        const isNearDeadline = daysLeft <= 1;

        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';

        taskElement.innerHTML = `
            <div class="task-content">
                <div class="task-title">${task.nom_tache}</div>
                <div class="task-project">${task.description}</div>
                    ${daysLeft <= 0 ? 'Expirée' : `${daysLeft} jour(s) restant(s)`}
                </div>
            </div>
        `;
        tasksList.appendChild(taskElement);
    });
}

// Calcul du nombre de jours restants pour une date limite
function calculateDaysLeft(deadline: string): number {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

// Calcule le pourcentage de progression entre deux dates
function calculateProgress(dateCreation: string, date_limite: string): number {
    const creationDate = new Date(dateCreation);
    const deadlineDate = new Date(date_limite);
    const currentDate = new Date();

    if (currentDate >= deadlineDate) return 100;
    if (currentDate <= creationDate) return 0;

    const totalDuration = deadlineDate.getTime() - creationDate.getTime();
    const elapsedDuration = currentDate.getTime() - creationDate.getTime();

    return Math.round((elapsedDuration / totalDuration) * 100);
}

// Gère la navigation entre les dates sur le tableau de bord
function initDateNavigation(): void {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        currentDateElement.textContent = formatDisplayDate(new Date());
    }

    const prevButton = document.querySelector('.nav-btn:first-child');
    const nextButton = document.querySelector('.nav-btn:last-child');

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            navigateToPreviousDate();
        });

        nextButton.addEventListener('click', () => {
            navigateToNextDate();
        });
    }
}

// Formate une date pour l'affichage
function formatDisplayDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

// Navigue vers la date précédente
function navigateToPreviousDate(): void {
    const tasks = getTasks();
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    updateDateAndTasks(currentDate, tasks);
}

// Navigue vers la date suivante
function navigateToNextDate(): void {
    const tasks = getTasks();
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    updateDateAndTasks(currentDate, tasks);
}

// Met à jour l'affichage pour une nouvelle date
function updateDateAndTasks(date: Date, tasks: Task[]): void {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        currentDateElement.textContent = formatDisplayDate(date);
    }
    const filteredTasks = filterTasksForToday(tasks, date);
    displayTasks(filteredTasks);
}

// Filtre les tâches pour la date donnée
function filterTasksForToday(tasks: Task[], date: Date): Task[] {
    const formattedDate = formatDate(date);
    return tasks.filter(task => formatDate(new Date(task.date_limite)) === formattedDate);
}

// Formate une date au format AAAA-MM-JJ
function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Met à jour les statistiques du tableau de bord
function updateDashboardStats(): void {
    try {
        const tasks = getTasks();
        const projects = getProjects();
        const inProgressTasksElement = document.getElementById('inProgressTasks');
        const inProgressProjectsElement = document.getElementById('inProgressProjects');

        if (inProgressTasksElement) {
            inProgressTasksElement.textContent = tasks.length.toString();
        }

        if (inProgressProjectsElement) {
            inProgressProjectsElement.textContent = projects.length.toString();
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour des statistiques:', error);
    }
}

// Génère une couleur aléatoire pour les projets
function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
initDarkMode();