export class Auth {
    static login(username: string, password: string): boolean {
        const userData = JSON.parse(localStorage.getItem("users") || "[]");
        const user = userData.find((user: any) => user.username === username && user.password === password);
        
        if (user) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
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
}
