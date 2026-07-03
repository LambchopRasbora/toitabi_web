 
import { post, postApi } from "../common/serverRequest.js";
import { menuInitialize}from "../common/menu.js";
import { locateInitialize, mapInitialize, polygonInitialize } from "../common/map/mapInitialize.js"
import { mapIcons } from "../common/map/mapicons.js";
import SpotDescriptionCard from "../components/spot-description-card.js";
import PhotoGallery from "../components/photo-gallery.js";

// —— 現在地マップ（Leaflet） —— //
//マップオブジェクトの作成
const mapElement = document.getElementById("map");
const map = mapInitialize(mapElement);

//位置情報初期設定
const lc=locateInitialize(map);


//ドキュメントが読み込まれた際のイベント
document.addEventListener('DOMContentLoaded',()=>{

  const {createApp}=Vue;
  createApp({
    data(){
      return {
        spotPhotos:spot.images,
        spottags:spot.tags,
      }
    },
    components:{
      'spot-description-card': SpotDescriptionCard,
      'photo-gallery':PhotoGallery
    }
  }).mount('#scrollArea');
  menuInitialize();
});