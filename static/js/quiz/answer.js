import { mapIcons } from "../common/map/mapicons.js";
import {menuInitialize} from "../common/menu.js";
import { post } from "../common/serverRequest.js";
import { snsShare } from "../common/snsShare.js";
import { mapInitialize,locateInitialize, polygonInitialize } from "../common/map/mapInitialize.js";

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

  const confirmMarker = L.marker(userLatLng, { icon: mapIcons.userConfirm }).addTo(map).bindTooltip("あなたの確定位置");
  const trueMarker    = L.marker(spotLatLng, { icon: mapIcons.trueSpot }).addTo(map).bindTooltip("正解のスポット");

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
}

function showMain()
{
    const app=document.getElementsByClassName("app")[0];
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

function initSpotField(spotFieldElement, spot)
{
  // プレビュー画像とメイン画像の要素を取得
  const previewimageElements = spotFieldElement.querySelectorAll('.preview-image');
  const mainImageElement = spotFieldElement.querySelector('.main-image');

  //フォーカス変更をそれぞれのサブ画像に設定
  previewimageElements.forEach((el, index) => {
    el.addEventListener('click', () => setCurrentImgId(index, previewimageElements, mainImageElement));
    el.src=spot.images[index] || '/asset/images/default/NoImage.jpg';
  });

  setCurrentImgId(0, previewimageElements, mainImageElement);

  //説明文の設定
  const descriptionElement=spotFieldElement.querySelector('.description');
  descriptionElement.textContent=spot.description?? '';

  //タグの設定
  const tagContainer=spotFieldElement.querySelector('.tag-field');

  spot.tags.forEach(tag=>{
    const tagElement=document.createElement('p');
    tagElement.classList.add('tag');
    tagElement.textContent='#' + tag.name;
    tagContainer.appendChild(tagElement);
  });
}

let currentImgId=0;

function setCurrentImgId(id, previewimageElements, mainImageElement) 
{
  currentImgId = id;
  previewimageElements.forEach((el, index) => {
    el.classList.toggle('focused', index === currentImgId);
  });
  mainImageElement.src = previewimageElements[currentImgId].src;
}

document.addEventListener("DOMContentLoaded",()=>{


    initGoalPage({
      minutes: 32,                     
      distanceMeters: response.answerDto.distance_meter,           
      score: response.answerDto.point,
      userLatLng: [response.answerDto.answerLat, response.answerDto.answerLng], 
      spotLatLng: [response.spotDto.latitude, response.spotDto.longitude] 
    });

    const shareBtn = document.getElementById("shareBtn");
    shareBtn?.addEventListener("click", async () => {
      await snsShare(response.answerDto.point, "かかった時間は未実装", response.answerDto.distance_meter);
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
      characterimg.src=obtainedChara.lowImageUri?? "/asset/images/default/NoImage.jpg";
      characterimg.addEventListener("animationend",showMessage);
      overlay_title.textContent="キャラクターをゲット！";
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
          hiddengetOverlay();
          showMain();
      });

    //Spotのセット
    const spotElement=document.getElementById('spot-info-section');  
    initSpotField(spotElement,response.spotDto);

    //Areaのmapを設定
    const area=response.area;
    if(area)polygonInitialize(area.area,map);
    
    //次の問題へボタンのイベントリスナーを設定
    const next_btn=document.getElementsByClassName("next-btn")[0];
    next_btn.addEventListener("click",onclickNext);

    menuInitialize();
    
});