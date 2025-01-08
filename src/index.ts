import { Auth } from './auth';

document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.isAuthenticated() && window.location.pathname !== '/login.html') {
        window.location.href = "login.html";
    }

    if (Auth.isAuthenticated() && window.location.pathname === '/login.html') {
        window.location.href = "dashboard.html";
    }
});
// Fonction pour sauvegarder un projet dans localStorage
export interface Project {
    id: string; // ID unique
    nom_projet: string; // Nom du projet
    description: string; // Description
    date_debut: string; // Date de début
    date_fin: string; // Date de fin
    statut: string; // Statut du projet
    utilisateur_id: string; // ID de l'utilisateur
    date_creation: string; // Date de création
}
