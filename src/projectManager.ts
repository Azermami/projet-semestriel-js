import { saveProject, getProjects, deleteProject } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const projectList = getProjects();
    displayProjects(projectList);

    document.getElementById("addProjectForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const projectId = (document.getElementById("projectId") as HTMLInputElement)?.value; // Récupérez l'ID du projet à modifier

        const newProject = {
            id: projectId || Date.now().toString(), // Utiliser l'ID existant ou créer un nouvel ID
            nom_projet: (document.getElementById("projectTitle") as HTMLInputElement).value,
            description: (document.getElementById("projectDescription") as HTMLTextAreaElement).value,
            priorite: (document.getElementById("projectPriority") as HTMLSelectElement).value,
            date_limite: (document.getElementById("projectDeadline") as HTMLInputElement).value,
            id_utilisateur_attribue: JSON.parse(localStorage.getItem("loggedInUser") || "{}").id
        };

        // Vérifiez si nous modifions un projet existant ou en ajoutons un nouveau
        if (projectId) {
            updateProject(newProject); // Appel de la fonction de mise à jour
        } else {
            saveProject(newProject);
        }

        displayProjects(getProjects());
        alert(projectId ? "Projet modifié avec succès !" : "Projet enregistré avec succès !");
    });
});

// Fonction pour afficher les projets
function displayProjects(projects: any[]) {
    const projectTableBody = document.getElementById("projectTableBody");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

    if (projectTableBody) {
        projectTableBody.innerHTML = '';
        const userProjects = projects.filter(project => project.id_utilisateur_attribue === loggedInUser.id);

        userProjects.forEach(project => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${project.nom_projet}</td>
                <td>${project.description}</td>
                <td>${project.priorite}</td>
                <td>${project.date_limite}</td>
                <td>
                    <button class="editProjectBtn" data-id="${project.id}">Modifier</button>
                    <button class="deleteProjectBtn" data-id="${project.id}">Supprimer</button>
                </td>
            `;
            projectTableBody.appendChild(row);
        });

        // Ajoutez des gestionnaires d'événements pour les boutons
        addProjectButtonListeners();
    }
}

// Fonction pour ajouter des écouteurs d'événements aux boutons
function addProjectButtonListeners() {
    const deleteButtons = document.querySelectorAll(".deleteProjectBtn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const projectId = (e.target as HTMLButtonElement).dataset.id;
            if (projectId) {
                deleteProject(projectId);
                displayProjects(getProjects());
                alert("Projet supprimé avec succès !");
            }
        });
    });

    const editButtons = document.querySelectorAll(".editProjectBtn");
    editButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const projectId = (e.target as HTMLButtonElement).dataset.id;
            if (projectId) {
                const projectToEdit = getProjects().find(project => project.id === projectId);
                if (projectToEdit) {
                    // Remplir le formulaire avec les données du projet à modifier
                    (document.getElementById("projectTitle") as HTMLInputElement).value = projectToEdit.nom_projet;
                    (document.getElementById("projectDescription") as HTMLTextAreaElement).value = projectToEdit.description;
                    (document.getElementById("projectPriority") as HTMLSelectElement).value = projectToEdit.priorite;
                    (document.getElementById("projectDeadline") as HTMLInputElement).value = projectToEdit.date_limite;

                    // Ajouter un champ caché pour l'ID du projet à modifier
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

// Fonction pour mettre à jour un projet
function updateProject(updatedProject: any) {
    let projects = getProjects();
    projects = projects.map(project => project.id === updatedProject.id ? updatedProject : project);
    localStorage.setItem('projects', JSON.stringify(projects));
}