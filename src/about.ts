// Ajoute un écouteur d'événement sur le bouton "Retour"
const backButton = document.getElementById('backButton');
if (backButton) {
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}
interface Project {
    id: string;
    title: string;
    description: string;
    priority: string;
    startDate: string;
    endDate: string;
    status: string;

}
