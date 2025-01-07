import { initDarkMode } from './dark-mode.js';

interface User {
    username: string;
    password: string;
    id_utilisateur: string;
}

interface Project {
    nom_projet?: string;
    description?: string;
    date_limite?: string;
    id_utilisateur?: string;
}

interface Task {
    nom_tache?: string;
    description?: string;
    date_limite?: string;
    id_utilisateur?: string;
}

// Charger dynamiquement la sidebar
document.addEventListener("DOMContentLoaded", () => {
    fetch('sidebar.html')
        .then(response => response.text())
        .then(data => {
            const sidebarContainer = document.getElementById('sidebar-container');
            if (sidebarContainer) {
                sidebarContainer.innerHTML = data;
            }
        })
        .catch(error => console.error('Erreur lors du chargement de la sidebar:', error));

    loadDashboard();
});

// Charger le tableau de bord
function loadDashboard(): void {
    const userInfoDiv = document.getElementById('user-info') as HTMLDivElement;
    const loggedInUser: User | null = JSON.parse(localStorage.getItem("loggedInUser") || "null");

    if (loggedInUser) {
        userInfoDiv.innerHTML = `<h1 class="text-2xl font-bold">Bienvenue sur le Dashboard <strong>${loggedInUser.username}</strong></h1>`;
    } else {
        userInfoDiv.innerHTML = `<p class="text-lg">Vous n'êtes pas connecté.</p>`;
    }

    loadTasks();  // Charger les tâches après l'authentification
    displayCalendar();
}

// Récupérer les projets de l'utilisateur connecté
function getProjectsByUser(userId: string): Project[] {
    const allProjects: Project[] = JSON.parse(localStorage.getItem("projects") || "[]");
    return allProjects.filter(project => project.id_utilisateur === userId);
}

// Récupérer les tâches de l'utilisateur connecté
function getTasksByUser(userId: string): Task[] {
    const allTasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
    return allTasks.filter(task => task.id_utilisateur === userId);
}

// Filtrer les éléments à venir et trier par date limite
function filterUpcomingItems<T extends { date_limite?: string }>(items: T[], daysAhead: number = 7): T[] {
    const now = new Date().getTime();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return items.filter(item => {
        const itemDate = new Date(item.date_limite || "").getTime();
        if (isNaN(itemDate)) {
            console.error(`Date invalide pour l'élément: ${item.date_limite}`);
            return false;
        }
        return itemDate >= now && itemDate <= futureDate.getTime();
    }).sort((a, b) => new Date(a.date_limite || "").getTime() - new Date(b.date_limite || "").getTime());
}

// Fonction pour charger les tâches
function loadTasks() {
    const loggedInUser: User | null = JSON.parse(localStorage.getItem("loggedInUser") || "null");

    if (!loggedInUser) return;

    const userTasks = getTasksByUser(loggedInUser.id_utilisateur);  // Récupérer les tâches de l'utilisateur connecté
    const upcomingTasks = filterUpcomingItems(userTasks);  // Filtrer les tâches à venir
    displayTasks(upcomingTasks);
}

// Fonction pour afficher les tâches dans le DOM
function displayTasks(tasks: Task[] = []) {
    const tachesListeDiv = document.getElementById('taches-liste');
    if (tachesListeDiv) {
        tachesListeDiv.innerHTML = ''; // Efface les tâches existantes
        if (tasks.length === 0) {
            tachesListeDiv.innerHTML = `<p class="text-gray-600">Aucune tâche à venir.</p>`;
        } else {
            tasks.forEach(task => {
                const tacheElement = document.createElement('div');
                tacheElement.classList.add('task');
                tacheElement.innerHTML = `
                    <p><strong>${task.nom_tache || "Sans titre"}</strong></p>
                    <p>${task.description || "Aucune description"}</p>
                    <p>Limite: ${task.date_limite ? new Date(task.date_limite).toLocaleDateString() : "Non définie"}</p>
                `;
                tachesListeDiv.appendChild(tacheElement);
            });
        }
    }
}

// Afficher le calendrier hebdomadaire
function displayCalendar(): void {
    const loggedInUser: User | null = JSON.parse(localStorage.getItem("loggedInUser") || "null");

    if (!loggedInUser) return;

    const tasks = getTasksByUser(loggedInUser.id_utilisateur);  // Utilisation de l'ID utilisateur
    const projects = getProjectsByUser(loggedInUser.id_utilisateur);

    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        return date.toISOString().split("T")[0];
    });

    const itemsByDay: { [key: string]: string[] } = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
    };

    tasks.forEach(task => {
        if (task.date_limite && daysOfWeek.includes(task.date_limite)) {
            const dayKey = getDayKey(new Date(task.date_limite));
            itemsByDay[dayKey].push(`Tâche: ${task.nom_tache || "Sans titre"}`);
        }
    });

    projects.forEach(project => {
        if (project.date_limite && daysOfWeek.includes(project.date_limite)) {
            const dayKey = getDayKey(new Date(project.date_limite));
            itemsByDay[dayKey].push(`Projet: ${project.nom_projet || "Sans titre"}`);
        }
    });

    Object.entries(itemsByDay).forEach(([day, items]) => {
        const cell = document.getElementById(day) as HTMLTableCellElement;
        if (cell) {
            cell.innerHTML = items.length > 0 ? items.join('<br>') : "Aucun élément.";
        }
    });
}

function getDayKey(date: Date): string {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days[date.getDay() - 1] || 'sunday';
}

initDarkMode();
