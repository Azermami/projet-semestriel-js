document.addEventListener('DOMContentLoaded', () => {
    // Récupérer l'utilisateur connecté depuis le localStorage
    const user: { username?: string } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

    // Mettre à jour le nom de l'utilisateur affiché
    const userNameDisplay = document.getElementById("user-username");
    const welcomeUserName = document.getElementById("welcomeUserName");
    if (userNameDisplay) {
        userNameDisplay.innerHTML = `<strong>${user.username || 'Invité'}</strong>`;
    }
    if (welcomeUserName) {
        welcomeUserName.textContent = user.username || 'Invité';
    }

    // Mettre à jour le nombre de tâches en cours et terminées
    const tasks: { etat_tache: string }[] = JSON.parse(localStorage.getItem("tasks") || "[]");
    const inProgressTasks = tasks.filter(task => task.etat_tache === 'pending').length;
    const completedTasks = tasks.filter(task => task.etat_tache === 'completed').length;

    const inProgressTasksElement = document.getElementById("inProgressTasks");
    const completedTasksElement = document.getElementById("completedTasks");

    if (inProgressTasksElement) {
        inProgressTasksElement.textContent = inProgressTasks.toString();
    }
    if (completedTasksElement) {
        completedTasksElement.textContent = completedTasks.toString();
    }
});