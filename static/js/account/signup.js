import { menuInitialize } from "../common/menu.js";

document.addEventListener('DOMContentLoaded', function() {
    menuInitialize();

    if(error)
    {
        const errorArea=document.getElementById("error-message");
        errorArea.textContent = error;
        alert(error);
    }
});