import { mapIcons } from "../common/map/mapicons.js";
import {menuInitialize} from "../common/menu.js";
import { post } from "../common/serverRequest.js";
import { snsShare } from "../common/snsShare.js";
import { mapInitialize,locateInitialize, polygonInitialize } from "../common/map/mapInitialize.js";
import PhotoGallery from "../components/photo-gallery.js";
import SpotDescriptionCard from "../components/spot-description-card.js";

let map;
let bounds;

function initGoalPage({score,distanceMeters,userLatLng, spotLatLng }) {
  // 数値表示
  const km = distanceMeters >= 1000? (distanceMeters / 1000).toFixed(1) + " km": Math.round(distanceMeters) + " m";
  
  document.getElementById("distValue").textContent = km;
  document.getElementById("scoreValue").textContent = score;

  // 地図
  const mapElement = document.getElementById("map");
  map = mapInitialize(mapElement);

  //現在地マーカーの設置
  const lc = locateInitialize(map);

  const confirmMarker = L.marker(userLatLng, { icon: mapIcons.userConfirmIcon }).addTo(map).bindTooltip("あなたの確定位置");
  const trueMarker    = L.marker(spotLatLng, { icon: mapIcons.trueSpotIcon }).addTo(map).bindTooltip("正解のスポット");

  // ライン&両者が入る範囲にフィット
  const line = L.polyline([userLatLng, spotLatLng], { weight: 6, opacity: 0.6 }).addTo(map);
  bounds=line.getBounds().pad(0.3);

  // ざっくり距離（地図上）を表示（任意）
  const meters = map.distance(userLatLng, spotLatLng);
  line.bindTooltip(`誤差 約 ${meters < 1000 ? Math.round(meters) + "m" : (meters/1000).toFixed(2) + "km"}`, { sticky: true });

}

function showMessage()
{
    const charactermessage= document.getElementsByClassName("message-area-container")[0];
    charactermessage.style.opacity = "1";
}

function hiddengetOverlay()
{
    const getoverlay=document.getElementById("get-overlay");
    getoverlay.classList.add("hidden");
    const falseoverlay=document.getElementById("false-overlay");
    falseoverlay.classList.add("hidden");
}

function showMain()
{
    const app=document.getElementsByClassName("screen")[0];
    app.classList.remove("hidden");

    //地図サイズの再設定
    map.invalidateSize();
    if(bounds)map.fitBounds(bounds);
}

function onclickNext()
{
  const params={
    "session_id":response.session_id
  };
  const postURL=response.finish?"/game/quizFinish":"/game/questionStart";
  post(postURL,params);
}


document.addEventListener("DOMContentLoaded",()=>{

  const {createApp}=Vue;
  createApp({
    data(){
      return {
        spotPhotos:response.spotDto.images,
        spottags:response.spotDto.tags,
      }
    },
    components:{
      'photo-gallery':PhotoGallery,
      'spot-description-card':SpotDescriptionCard
    }
  }).mount('#scrollArea');

    initGoalPage({
      minutes: 32,                     
      distanceMeters: response.answerDto.distance_meter??999,           
      score: response.answerDto.point??0,
      userLatLng: [response.answerDto.answerLat??34, response.answerDto.answerLng??135], 
      spotLatLng: [response.spotDto.latitude??34, response.spotDto.longitude??135] 
    });

    const shareBtn = document.getElementById("shareBtn");
    if(response)
    {
      shareBtn?.addEventListener("click", async () => {
        await snsShare(response.answerDto.point, "かかった時間は未実装", response.answerDto.distance_meter);
      });
    }
    

    //キャラクターの表示
    const obtainedChara=response.obtainedChara;
    
    const getoverlay=document.getElementById("get-overlay");
    const falseoverlay=document.getElementById("false-overlay");
    const focusoverlay=obtainedChara?getoverlay:falseoverlay;
    
    if(obtainedChara)
    {
      falseoverlay.classList.add("hidden");
      
      //キャラクター表示用の要素を取得
      const overlay_title=document.getElementsByClassName("character-title")[0];
      const backimage=document.getElementsByClassName("character-back")[0];
      const characterimg = document.getElementsByClassName("character-img")[0];
      const messageTitle=document.getElementsByClassName("message-title")[0];
      const messageText=document.getElementsByClassName("message-text")[0];
      characterimg.src=obtainedChara.lowImageUri?? "/asset/images/default/NoImage.jpg";
      characterimg.addEventListener("animationend",showMessage);
      overlay_title.textContent="キャラクターをゲット！";
      messageTitle.textContent=obtainedChara.name;
      messageText.textContent=obtainedChara.description;
    }
    else
    {
      getoverlay.classList.add("hidden");
    }
    const get_close_btn=focusoverlay.getElementsByClassName("get-close-btn")[0];
      get_close_btn.addEventListener("click",()=>{
          hiddengetOverlay();
          showMain();
      });


    //Areaのmapを設定
    const area=response.area;
    if(area)polygonInitialize(area.area,map);

    //通常表示部にキャラ情報を表示
    const detailCharacterContainer=document.getElementsByClassName("detail-character-field")[0];
    console.log(detailCharacterContainer);
    if(obtainedChara)
    {
      detailCharacterContainer.querySelector(".detail-character-img").src=obtainedChara?.lowImageUri?? "/asset/images/default/NoImage.jpg";
      detailCharacterContainer.querySelector(".detail-character-name").textContent=obtainedChara?.name?? "キャラクターなし";
      detailCharacterContainer.querySelector(".detail-character-text").textContent=obtainedChara?.description?? "今回のスポットではキャラクターをゲットできませんでした。";
    }
    else
    {
      detailCharacterContainer.remove();
    }
    
    //次の問題へボタンのイベントリスナーを設定
    const next_btn=document.getElementsByClassName("next-btn")[0];
    next_btn.addEventListener("click",onclickNext);

    menuInitialize();
    
});