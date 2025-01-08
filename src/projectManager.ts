// Définition des interfaces Task, Project et User
export interface Task {
    id: string;
    nom_tache: string;
    description: string;
    date_creation: string;
    date_limite: string;
    etat_tache: string;
    priorite: string;
    progression: number;
    id_projet: string;
    id_utilisateur_attribue: string;
}

export interface Project {
    id: string;
    nom_projet: string;
    description: string;
    date_creation: string;
    date_limite: string;
    etat_projet: string;
    priorite: string;
    progression: number;
    id_utilisateur_attribue: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    profilePhoto?: string;
}

// Fonction générique pour récupérer des données depuis le localStorage
function getDataFromLocalStorage<T>(key: string): T[] {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour la clé "${key}":`, error);
        return [];
    }
}

// Fonction générique pour sauvegarder des données dans le localStorage
function saveDataToLocalStorage<T>(key: string, data: T[]): void {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Erreur lors de la sauvegarde des données pour la clé "${key}":`, error);
    }
}

// Sauvegarde d'une nouvelle tâche
export function saveTask(task: Task): void {
    const tasks = getDataFromLocalStorage<Task>('tasks');
    const newTask: Task = {
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
export function getTasks(): Task[] {
    const tasks = getDataFromLocalStorage<Task>('tasks');
    console.log('Tâches récupérées :', tasks);
    return tasks;
}

// Suppression d'une tâche
export function deleteTask(id: string): void {
    const tasks = getDataFromLocalStorage<Task>('tasks');
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveDataToLocalStorage('tasks', updatedTasks);
}

// Sauvegarde d'un nouveau projet
export function saveProject(project: Project): void {
    const projects = getDataFromLocalStorage<Project>('projects');
    const newProject: Project = {
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
export function getProjects(): Project[] {
    return getDataFromLocalStorage<Project>('projects');
}

// Suppression d'un projet
export function deleteProject(id: string): void {
    const projects = getDataFromLocalStorage<Project>('projects');
    const updatedProjects = projects.filter(project => project.id !== id);
    saveDataToLocalStorage('projects', updatedProjects);
}

// Sauvegarde de la liste des utilisateurs
export function saveUsers(users: User[]): void {
    if (!Array.isArray(users)) {
        console.error("Les données à sauvegarder ne sont pas un tableau valide.");
        return;
    }
    saveDataToLocalStorage('users', users);
}

// Récupération de la liste des utilisateurs
export function getUsers(): User[] {
    return getDataFromLocalStorage<User>('users');
}

// Récupération d'un utilisateur par ID
export function getUserById(userId: string): User | undefined {
    const users = getDataFromLocalStorage<User>('users');
    return users.find(user => user.id === userId);
}

// Mise à jour d'un utilisateur
export function updateUser(updatedUser: User): void {
    const users = getDataFromLocalStorage<User>('users');
    const index = users.findIndex(user => user.id === updatedUser.id);

    if (index !== -1) {
        users[index] = updatedUser;
        saveDataToLocalStorage('users', users);
    }
}

// Sauvegarde du profil utilisateur
export function saveUserProfile(profile: User): void {
    localStorage.setItem('userProfile', JSON.stringify(profile));
}

// Correction des utilisateurs sans ID
function fixUsersWithoutId(): void {
    const users = getDataFromLocalStorage<User>('users').map(user => {
        if (!user.id) {
            user.id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
        }
        return user;
    });
    saveDataToLocalStorage('users', users);
    console.log("Utilisateurs corrigés :", users);
}

// Appelle cette fonction une seule fois pour corriger les utilisateurs existants
fixUsersWithoutId();