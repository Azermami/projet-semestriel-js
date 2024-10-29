// // Sauvegarde d'une nouvelle tâche
// export function saveTask(task: any): void {
//     const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
//     const newTask = {
//         id: Date.now().toString(),  // Utilisation d'un ID unique
//         nom_tache: task.nom_tache,
//         description: task.description,
//         date_creation: new Date().toISOString(),
//         date_limite: task.date_limite,
//         etat_tache: "pending",
//         priorite: task.priorite,
//         progression: 0,
//         id_projet: task.id_projet,
//         id_utilisateur_attribue: task.id_utilisateur_attribue
//     };
//     tasks.push(newTask);
//     localStorage.setItem('tasks', JSON.stringify(tasks));
// }

// // Récupération des tâches
// export function getTasks(): any[] {
//     return JSON.parse(localStorage.getItem('tasks') || '[]');
// }

// // Suppression d'une tâche
// export function deleteTask(id: string): void {
//     let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
//     tasks = tasks.filter((task: any) => task.id !== id);
//     localStorage.setItem('tasks', JSON.stringify(tasks));
// }
// class TaskManager {
//     static addTask(title: string, description: string, dueDate: string, priority: string) {
//         const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

//         // Générer un nouvel identifiant pour la tâche
//         const newTask = {
//             id: tasks.length + 1,
//             title,
//             description,
//             dueDate,
//             priority,
//             status: "en attente"
//         };

//         tasks.push(newTask);

//         // Sauvegarder les tâches dans LocalStorage
//         localStorage.setItem("tasks", JSON.stringify(tasks));
//     }
// }
// Sauvegarde d'une nouvelle tâche
// Sauvegarde d'une nouvelle tâche
export function saveTask(task: any): void {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const newTask = {
        id: Date.now().toString(),  // Utilisation d'un ID unique
        nom_tache: task.nom_tache,
        description: task.description,
        date_creation: new Date().toISOString(),
        date_limite: task.date_limite,
        etat_tache: "pending",
        priorite: task.priorite,
        progression: 0,
        id_projet: task.id_projet,
        id_utilisateur_attribue: task.id_utilisateur_attribue
    };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Récupération des tâches
export function getTasks(): any[] {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
}

// Suppression d'une tâche
export function deleteTask(id: string): void {
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks = tasks.filter((task: any) => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
