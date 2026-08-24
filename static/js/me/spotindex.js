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

function updateMapMarkers(map,markerMap,filteredSpots) {
  // 表示対象の spotId の Set を作成（O(1) ルックアップ用）
  const visibleSpotIds = new Set(filteredSpots.map(s => s.spotId));
  const activeLatLngs=[]; 

  markerMap.forEach((marker, spotId) => {
      if (visibleSpotIds.has(spotId)) {
          if (!map.hasLayer(marker)) {
              map.addLayer(marker);
          }
          activeLatLngs.push(marker.getLatLng());
      } else {
        if (map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
      }
  });

  if(activeLatLngs.length>1)
  {
    const bounds=L.latLngBounds(activeLatLngs);
    map.fitBounds(bounds,{ padding: [50, 50] });
  }
  else if(activeLatLngs.length==1)
  {
    map.setView(activeLatLngs[0], 15);
  }
}

document.addEventListener('DOMContentLoaded',()=>
{
    const mapContainer = document.getElementById('map');
    const map=mapInitialize(mapContainer);
    const markerMap=new Map();
    
    if(spots.length>=0)
    {
      spots.forEach(spot => {
            const marker= initSpotMarker(map,spot); 
            markerMap.set(spot.spotId,marker);
        });
    }

    const {createApp}=Vue;

    createApp({
        data(){
          return {
            spots:spots,
            searchQuery:''
          }
        },
        computed:{
          filterdSpots(){
            const query= this.searchQuery.trim().toLowerCase();
            if(!query)return this.spots;

            return this.spots.filter(spot=>{
              const matchDesc=spot.description && spot.description.toLowerCase().includes(query);

              const matchTags = spot.tags && spot.tags.some(tag => tag.name && tag.name.toLowerCase().includes(query));

              return matchDesc||matchTags;
            })
          }
        },
        methods:{
            putSpotButton
        },
        watch:{
          filterdSpots:{
            handler(newSpots){
              updateMapMarkers(map,markerMap,newSpots);
            }
          }
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