// Fonction générique pour récupérer des données depuis le localStorage
function getDataFromLocalStorage(key: string): any[] {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour la clé "${key}":`, error);
        return [];
    }
}

// Fonction générique pour sauvegarder des données dans le localStorage
function saveDataToLocalStorage(key: string, data: any[]): void {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Erreur lors de la sauvegarde des données pour la clé "${key}":`, error);
    }
}

// Sauvegarde d'une nouvelle tâche
export function saveTask(task: any): void {
    const tasks = getDataFromLocalStorage('tasks');
    const newTask = {
        id: Date.now().toString(), // ID unique basé sur l'horodatage
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
    saveDataToLocalStorage('tasks', tasks);
}

// Récupération des tâches
export function getTasks(): any[] {
    return getDataFromLocalStorage('tasks');
}

// Suppression d'une tâche
export function deleteTask(id: string): void {
    const tasks = getDataFromLocalStorage('tasks');
    const updatedTasks = tasks.filter((task: any) => task.id !== id);
    saveDataToLocalStorage('tasks', updatedTasks);
}

// Sauvegarde d'un nouveau projet
export function saveProject(project: any): void {
    const projects = getDataFromLocalStorage('projects');
    const newProject = {
        id: Date.now().toString(), // ID unique basé sur l'horodatage
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
    saveDataToLocalStorage('projects', projects);
}

// Récupération des projets
export function getProjects(): any[] {
    return getDataFromLocalStorage('projects');
}

// Suppression d'un projet
export function deleteProject(id: string): void {
    const projects = getDataFromLocalStorage('projects');
    const updatedProjects = projects.filter((project: any) => project.id !== id);
    saveDataToLocalStorage('projects', updatedProjects);
}

// Sauvegarde de la liste des utilisateurs
export function saveUsers(users: any[]): void {
    if (!Array.isArray(users)) {
        console.error("Les données à sauvegarder ne sont pas un tableau valide.");
        return;
    }
    saveDataToLocalStorage('users', users);
}

// Récupération de la liste des utilisateurs
export function getUsers(): any[] {
    return getDataFromLocalStorage('users');
}