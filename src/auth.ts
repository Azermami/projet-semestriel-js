import * as bcrypt from 'bcryptjs';

class Auth {
    static login(username: string, password: string): boolean {
        const userData = JSON.parse(localStorage.getItem("users") || "[]");
        const user = userData.find((user: any) => user.username === username);

        if (user && bcrypt.compareSync(password, user.password)) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            const photoDisplay = document.getElementById("profilePhotoDisplay") as HTMLImageElement;

            if (photoDisplay) {
                photoDisplay.src = user.photo || "default-photo.png";
                photoDisplay.style.display = "block";
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
        const darkModePreference = user.darkMode || 'disabled';
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

            if (!username || !email || !password) {
                console.error("Tous les champs sont requis !");
                return;
            }

            const isDuplicate = users.some((user: any) => user.username === username || user.email === email);
            if (isDuplicate) {
                console.error("Cet utilisateur existe déjà !");
                return;
            }

            const userId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
            const hashedPassword = bcrypt.hashSync(password, 10);

            let userPhoto = "default-photo.png";
            if (photo) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    userPhoto = reader.result as string;
                    const newUser = {
                        id: userId,
                        username: username,
                        email: email,
                        password: hashedPassword,
                        photo: userPhoto,
                    };

                    users.push(newUser);
                    localStorage.setItem("users", JSON.stringify(users));
                    const userForDisplay = {
                        id: newUser.id,
                        username: newUser.username,
                        email: newUser.email,
                        photo: newUser.photo
                    };
                    console.log("Utilisateur ajouté avec succès :", userForDisplay);
                };

                reader.readAsDataURL(photo);
            } else {
                const newUser = {
                    id: userId,
                    username: username,
                    email: email,
                    password: hashedPassword,
                    photo: userPhoto,
                };

                users.push(newUser);
                localStorage.setItem("users", JSON.stringify(users));
                const userForDisplay = {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    photo: newUser.photo
                };
                console.log("Utilisateur ajouté avec succès :", userForDisplay);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout d'un utilisateur :", error);
        }
    }
}
