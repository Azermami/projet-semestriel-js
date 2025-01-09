import { saveTask, getTasks, deleteTask } from './storage.js';
import { initDarkMode } from './dark-mode.js';
document.addEventListener('DOMContentLoaded', () => {
    
    const taskList = getTasks();
    
    displayTasks(taskList);
   
    
    document.getElementById("addTaskForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskId = (document.getElementById("taskId") as HTMLInputElement)?.value;

        const newTask = {
            id: taskId || Date.now().toString(),
            nom_tache: (document.getElementById("taskTitle") as HTMLInputElement).value,
            description: (document.getElementById("taskDescription") as HTMLTextAreaElement).value,
            priorite: (document.getElementById("taskPriority") as HTMLSelectElement).value,
            date_limite: (document.getElementById("taskDeadline") as HTMLInputElement).value,
            id_utilisateur_attribue: JSON.parse(localStorage.getItem("loggedInUser") || "{}").id,
        };

        if (taskId) {
            updateTask(newTask);
            showNotification("Tâche modifiée avec succès !", 'success');
        } else {
            saveTask(newTask);
            showNotification("Tâche ajoutée avec succès !", 'success');
        }

        displayTasks(getTasks());
        (document.getElementById("addTaskForm") as HTMLFormElement).reset();
    });
});


// Fonction pour afficher les tâches
function updateTaskCounts(tasks: any[]): void {
    const todoCount = tasks.filter(task => task.etat_tache === 'todo').length;
    const inProgressCount = tasks.filter(task => task.etat_tache === 'in-progress').length;
    const doneCount = tasks.filter(task => task.etat_tache === 'done').length;

    // Mettre à jour les compteurs dans le DOM
    document.getElementById("todoCount")!.textContent = todoCount.toString();
    document.getElementById("inProgressCount")!.textContent = inProgressCount.toString();
    document.getElementById("doneCount")!.textContent = doneCount.toString();
}


