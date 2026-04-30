import { menuInitialize } from "../common/menu.js";

document.addEventListener('DOMContentLoaded', function() {
    menuInitialize();

    var form = document.querySelector('.login-form');
    if(!form) return;
    form.addEventListener('submit', function(e){
        if(!form.reportValidity()) e.preventDefault();
    });
});