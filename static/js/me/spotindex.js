import { mapIcons } from "../common/map/mapicons.js";
import { mapInitialize } from "../common/map/mapInitialize.js";
import { menuInitialize } from "../common/menu.js";
import SpotReviewCard from "../components/spot_review_card.js";
import ToitabiFooter from "../components/toitabi-footer.js"

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


document.addEventListener('DOMContentLoaded',()=>
{
    const mapContainer = document.getElementById('map');
    const map=mapInitialize(mapContainer);

    
    if(spots.length>=0)
    {
      spots.forEach(spot => {
            initSpotMarker(map,spot); 
        });
    }

    const {createApp}=Vue;

    createApp({
        data(){
          return {
            spots:spots
          }
        },
        methods:{
            putSpotButton
        },
        components:{
          'spot-review-card':SpotReviewCard
        }
      }).mount('#spot-detail-container');

     createApp({
        data(){
          return {
            leftContents:[
              {
                caption:"ホームへ戻る",
                class:"home-btn",
                icon:"/asset/images/icon/icon_home.png",
                onClick:()=>{location.href='/';}
              }],
            rightContents:[
              {
                caption:"スポット投稿",
                class:"spot-btn",
                icon:"/asset/images/icon/icon_post.png",
                onClick:()=>{location.href='/spotpost/capture';}
              }]
          }
        },
        components:{
          'toitabi-footer':ToitabiFooter
        }
      }).mount('#footer');

    menuInitialize();
});