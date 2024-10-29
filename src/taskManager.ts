import { saveTask, getTasks, deleteTask } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const taskList = getTasks();
    displayTasks(taskList);

    document.getElementById("addTaskForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskId = (document.getElementById("taskId") as HTMLInputElement)?.value; // Récupérez l'ID de la tâche à modifier

        const newTask = {
            id: taskId || Date.now().toString(), // Utiliser l'ID existant ou créer un nouvel ID
            nom_tache: (document.getElementById("taskTitle") as HTMLInputElement).value,
            description: (document.getElementById("taskDescription") as HTMLTextAreaElement).value,
            priorite: (document.getElementById("taskPriority") as HTMLSelectElement).value,
            date_limite: (document.getElementById("taskDeadline") as HTMLInputElement).value,
            id_utilisateur_attribue: JSON.parse(localStorage.getItem("loggedInUser") || "{}").id
        };

        // Vérifiez si nous modifions une tâche existante ou en ajoutons une nouvelle
        if (taskId) {
            updateTask(newTask); // Appel de la fonction de mise à jour
        } else {
            saveTask(newTask);
        }

        displayTasks(getTasks());
        alert(taskId ? "Tâche modifiée avec succès !" : "Tâche enregistrée avec succès !");
    });
});

// Fonction pour afficher les tâches
function displayTasks(tasks: any[]) {
    const taskTableBody = document.getElementById("taskTableBody");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

    if (taskTableBody) {
        taskTableBody.innerHTML = '';
        const userTasks = tasks.filter(task => task.id_utilisateur_attribue === loggedInUser.id);

        userTasks.forEach(task => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${task.nom_tache}</td>
                <td>${task.description}</td>
                <td>${task.priorite}</td>
                <td>${task.date_limite}</td>
                <td>
                    <button class="editTaskBtn" data-id="${task.id}">Modifier</button>
                    <button class="deleteTaskBtn" data-id="${task.id}">Supprimer</button>
                </td>
            `;
            taskTableBody.appendChild(row);
        });

        // Ajoutez des gestionnaires d'événements pour les boutons
        addTaskButtonListeners();
    }
}

// Fonction pour ajouter des écouteurs d'événements aux boutons
function addTaskButtonListeners() {
    const deleteButtons = document.querySelectorAll(".deleteTaskBtn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const taskId = (e.target as HTMLButtonElement).dataset.id;
            if (taskId) {
                deleteTask(taskId);
                displayTasks(getTasks());
                alert("Tâche supprimée avec succès !");
            }
        });
    });

    const editButtons = document.querySelectorAll(".editTaskBtn");
    editButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const taskId = (e.target as HTMLButtonElement).dataset.id;
            if (taskId) {
                const taskToEdit = getTasks().find(task => task.id === taskId);
                if (taskToEdit) {
                    // Remplir le formulaire avec les données de la tâche à modifier
                    (document.getElementById("taskTitle") as HTMLInputElement).value = taskToEdit.nom_tache;
                    (document.getElementById("taskDescription") as HTMLTextAreaElement).value = taskToEdit.description;
                    (document.getElementById("taskPriority") as HTMLSelectElement).value = taskToEdit.priorite;
                    (document.getElementById("taskDeadline") as HTMLInputElement).value = taskToEdit.date_limite;

                    // Ajouter un champ caché pour l'ID de la tâche à modifier
                    let taskIdInput = document.getElementById("taskId") as HTMLInputElement;
                    if (!taskIdInput) {
                        taskIdInput = document.createElement("input");
                        taskIdInput.type = "hidden";
                        taskIdInput.id = "taskId";
                        document.getElementById("addTaskForm")?.appendChild(taskIdInput);
                    }
                    taskIdInput.value = taskToEdit.id;
                }
            }
        });
    });
}

// Fonction pour mettre à jour une tâche
function updateTask(updatedTask: any) {
    let tasks = getTasks();
    tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
