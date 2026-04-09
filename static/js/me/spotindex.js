import { menuInitialize } from "../common/menu.js";



document.addEventListener('DOMContentLoaded',()=>
{


    const mapContainer = document.getElementById('map');
    const map=L.map(mapContainer).setView([35.681236, 139.767125], 13); // 東京駅の座標を初期表示

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    menuInitialize();
});