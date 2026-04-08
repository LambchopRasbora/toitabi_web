import { mapIcons } from "../common/map/mapicons.js";
import {menuInitialize} from "../common/menu.js";
import { post } from "../common/serverRequest.js";
import { snsShare } from "../common/snsShare.js";

let map;
function initGoalPage({score,distanceMeters,userLatLng, spotLatLng }) {
  // 数値表示
  const km = distanceMeters >= 1000
    ? (distanceMeters / 1000).toFixed(1) + " km"
    : Math.round(distanceMeters) + " m";
  document.getElementById("distValue").textContent = km;

  document.getElementById("scoreValue").textContent = score;

  // 地図
  map = L.map("map", { zoomControl: false, attributionControl: false });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);

  //位置情報初期設定
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const {latitude, longitude} = pos.coords;
      map.setView([latitude, longitude], 17);
      //現在地を表示するマーカーの初期化
      var lc = L.control
        .locate({
          position: "topright"
        })
        .addTo(map);
      lc.start();
    },
    () => {
      // 失敗時は表示せずassertを出す
      console.console("現在地の取得に失敗しました")
    },
    { enableHighAccuracy:true, timeout:5000, maximumAge:0 }
  );

  const confirmMarker = L.marker(userLatLng, { icon: mapIcons.userConfirm }).addTo(map).bindTooltip("あなたの確定位置");
  const trueMarker    = L.marker(spotLatLng, { icon: mapIcons.trueSpot }).addTo(map).bindTooltip("正解のスポット");

  // ライン&両者が入る範囲にフィット
  const line = L.polyline([userLatLng, spotLatLng], { weight: 4, opacity: 0.6 }).addTo(map);
  map.fitBounds(line.getBounds().pad(0.3));

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
}
function showMain()
{
    const app=document.getElementsByClassName("app")[0];
    app.classList.remove("hidden");
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
  /** -----------------------
     *  minutes: プレイ時間(分), distanceMeters: 移動距離(m)
     *  score: スコア(int), userLatLng / spotLatLng: [lat, lng]
     *  ----------------------*/
    initGoalPage({
      minutes: 32,                     
      distanceMeters: response.answerDto.distance_meter,           
      score: response.answerDto.point,                       // 例
      userLatLng: [response.answerDto.answerLat, response.answerDto.answerLng], // 例：プレイヤー確定位置
      spotLatLng: [response.spotDto.latitude, response.spotDto.longitude]  // 例：実スポット位置
    });

    setTimeout(() => {
  map.invalidateSize();
}, 300);

  /** -----------------------
     *  シェア（X/Instagram/汎用）
     *  ----------------------*/
    const shareBtn = document.getElementById("shareBtn");
    shareBtn?.addEventListener("click", async () => {
      await snsShare(response.answerDto.point, response.answerDto.time, response.answerDto.distance_meter);
    });

    //キャラクターの表示
    const obtainedChara=response.obtainedChara;
    
    //キャラクター表示用の要素を取得
    const overlay_title=document.getElementsByClassName("character-title")[0];
    const characterimg = document.getElementsByClassName("character-img")[0];
    const messageTitle=document.getElementsByClassName("message-title")[0];
    const messageText=document.getElementsByClassName("message-text")[0];
    if(obtainedChara)
    {
      overlay_title.textContent="キャラクターをゲット！";

      characterimg.src=obtainedChara.lowImagePath;
      characterimg.addEventListener("animationend",showMessage);

      messageTitle.textContent=obtainedChara.name;

      messageText.textContent=obtainedChara.description;
    }
    else
    {
        overlay_title.textContent="キャラクターゲット失敗...";
        messageTitle.textContent="ゲット失敗...";
        messageText.textContent="";
    }
    const get_close_btn=document.getElementsByClassName("get-close-btn")[0];
      get_close_btn.addEventListener("click",()=>{
          console.log("close btn clicked");
          hiddengetOverlay();
          showMain();
      });
    
    //次の問題へボタンのイベントリスナーを設定
    const next_btn=document.getElementsByClassName("next-btn")[0];
    next_btn.addEventListener("click",onclickNext);

    menuInitialize();
    
});