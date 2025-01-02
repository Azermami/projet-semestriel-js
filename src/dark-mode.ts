export function initDarkMode() {
    document.addEventListener("DOMContentLoaded", () => {
        const darkModeToggle = document.getElementById("darkModeToggle") as HTMLInputElement;

        // Vérifiez si le toggle existe
        if (darkModeToggle) {
            // Charger la préférence depuis localStorage
            const isDarkMode = localStorage.getItem("darkMode") === "true";

            if (isDarkMode) {
                document.body.classList.add("dark-mode");
                darkModeToggle.checked = true; 
            } else {
                document.body.classList.remove("dark-mode");
            }

            // Gérer les changements sur le toggle
            darkModeToggle.addEventListener("change", () => {
                if (darkModeToggle.checked) {
                    document.body.classList.add("dark-mode");
                    localStorage.setItem("darkMode", "true");
                } else {
                    document.body.classList.remove("dark-mode");
                    localStorage.setItem("darkMode", "false");
                }
            });
        } else {
            // Appliquer le mode sombre si activé, même sans toggle
            const isDarkMode = localStorage.getItem("darkMode") === "true";
            if (isDarkMode) {
                document.body.classList.add("dark-mode");
            } else {
                document.body.classList.remove("dark-mode");
            }
        }
    });
}
