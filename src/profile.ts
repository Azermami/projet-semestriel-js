import { Auth } from './auth';

document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.isAuthenticated()) {
        window.location.href = "login.html";
    }

    const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

    (document.getElementById("userName") as HTMLInputElement).value = user.username || '';
    (document.getElementById("userEmail") as HTMLInputElement).value = user.email || '';

    document.getElementById("profileForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        user.username = (document.getElementById("userName") as HTMLInputElement).value;
        user.email = (document.getElementById("userEmail") as HTMLInputElement).value;

        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert("Profile updated successfully!");
    });
});