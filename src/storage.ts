const data = localStorage.getItem("key");
const parsedData = data ? JSON.parse(data) : [];

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
    try {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    } catch (e) {
        console.error('Error parsing tasks from localStorage:', e);
        return [];
    }
}


export function deleteTask(id: string): void {
    let tasks = getTasks();
    tasks = tasks.filter((task: any) => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function getUserById(userId: string): any {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    return users.find((user: any) => user.id === userId);
}

export function updateUser(updatedUser: any): void {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const index = users.findIndex((user: any) => user.id === updatedUser.id);

    if (index !== -1) {
        // Mise à jour de l'utilisateur, y compris la photo
        users[index] = updatedUser;
        localStorage.setItem("users", JSON.stringify(users)); // Sauvegarde les utilisateurs avec la nouvelle photo
    }
}




export function saveUserProfile(profile: any): void {
    localStorage.setItem('userProfile', JSON.stringify(profile));
}
function fixUsersWithoutId(): void {
    const users = JSON.parse(localStorage.getItem("users") || "[]").map((user: any) => {
        if (!user.id) {
            user.id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
        }
        return user;
    });
    localStorage.setItem("users", JSON.stringify(users));
    console.log("Utilisateurs corrigés :", users);
}

// Appelle cette fonction une seule fois pour corriger les utilisateurs existants
fixUsersWithoutId();