import { saveTask, getTasks, deleteTask } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const taskList = getTasks();
    displayTasks(taskList);

    document.getElementById("addTaskForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log('test')

        const newTask = {
            nom_tache: (document.getElementById("taskTitle") as HTMLInputElement).value,
            description: (document.getElementById("taskDescription") as HTMLInputElement).value,
            priorite: (document.getElementById("taskPriority") as HTMLInputElement).value,
            date_limite: (document.getElementById("taskDeadline") as HTMLInputElement).value,
        };

        saveTask(newTask);
        displayTasks(getTasks());
        alert("Tâche enregistrée avec succès !");
    });
});

function displayTasks(tasks: any[]) {
    const taskTableBody = document.getElementById("taskTableBody");
    if (taskTableBody) {
        taskTableBody.innerHTML = '';
        tasks.forEach(task => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${task.nom_tache}</td>
                <td>${task.description}</td>
                <td>${task.priorite}</td>
                <td>${task.date_limite}</td>
                <td><button class="deleteTaskBtn" data-id="${task.id}">Supprimer</button></td>
            `;
            taskTableBody.appendChild(row);
        });
    }
}
