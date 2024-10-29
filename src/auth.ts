export class Auth {
    static async hashPassword(password: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    static async login(username: string, password: string): Promise<boolean> {
        const userData = JSON.parse(localStorage.getItem("users") || "[]");
        const hashedPassword = await Auth.hashPassword(password);
        const user = userData.find((user: any) => user.username === username && user.password === hashedPassword);
        
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