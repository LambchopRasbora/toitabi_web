import { mapIcons } from "../common/map/mapicons.js";
import { mapInitialize } from "../common/map/mapInitialize.js";
import { menuInitialize } from "../common/menu.js";
import PhotoGallery from "../components/photo-gallery.js";
import SpotDescriptionCard from "../components/spot-description-card.js";

document.addEventListener('DOMContentLoaded', function() {

  const {createApp}=Vue;
  createApp({
    data(){
      return {
        spotPhotos:spot.images,
        spottags:spot.tags,
      }
    },
    components:{
      'photo-gallery':PhotoGallery,
      'spot-description-card':SpotDescriptionCard
    }
  }).mount('#spot-detail-screen');

  //場所を示すマップとマーカーの設定
  const mapElement=document.getElementById('map');
  const map=mapInitialize(mapElement);
  map.setView([spot.latitude, spot.longitude], 15);
  L.marker([spot.latitude, spot.longitude],{icon:mapIcons.postedSpotIcon}).addTo(map);

  menuInitialize();
});
