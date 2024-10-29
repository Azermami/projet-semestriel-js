import { Auth } from './auth';

document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.isAuthenticated()) {
        window.location.href = "login.html";
        return; // Sortir de la fonction si l'utilisateur n'est pas authentifié
    }

    // Récupérer les informations de l'utilisateur depuis le localStorage
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

    // Vérifiez que les informations utilisateur sont disponibles
    if (!user || !user.username || !user.email) {
        alert("Erreur: informations utilisateur non disponibles.");
        return;
    }

    // Charger les informations de l'utilisateur dans les champs du formulaire
    (document.getElementById("userName") as HTMLInputElement).value = user.username;
    (document.getElementById("userEmail") as HTMLInputElement).value = user.email;

    // Écouteur d'événements pour la soumission du formulaire
    document.getElementById("profileForm")?.addEventListener("submit", (e) => {
        e.preventDefault();

        const currentPassword = (document.getElementById("currentPassword") as HTMLInputElement).value;
        const newPassword = (document.getElementById("newPassword") as HTMLInputElement).value;

        // Vérifiez si le mot de passe actuel est correct
        if (currentPassword !== user.password) {
            alert("Le mot de passe actuel est incorrect !");
            return;
        }

        // Mettre à jour les informations de profil
        user.username = (document.getElementById("userName") as HTMLInputElement).value;
        user.email = (document.getElementById("userEmail") as HTMLInputElement).value;

        // Si un nouveau mot de passe est fourni, le mettre à jour
        if (newPassword) {
            user.password = newPassword;
        }

        // Sauvegarder les modifications dans le localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert("Profile updated successfully!");
    });
});
