import { mapIcons } from "../common/map/mapicons.js";
import { mapInitialize } from "../common/map/mapInitialize.js";
import { menuInitialize } from "../common/menu.js";

function initSpotMarker(map,spot)
{
    const latitude=spot.latitude;
    const longitude=spot.longitude;

    const divicon = L.divIcon({
        className: 'spot-marker',
        html: `<img src="${spot.images[0]}" class="spot-marker-image"/>`,
        iconSize: [60, 70], 
        iconAnchor: [30, 70]
    });

    const marker = L.marker([latitude, longitude], { icon: divicon }).addTo(map);
    marker.on("click", ()=>{location.href='/me/spotdetail?spotId=' + spot.spotId;});

    return marker;
}

document.addEventListener('DOMContentLoaded',()=>
{
    const mapContainer = document.getElementById('map');
    const map=mapInitialize(mapContainer);

    spots.forEach(spot => {initSpotMarker(map,spot); });

    menuInitialize();
});