// Fonction pour afficher les tâches
function displayTasks(tasks: any[]): void {
    const taskTableBody = document.getElementById("taskTableBody");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

    if (!taskTableBody) return;

    taskTableBody.innerHTML = ''; // Reset table body
    const userTasks = tasks.filter(task => task.id_utilisateur_attribue === loggedInUser.id);

    userTasks.forEach(task => {
        const now = new Date();
        const deadline = new Date(task.date_limite);
        const timeDiff = deadline.getTime() - now.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const isNearDeadline = daysLeft <= 1 && daysLeft >= 0;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.nom_tache}</td>
            <td>${task.description}</td>
            <td>${task.priorite}</td>
            <td>${task.date_limite}</td>
            <td>
                <span class="notification-icon" data-id="${task.id}" style="color: ${isNearDeadline ? 'red' : 'green'};">
                    ${isNearDeadline ? '🔔' : '🟢'}
                </span>
                <span class="time-left" style="color: ${isNearDeadline ? 'red' : 'black'};">
                    ${daysLeft <= 0 ? 'Expirée' : `${daysLeft} jour(s) restant(s)`}</span>
            </td>
            <td>
                <button class="editTaskBtn" data-id="${task.id}">Modifier</button>
                <button class="deleteTaskBtn" data-id="${task.id}">Supprimer</button>
                <button class="copyTaskBtn" data-id="${task.id}">Copier</button>
                <button class="shareTaskBtn" data-id="${task.id}">Partager</button>
            </td>
            <td>
                <select class="status-select" data-task-id="${task.id}">
                    <option value="todo" ${task.etat_tache === 'todo' ? 'selected' : ''}>À faire</option>
                    <option value="in-progress" ${task.etat_tache === 'in-progress' ? 'selected' : ''}>En cours</option>
                    <option value="done" ${task.etat_tache === 'done' ? 'selected' : ''}>Terminé</option>
                </select>
            </td>
        `;
        taskTableBody.appendChild(row);
    });

    addTaskButtonListeners();
    checkForNearDeadlineTasks(userTasks);
}

// Fonction pour ajouter des écouteurs d'événements aux boutons
function addTaskButtonListeners() {
    const statusSelects = document.querySelectorAll(".status-select");
    statusSelects.forEach(select => {
        select.addEventListener("change", (e) => {
            const taskId = (e.target as HTMLSelectElement).dataset.taskId;
            const newStatus = (e.target as HTMLSelectElement).value;

            if (taskId && newStatus) {
                // Mettre à jour l'état de la tâche dans le stockage local
                const tasks = getTasks();
                const updatedTasks = tasks.map(task => {
                    if (task.id === taskId) {
                        task.etat_tache = newStatus;  // Mettez à jour l'état
                    }
                    return task;
                });

                // Sauvegarder les tâches mises à jour
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));

                // Réafficher les tâches avec les nouveaux compteurs
                displayTasks(updatedTasks);
                updateTaskCounts(updatedTasks);
            }
        });
    });
    // Boutons de suppression
    const deleteButtons = document.querySelectorAll(".deleteTaskBtn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const taskId = (e.target as HTMLButtonElement).dataset.id;
            if (taskId) {
                deleteTask(taskId);
                displayTasks(getTasks());
                showNotification("Tâche supprimée avec succès !", 'success');
            }
        });
    });

    // Boutons de modification
    const editButtons = document.querySelectorAll(".editTaskBtn");
    editButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const taskId = (e.target as HTMLButtonElement).dataset.id;
            if (taskId) {
                const taskToEdit = getTasks().find(task => task.id === taskId);
                if (taskToEdit) {
                    (document.getElementById("taskTitle") as HTMLInputElement).value = taskToEdit.nom_tache;
                    (document.getElementById("taskDescription") as HTMLTextAreaElement).value = taskToEdit.description;
                    (document.getElementById("taskPriority") as HTMLSelectElement).value = taskToEdit.priorite;
                    (document.getElementById("taskDeadline") as HTMLInputElement).value = taskToEdit.date_limite;

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

    // Boutons de copie
    const copyButtons = document.querySelectorAll(".copyTaskBtn");
    copyButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const taskId = (e.target as HTMLButtonElement).dataset.id;
            if (taskId) {
                const taskToCopy = getTasks().find(task => task.id === taskId);
                if (taskToCopy) {
                    const taskText = `Titre: ${taskToCopy.nom_tache}\nDescription: ${taskToCopy.description}`;
                    navigator.clipboard.writeText(taskText).then(() => {
                        showNotification("Tâche copiée dans le presse-papier !", 'success');
                    }).catch(err => {
                        showNotification("Erreur lors de la copie : " + err, 'error');
                    });
                }
            }
        });
    });

    // Boutons de partage
    const shareButtons = document.querySelectorAll(".shareTaskBtn");
    shareButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const taskId = (e.target as HTMLButtonElement).dataset.id;
            if (taskId) {
                const taskToShare = getTasks().find(task => task.id === taskId);
                if (taskToShare && navigator.share) {
                    navigator.share({
                        title: taskToShare.nom_tache,
                        text: `Description: ${taskToShare.description}`,
                    }).then(() => {
                        showNotification("Tâche partagée avec succès !", 'success');
                    }).catch(() => {
                        showNotification("Partage annulé ou non pris en charge.", 'info');
                    });
                }
            }
        });
    });
}

// Vérification et notification des tâches proches de la date limite
// Vérification et notification des tâches proches de la date limite (y compris les 2 derniers jours)
function checkForNearDeadlineTasks(tasks: any[]) {
    const now = new Date();
    tasks.forEach(task => {
        const deadline = new Date(task.date_limite);
        const timeDiff = deadline.getTime() - now.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysLeft <= 1 && daysLeft >= 0) {
            // Si la tâche est à 1 jour ou moins de sa date limite, afficher une notification
            sendNotification(task);
        }
        else if (daysLeft === 2) {
            // Si la tâche est à 2 jours de sa date limite, envoyer un rappel spécial
            sendSecondLastDayReminder(task);
        }
    });
}
// Fonction pour envoyer un rappel de tâche à 2 jours de la date limite
function sendSecondLastDayReminder(task: any) {
    if (Notification.permission === "granted") {
        new Notification("Rappel de tâche - Deux jours restants", {
            body: `La tâche "${task.nom_tache}" doit être terminée dans 2 jours.`,
            icon: "/path/to/icon.png", // Remplacez par l'URL de votre icône
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                sendSecondLastDayReminder(task);
            }
        });
    }
}


// Envoi de notification
function sendNotification(task: any) {
    if (Notification.permission === "granted") {
        new Notification("Rappel de tâche", {
            body: `La tâche "${task.nom_tache}" approche de sa date limite !`,
            icon: "/path/to/icon.png",  // Remplacez par l'URL de votre icône
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                sendNotification(task);
            }
        });
    }
}

// Fonction pour afficher les notifications de succès ou d'erreur
function showNotification(message: string, type: 'success' | 'info' | 'error'): void {
    const notification = document.createElement('div');
    notification.className = `fixed top-5 right-5 p-4 rounded shadow text-white ${type === 'success' ? 'bg-green-500' : type === 'info' ? 'bg-blue-500' : 'bg-red-500'}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Fonction pour mettre à jour une tâche
function updateTask(updatedTask: any) {
    let tasks = getTasks();
    tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

initDarkMode();