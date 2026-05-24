import { menuInitialize } from "../common/menu.js";

document.addEventListener('DOMContentLoaded', function() {
    
    const usernameField=document.getElementById('username-field');
    const emailField=document.getElementById('email-field');

    usernameField.textContent=user.username;
    emailField.textContent=user.email;

    const pointEl=document.getElementById('point-field');

    pointEl.textContent=point||'000';

    menuInitialize();
});