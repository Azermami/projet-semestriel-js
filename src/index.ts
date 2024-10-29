import { Auth } from './auth';

document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.isAuthenticated() && window.location.pathname !== '/login.html') {
        window.location.href = "login.html";
    }

    if (Auth.isAuthenticated() && window.location.pathname === '/login.html') {
        window.location.href = "dashboard.html";
    }
});
