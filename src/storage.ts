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


// Fonction pour sauvegarder un projet
export function saveProject(project: any): void {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const newProject = {
        id: Date.now().toString(),  // Utilisation d'un ID unique
        nom_projet: project.nom_projet,
        description: project.description,
        date_creation: new Date().toISOString(),
        date_limite: project.date_limite,
        etat_projet: "pending",
        priorite: project.priorite,
        progression: 0,
        id_utilisateur_attribue: project.id_utilisateur_attribue
    };
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Récupération des projets
export function getProjects(): any[] {
    return JSON.parse(localStorage.getItem('projects') || '[]');
}

// Suppression d'un projet
export function deleteProject(id: string): void {
    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects = projects.filter((project: any) => project.id !== id);
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Mise à jour profil
// Récupérer la liste des utilisateurs
export function getUsers(): any[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Sauvegarder la liste des utilisateurs
export function saveUsers(users: any[]): void {
    localStorage.setItem('users', JSON.stringify(users));
}