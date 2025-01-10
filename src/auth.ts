class Auth {
    static login(username: string, password: string): boolean {
        const userData = JSON.parse(localStorage.getItem("users") || "[]");
        const user = userData.find((user: any) => user.username === username && user.password === password);

        if (user) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            const photoDisplay = document.getElementById("profilePhotoDisplay") as HTMLImageElement;

            if (photoDisplay) {
                // Vérifier si l'utilisateur a une photo et l'afficher, sinon une photo par défaut
                photoDisplay.src = user.photo || "default-photo.png"; // Utiliser une photo par défaut si vide
                photoDisplay.style.display = "block"; // Afficher l'image après le chargement
            }
            return true;
        }

        return false;
    }

    static logout(): void {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    }

    static isAuthenticated(): boolean {
        return localStorage.getItem("loggedInUser") !== null;
    }

    static applyDarkMode(user: any): void {
        const darkModePreference = user.darkMode || 'disabled';  // Vérifie si l'utilisateur a une préférence de mode sombre stockée
        if (darkModePreference === 'enabled') {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }
}

class UserManager {
    static addUser(username: string, email: string, password: string, photo: File | null = null): void {
        try {
            const users = JSON.parse(localStorage.getItem("users") || "[]");

            // Vérification des champs obligatoires
            if (!username || !email || !password) {
                console.error("Tous les champs sont requis !");
                return;
            }

            // Vérification des doublons
            const isDuplicate = users.some((user: any) => user.username === username || user.email === email);
            if (isDuplicate) {
                console.error("Cet utilisateur existe déjà !");
                return;
            }

            // Générer un ID unique
            const userId = Date.now().toString() + Math.random().toString(36).substring(2, 9);

            // Créer un utilisateur avec une photo par défaut ou téléchargée
            let userPhoto = "default-photo.png";  // Photo par défaut
            if (photo) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    userPhoto = reader.result as string;  // Convertir l'image en base64
                    const newUser = {
                        id: userId,
                        username: username,
                        email: email,
                        password: password,
                        photo: userPhoto,  // Photo de l'utilisateur
                    };

                    // Ajouter et sauvegarder l'utilisateur
                    users.push(newUser);
                    localStorage.setItem("users", JSON.stringify(users)); // Sauvegarde les utilisateurs avec la photo
                    console.log("Utilisateur ajouté avec succès :", newUser);
                };

                reader.readAsDataURL(photo);  // Convertir l'image en base64
            } else {
                const newUser = {
                    id: userId,
                    username: username,
                    email: email,
                    password: password,
                    photo: userPhoto,  // Photo de l'utilisateur
                };

                // Ajouter et sauvegarder l'utilisateur
                users.push(newUser);
                localStorage.setItem("users", JSON.stringify(users)); // Sauvegarde les utilisateurs avec la photo
                console.log("Utilisateur ajouté avec succès :", newUser);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout d'un utilisateur :", error);
        }
    }
}
