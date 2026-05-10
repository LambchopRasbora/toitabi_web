import { mapIcons } from "../common/map/mapicons.js";
import { mapInitialize } from "../common/map/mapInitialize.js";
import { menuInitialize } from "../common/menu.js";

function putSpotButton(spotId)
{
    location.href='/me/spotdetail?spotId=' + spotId;
}

function initSpotMarker(map,spot)
{
    const latitude=spot.latitude;
    const longitude=spot.longitude;

    const img=spot.images[0]??"/asset/images/default/NoImage.jpg";

    const imgHeight=50;
    const arrowHeight=10;

    const divicon = L.divIcon({
        className: 'spot-marker',
        html: `<div class="spot-marker-image"><img class="marker-image" src="${img}" /></div>`,
        iconSize: [60, imgHeight+arrowHeight], 
        iconAnchor: [30, imgHeight+arrowHeight]
    });

    const marker = L.marker([latitude, longitude], { icon: divicon }).addTo(map);
    marker.on("click", ()=>{putSpotButton(spot.spotId);});

    return marker;
}

function initSpotDetail(template,parent,spot)
{
    const imgs=spot.images??["/asset/images/default/NoImage.jpg"];
    const description=spot.description??"説明なし";
    const tags=spot.tags??[];

    let tag_string="";

    tags.forEach(t=>tag_string+=(" #"+t.name));

    const fragment=template.content.cloneNode(true);

    fragment.querySelector(".description").textContent=description;
    fragment.querySelector(".spot-main-img").src=imgs[0];
    fragment.querySelector(".tag").textContent=tag_string;

    fragment.querySelector(".spot-card").addEventListener("click",()=>{putSpotButton(spot.spotId);});

    parent.appendChild(fragment);
}

document.addEventListener('DOMContentLoaded',()=>
{
    const mapContainer = document.getElementById('map');
    const map=mapInitialize(mapContainer);
    const spotDetailCard=document.getElementById("spot-detail-container");
    const spotDetailTemplate=document.getElementById("spot-detail-template");

    spots.forEach(spot => {
        initSpotMarker(map,spot); 
        initSpotDetail(spotDetailTemplate,spotDetailCard,spot);
    });
    if(spots.length<=0)
    {
        initSpotDetail(spotDetailTemplate,spotDetailCard,{
            images:[],
            description:"投稿されたスポットはありません",
            tags:[]
        });
    }

    menuInitialize();
});