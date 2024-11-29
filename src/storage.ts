export function saveTask(task: any): void {
    const tasks = getTasks();
    tasks.push({ ...task, date_creation: new Date().toISOString(), etat_tache: "pending", progression: 0 });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function updateTask(updatedTask: any): void {
    const tasks = getTasks();
    const index = tasks.findIndex((task: any) => task.id === updatedTask.id);

    if (index !== -1) {
        tasks[index] = updatedTask; // Mise à jour de la tâche existante
    }
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function getTasks(): any[] {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
}

export function deleteTask(id: string): void {
    let tasks = getTasks();
    tasks = tasks.filter((task: any) => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
