import { Auth } from './auth';

document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.isAuthenticated()) {
        window.location.href = "login.html";
    }
    
    document.getElementById("logoutButton")?.addEventListener("click", () => {
        Auth.logout();
    });

    document.getElementById("createTaskButton")?.addEventListener("click", () => {
        window.location.href = "task.html";
    });

    document.getElementById("profileButton")?.addEventListener("click", () => {
        window.location.href = "profile.html";
    });

    // Affichage dynamique de certaines sections du tableau de bord
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    if (user) {
        document.getElementById("welcomeMessage")!.textContent = `Bienvenue, ${user.nom}`;
    }
});