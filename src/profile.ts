import { getUserById, updateUser } from './storage.js';
import { initDarkMode } from './dark-mode.js';

document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

    if (!loggedInUser.id) {
        alert("Erreur : Utilisateur introuvable !");
        return;
    }

    // Charger l'utilisateur
    const user = getUserById(loggedInUser.id);
    if (!user) {
        alert("Erreur : Utilisateur non trouvé !");
        return;
    }

    // Pré-remplir les champs
    const userNameInput = document.getElementById("userName") as HTMLInputElement;
    const userEmailInput = document.getElementById("userEmail") as HTMLInputElement;
    const profilePhotoDisplay = document.getElementById("profilePhotoDisplay") as HTMLImageElement;

    userNameInput.value = user.username || "";
    userEmailInput.value = user.email || "";

    // Affichage de la photo de profil si elle existe
    if (user.profilePhoto) {
        profilePhotoDisplay.src = user.profilePhoto;  // Si l'utilisateur a une photo enregistrée
        profilePhotoDisplay.style.display = "block";
    } else {
        profilePhotoDisplay.style.display = "none";  // Cacher l'image de profil si aucune photo n'est enregistrée
    }

    // Gestion du téléchargement de la photo de profil
    const profilePhotoInput = document.getElementById("profilePhoto") as HTMLInputElement;
    profilePhotoInput.addEventListener("change", (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgData = e.target?.result as string;
                profilePhotoDisplay.src = imgData;  // Afficher l'image téléchargée
                profilePhotoDisplay.style.display = "block";

                // Enregistrer l'image en base64 dans les données de l'utilisateur
                user.profilePhoto = imgData;
                localStorage.setItem("loggedInUser", JSON.stringify(user));  // Sauvegarder dans localStorage
            };
            reader.readAsDataURL(file);  // Convertir l'image en base64
        }
    });

    // Gestion de la soumission du formulaire
    document.getElementById("profileForm")?.addEventListener("submit", (e) => {
        e.preventDefault();

        const updatedUsername = userNameInput.value.trim();
        const updatedEmail = userEmailInput.value.trim();
        const currentPassword = (document.getElementById("currentPassword") as HTMLInputElement).value.trim();
        const newPassword = (document.getElementById("newPassword") as HTMLInputElement).value.trim();

        // Validation du mot de passe actuel
        if (currentPassword !== user.password) {
            alert("Mot de passe actuel incorrect !");
            return;
        }

        // Mise à jour des données
        const updatedUser = {
            ...user,
            username: updatedUsername,
            email: updatedEmail,
            password: newPassword || user.password, // Met à jour le mot de passe seulement si un nouveau est saisi
            profilePhoto: user.profilePhoto  // Inclure la photo de profil dans les données mises à jour
        };

        updateUser(updatedUser);
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        alert("Profil mis à jour avec succès !");
    });
});

// Initialiser le mode sombre globalement
initDarkMode();
