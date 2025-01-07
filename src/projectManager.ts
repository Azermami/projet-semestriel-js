import { saveProject, getProjects, deleteProject, getTasks } from './storage.js';

// Define Project interface if not already defined in storage.js
interface Project {
    id: string;
    nom_projet: string;
    description: string;
    priorite: string;
    date_limite: string;
    id_utilisateur_attribue: string;
    date_creation: string;
    etat_projet: string;
    progression: number;
}

document.addEventListener('DOMContentLoaded', () => {
    const projectList = getProjects();
    displayProjects(projectList);

    document.getElementById("addProjectForm")?.addEventListener("submit", (e) => {
        e.preventDefault();

        const projectId = (document.getElementById("projectId") as HTMLInputElement)?.value;

        const newProject: Project = {
            id: projectId || Date.now().toString(),
            nom_projet: (document.getElementById("projectTitle") as HTMLInputElement).value.trim(),
            description: (document.getElementById("projectDescription") as HTMLTextAreaElement).value.trim(),
            priorite: (document.getElementById("projectPriority") as HTMLSelectElement).value,
            date_limite: (document.getElementById("projectDeadline") as HTMLInputElement).value,
            id_utilisateur_attribue: JSON.parse(localStorage.getItem("loggedInUser") || "{}").id,
            date_creation: new Date().toISOString(),
            etat_projet: 'pending',
            progression: 0
        };

        if (!newProject.nom_projet || !newProject.description || !newProject.date_limite) {
            alert("Tous les champs sont obligatoires !");
            return;
        }

        if (projectId) {
            updateProject(newProject);
        } else {
            saveProject(newProject);
        }

        displayProjects(getProjects());
        (document.getElementById("addProjectForm") as HTMLFormElement)?.reset();

        const hiddenProjectIdField = document.getElementById("projectId") as HTMLInputElement;
        if (hiddenProjectIdField) hiddenProjectIdField.value = "";

        alert(projectId ? "Projet modifié avec succès !" : "Projet enregistré avec succès !");
    });
});

function displayProjects(projects: Project[]): void {
    const projectTableBody = document.getElementById("projectTableBody");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

    if (projectTableBody) {
        projectTableBody.innerHTML = '';
        const userProjects = projects.filter(project => project.id_utilisateur_attribue === loggedInUser.id);

        userProjects.forEach(project => {
            const tasks = getTasks().filter(task => task.id_projet === project.id);
            const completedTasks = tasks.filter(task => task.etat_tache === 'completed').length;
            const totalTasks = tasks.length;
            const progression = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${project.nom_projet}</td>
                <td>${project.description}</td>
                <td>${project.priorite}</td>
                <td>${project.date_limite}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progression}%"></div>
                    </div>
                </td>
                <td>
                    <button class="editProjectBtn bg-blue-500 text-white px-2 py-1 rounded" data-id="${project.id}">Modifier</button>
                    <button class="deleteProjectBtn bg-red-500 text-white px-2 py-1 rounded" data-id="${project.id}">Supprimer</button>
                </td>
            `;
            projectTableBody.appendChild(row);
        });

        addProjectButtonListeners();
    }
}

function addProjectButtonListeners(): void {
    document.querySelectorAll(".deleteProjectBtn").forEach(button => {
        button.addEventListener("click", (e) => {
            const target = e.target as HTMLButtonElement;
            const projectId = target.dataset.id;
            if (projectId) {
                deleteProject(projectId);
                displayProjects(getProjects());
                alert("Projet supprimé avec succès !");
            }
        });
    });

    document.querySelectorAll(".editProjectBtn").forEach(button => {
        button.addEventListener("click", (e) => {
            const target = e.target as HTMLButtonElement;
            const projectId = target.dataset.id;
            if (projectId) {
                const projectToEdit = getProjects().find(project => project.id === projectId);
                if (projectToEdit) {
                    (document.getElementById("projectTitle") as HTMLInputElement).value = projectToEdit.nom_projet;
                    (document.getElementById("projectDescription") as HTMLTextAreaElement).value = projectToEdit.description;
                    (document.getElementById("projectPriority") as HTMLSelectElement).value = projectToEdit.priorite;
                    (document.getElementById("projectDeadline") as HTMLInputElement).value = projectToEdit.date_limite;

                    let projectIdInput = document.getElementById("projectId") as HTMLInputElement;
                    if (!projectIdInput) {
                        projectIdInput = document.createElement("input");
                        projectIdInput.type = "hidden";
                        projectIdInput.id = "projectId";
                        document.getElementById("addProjectForm")?.appendChild(projectIdInput);
                    }
                    projectIdInput.value = projectToEdit.id;
                }
            }
        });
    });
}

function updateProject(updatedProject: Project): void {
    const projects = getProjects().map(project => 
        project.id === updatedProject.id ? updatedProject : project
    );
    localStorage.setItem("projects", JSON.stringify(projects));
}
