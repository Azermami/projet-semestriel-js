// Sauvegarde d'une nouvelle tâche
export function saveTask(task: any): void {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const newTask = {
        id: Date.now().toString(),
        nom_tache: task.nom_tache,
        description: task.description,
        date_creation: new Date().toISOString(),
        date_limite: task.date_limite,
        etat_tache: "pending",
        priorite: task.priorite,
        progression: 0,
        id_utilisateur_attribue: task.id_utilisateur_attribue // ID de l'utilisateur
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
