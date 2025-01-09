document.addEventListener("DOMContentLoaded", () => {
    displayProjects();

    // Écouter la soumission du formulaire d'ajout de projet
    const form = document.getElementById("addProjectForm") as HTMLFormElement;
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Récupération des données du formulaire
        const title = (document.getElementById("projectTitle") as HTMLInputElement).value;
        const description = (document.getElementById("projectDescription") as HTMLTextAreaElement).value;
        const startDate = (document.getElementById("projectStartDate") as HTMLInputElement).value;
        const endDate = (document.getElementById("projectEndDate") as HTMLInputElement).value;
        const status = (document.getElementById("projectStatus") as HTMLSelectElement).value;

        // Créer un objet projet
        const newProject: Project = {
            id: Date.now().toString(),
            title,
            description,
            priority: (document.getElementById("projectPriority") as HTMLSelectElement).value,
            startDate,
            endDate,
            status,
        };

        // Ajouter le projet au localStorage
        addProject(newProject);

        // Afficher les projets après l'ajout
        displayProjects();

        // Afficher une notification de succès
        showNotification("Projet ajouté avec succès !", "success");

        // Réinitialiser le formulaire
        form.reset();
    });
});

// Fonction pour afficher les projets dans le tableau
function displayProjects() {
    const tableBody = document.getElementById("projectTableBody")!;
    tableBody.innerHTML = ""; // Vider la table avant de la remplir

    const projects = getProjects();

    // Remplir le tableau avec les projets
    projects.forEach((project) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${project.title}</td>
            <td>${project.description}</td>
            <td>${project.priority}</td>
            <td>${project.startDate}</td>
            <td>${project.endDate}</td>
            <td>
                <button class="edit-btn" data-id="${project.id}">Modifier</button>
                <button class="delete-btn" data-id="${project.id}">Supprimer</button>
            </td>
            <td>${project.status}</td>
        `;
        tableBody.appendChild(row);
    });

    // Ajouter les événements de modification et de suppression
    document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
            const projectId = (e.target as HTMLElement).getAttribute("data-id");
            if (projectId) {
                editProject(projectId);
            }
        });
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
            const projectId = (e.target as HTMLElement).getAttribute("data-id");
            if (projectId) {
                deleteProject(projectId);
            }
        });
    });
}

// Récupérer les projets depuis le stockage local
function getProjects(): Project[] {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    return projects;
}

// Ajouter un projet
function addProject(project: Project) {
    const projects = getProjects();
    projects.push(project);
    localStorage.setItem("projects", JSON.stringify(projects));
}

// Modifier un projet
function editProject(id: string) {
    const projects = getProjects();
    const project = projects.find((p) => p.id === id);

    if (project) {
        // Mettre à jour les champs du formulaire avec les informations du projet
        (document.getElementById("projectTitle") as HTMLInputElement).value = project.title;
        (document.getElementById("projectDescription") as HTMLTextAreaElement).value = project.description;
        (document.getElementById("projectStartDate") as HTMLInputElement).value = project.startDate;
        (document.getElementById("projectEndDate") as HTMLInputElement).value = project.endDate;
        (document.getElementById("projectStatus") as HTMLSelectElement).value = project.status;

        // Supprimer le projet original pour le remplacer plus tard
        deleteProject(id);

        // Afficher une notification de modification
        showNotification("Projet modifié avec succès !", "info");
    }
}

// Supprimer un projet
function deleteProject(id: string) {
    let projects = getProjects();
    projects = projects.filter((p) => p.id !== id);
    localStorage.setItem("projects", JSON.stringify(projects));

    // Afficher les projets après suppression
    displayProjects();

    // Afficher une notification de suppression
    showNotification("Projet supprimé avec succès !", "danger");
}

// Fonction pour afficher une notification
function showNotification(message: string, type: "success" | "info" | "danger") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Ajouter la notification au corps de la page
    document.body.appendChild(notification);

    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
