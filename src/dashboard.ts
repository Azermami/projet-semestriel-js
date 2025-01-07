// Interface pour définir la structure d'un projet
interface Project {
    title: string;
    description: string;
    priority?: string;
    deadline?: string;
    date_creation: string;
    date_limite: string;
}

// Interface pour définir la structure d'une tâche
interface Task {
    title: string;
    description: string;
    priority?: string;
    deadline?: string;
    date_creation: string;
    date_limite: string;
}

document.addEventListener('DOMContentLoaded', () => {
    displayProjectsInDashboard();
    displayAllTasks(); // Affiche toutes les tâches, sans filtre de date
    updateDashboardStats();
});

document.addEventListener('DOMContentLoaded', () => {
    function getCurrentDate(): Date {
        return new Date();
    }

    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        currentDateElement.textContent = formatDisplayDate(getCurrentDate());
    }
    
    const prevButton = document.querySelector('.nav-btn:first-child');
    const nextButton = document.querySelector('.nav-btn:last-child');

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            const currentDate = getCurrentDate();
            currentDate.setDate(currentDate.getDate() - 1);
            updateDateAndTasks(currentDate);
        });

        nextButton.addEventListener('click', () => {
            const currentDate = getCurrentDate();
            currentDate.setDate(currentDate.getDate() + 1);
            updateDateAndTasks(currentDate);
        });
    }
});

function getProjects(): Project[] {
    const projectsJson = localStorage.getItem('projects');
    const projects = projectsJson ? JSON.parse(projectsJson) : [];
    console.log('Projets récupérés :', projects);
    return projects;
}

function getTasks(): Task[] {
    const tasksJson = localStorage.getItem('tasks');
    const tasks = tasksJson ? JSON.parse(tasksJson) : [];
    console.log('Tâches récupérées :', tasks);
    return tasks;
}

function displayProjectsInDashboard(): void {
    const projects = getProjects();
    const projectsList = document.getElementById('projectsList');
    
    if (!projectsList) {
        console.error('Élément #projectsList introuvable.');
        return;
    }

    projectsList.innerHTML = '';
    projects.forEach((project: Project) => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-item';
        const progress = calculateProgress(project.date_creation, project.date_limite);
        
        projectElement.innerHTML = `
            <div class="project-indicator" style="background-color: ${getRandomColor()}"></div>
            <div class="project-content">
                <div class="project-title">${project.title}</div>
                <div class="project-description">${project.description}</div>
                <div class="project-date">${project.deadline}</div>
            </div>
        `;
        projectsList.appendChild(projectElement);
    });
}


function displayAllTasks(): void {
    console.log('Affichage de toutes les tâches...');
    const tasks = getTasks();  // Récupère toutes les tâches sans filtrer par date
    displayTasks(tasks);  // Affiche toutes les tâches récupérées
}

function displayTasks(tasks: Task[]): void {
    const tasksList = document.getElementById('tasksList');

    if (!tasksList) {
        console.error('Élément #tasksList introuvable.');
        return;
    }

    // Trier les tâches par date limite (la plus proche en premier)
    tasks.sort((a, b) => {
        const dateA = new Date(a.date_limite).getTime();
        const dateB = new Date(b.date_limite).getTime();
        return dateA - dateB; // Tri croissant
    });

    tasksList.innerHTML = '';
    if (tasks.length === 0) {
        tasksList.innerHTML = '<p>Aucune tâche pour cette date</p>';
        return;
    }

    tasks.forEach((task: Task) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        const progress = calculateProgress(task.date_creation, task.date_limite);
        
        taskElement.innerHTML = `
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-project">${task.description}</div>
            </div>
        `;
        tasksList.appendChild(taskElement);
    });
}



function calculateProgress(dateCreation: string, date_limite: string): number {
    const creationDate = new Date(dateCreation);
    const deadlineDate = new Date(date_limite);
    const currentDate = new Date();

    if (currentDate >= deadlineDate) return 100;
    if (currentDate <= creationDate) return 0;

    const totalDuration = deadlineDate.getTime() - creationDate.getTime();
    const elapsedDuration = currentDate.getTime() - creationDate.getTime();

    return Math.round((elapsedDuration / totalDuration) * 100);
}

function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDisplayDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function updateDateAndTasks(date: Date): void {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        currentDateElement.textContent = formatDisplayDate(date);
    }
    const tasks = getTasks();
    const filteredTasks = filterTasksForToday(tasks, date);
    displayTasks(filteredTasks);
}

function updateDashboardStats() {
  try {
    requestAnimationFrame(() => {
      const tasks = getTasks();
      const projects = getProjects();
      
      const inProgressTasksElement = document.getElementById('inProgressTasks');
      const inProgressProjectsElement = document.getElementById('inProgressProjects');
      
      if (inProgressTasksElement) {
        inProgressTasksElement.textContent = tasks.length.toString();
      }
      
      if (inProgressProjectsElement) {
        inProgressProjectsElement.textContent = projects.length.toString();
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques:', error);
  }
}
function filterTasksForToday(tasks: Task[], date: Date): Task[] {
    const formattedDate = formatDate(date);
    return tasks.filter(task => formatDate(new Date(task.date_limite)) === formattedDate);
}