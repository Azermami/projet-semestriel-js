import { saveProject, getProjects, deleteProject } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const projectList = getProjects();
    displayProjects(projectList);

    document.getElementById("addProjectForm")?.addEventListener("submit", (e) => {
        e.preventDefault();

        // Récupérer l'ID du projet à modifier (s'il existe)
        const projectId = (document.getElementById("projectId") as HTMLInputElement)?.value;

        const newProject = {
            id: projectId || Date.now().toString(), // Générer un ID si c'est un nouveau projet
            nom_projet: (document.getElementById("projectTitle") as HTMLInputElement).value.trim(),
            description: (document.getElementById("projectDescription") as HTMLTextAreaElement).value.trim(),
            priorite: (document.getElementById("projectPriority") as HTMLSelectElement).value,
            date_limite: (document.getElementById("projectDeadline") as HTMLInputElement).value,
            id_utilisateur_attribue: JSON.parse(localStorage.getItem("loggedInUser") || "{}").id
        };

        // Vérification des champs requis
        if (!newProject.nom_projet || !newProject.description || !newProject.date_limite) {
            alert("Tous les champs sont obligatoires !");
            return;
        }

        if (projectId) {
            // Mettre à jour le projet existant
            updateProject(newProject);
        } else {
            // Ajouter un nouveau projet
            saveProject(newProject);
        }

        // Actualiser l'affichage et vider le formulaire
        displayProjects(getProjects());
        document.getElementById("addProjectForm")?.reset();

        // Supprimer l'ID caché du projet après mise à jour
        const hiddenProjectIdField = document.getElementById("projectId") as HTMLInputElement;
        if (hiddenProjectIdField) hiddenProjectIdField.remove();

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
                <td>${project.nom_projet || "Sans titre"}</td>
                <td>${project.description || "Sans description"}</td>
                <td>${project.priorite || "Non définie"}</td>
                <td>${project.date_limite || "Non définie"}</td>
                <td>
                    <button class="editProjectBtn bg-blue-500 text-white px-2 py-1 rounded" data-id="${project.id}">Modifier</button>
                    <button class="deleteProjectBtn bg-red-500 text-white px-2 py-1 rounded" data-id="${project.id}">Supprimer</button>
                </td>
            `;
            projectTableBody.appendChild(row);
        });

        // Ajouter des écouteurs aux boutons d'action
        addProjectButtonListeners();
    }
}

// Fonction pour ajouter des écouteurs d'événements aux boutons
function addProjectButtonListeners() {
    // Boutons de suppression
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

    // Boutons de modification
    const editButtons = document.querySelectorAll(".editProjectBtn");
    editButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const projectId = (e.target as HTMLButtonElement).dataset.id;
            if (projectId) {
                const projectToEdit = getProjects().find(project => project.id === projectId);
                if (projectToEdit) {
                    // Remplir le formulaire avec les données du projet
                    (document.getElementById("projectTitle") as HTMLInputElement).value = projectToEdit.nom_projet || "";
                    (document.getElementById("projectDescription") as HTMLTextAreaElement).value = projectToEdit.description || "";
                    (document.getElementById("projectPriority") as HTMLSelectElement).value = projectToEdit.priorite || "moyenne";
                    (document.getElementById("projectDeadline") as HTMLInputElement).value = projectToEdit.date_limite || "";

                    // Ajouter un champ caché pour stocker l'ID du projet
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

// Fonction pour mettre à jour un projet existant
function updateProject(updatedProject: any): void {
    let projects = getProjects();
    projects = projects.map(project => project.id === updatedProject.id ? updatedProject : project);
    localStorage.setItem("projects", JSON.stringify(projects));
}