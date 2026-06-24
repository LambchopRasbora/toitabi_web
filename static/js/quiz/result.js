import { mapIcons } from "../common/map/mapicons.js";
import {menuInitialize} from "../common/menu.js";
import { snsShare } from "../common/snsShare.js";
import { mapInitialize,locateInitialize, polygonInitialize } from "../common/map/mapInitialize.js";
import ToitabiFooter from "../components/toitabi-footer.js";
import SpotReviewCard from "../components/spot_review_card.js";

//ドキュメントが読み込まれたときに実行する関数
document.addEventListener("DOMContentLoaded",()=>{

  const questions=response.questions;
  const answers=response.answers;

  
  const distanceMeters=answers.reduce((sum,item)=>sum+item.distance_meter,0);
  const minutes=answers.reduce((sum,item)=>sum+item.durationMinutes,0);;

 //合計距離合計時間の表示
  const km = distanceMeters >= 1000
    ? (distanceMeters / 1000).toFixed(1) + " km"
    : Math.round(distanceMeters) + " m";

  const score = answers.reduce((accumulator, answer)=> accumulator+answer.point,0);

  const {createApp}=Vue;
  createApp({
    data(){
      return{
        spots:questions
      }
    },
    components:{
      'spot-review-card':SpotReviewCard
    }
  }).mount('#spot-cards');

  createApp({
    data(){
      return {
        leftContents:[
          {
            caption:"SNSシェア",
            class:"sns-btn",
            icon:"/asset/images/icon/icon_share.png",
            onClick:()=>{
              console.log("snsShareStart");
              snsShare(score,minutes,km);
            }
          },
          {
            caption:"ホームへ戻る",
            class:"home-btn",
            icon:"/asset/images/icon/icon_home.png",
            onClick:()=>{location.href='/';}
          }],
        rightContents:[
          {
            caption:"My図鑑を見る",
            class:"library-btn",
            icon:"/asset/images/icon/icon_library.png",
            onClick:()=>{location.href='/me/characterindex';}
          }]
      }
    },
    components:{
      'toitabi-footer':ToitabiFooter
    }
  }).mount('#footer');

  

  document.getElementById("distValue").textContent = km;
  document.getElementById("timeValue").textContent = minutes + "分";
  document.getElementById("scoreValue").textContent = score;
  
  //マップの作製
  const N = questions.length;  
  const spots = Array.from({ length: N }, (_, i) => ({
      id: i + 1,
      name: `スポット${i + 1}`,
      latlng: [questions[i].latitude,questions[i].longitude],
      photoUrl:questions[i].images[0]
    }));

  // マップ初期化（3スポットの中心あたりにズーム）
  const centerLat =spots.reduce((sum, s) => sum + s.latlng[0], 0) / spots.length;
  const centerLng =spots.reduce((sum, s) => sum + s.latlng[1], 0) / spots.length;


  const mapElement = document.getElementById("result-map");
  const map = mapInitialize(mapElement);
  map.setView([centerLat, centerLng], 13);

  const lc = locateInitialize(map);

  // --- ポップアップ要素を取得 ---
  const popupEl = document.getElementById('spot-popup');
  const overlayEl = document.getElementById("overlay");
  const popupTitleEl = document.getElementById('popup-title');
  const popupPhotoEl = document.getElementById('popup-photo');

  if (!popupEl || !popupTitleEl || !popupPhotoEl) {
    console.error('ポップアップ用の要素が見つかりません');
    return;
  }

    // --- ポップアップを表示する関数 ---
  function showSpotPopup(spot)
  {
    popupTitleEl.textContent = spot.name;
    popupPhotoEl.src = spot.photoUrl;

    overlayEl.classList.remove("hidden");
    popupEl.classList.remove("hidden");
  }

  //ポップアップを非表示にする関数
  function hideSpotPopup()
  {
    overlayEl.classList.add("hidden");
    popupEl.classList.add("hidden");
  }

  //mapのスポットアイコン
  const spotIcon = mapIcons.trueSpotIcon;

  //各スポットをタッチしたときに表示するようにする
  spots.forEach(spot => {
    const marker = L.marker(spot.latlng, { icon: spotIcon }).addTo(map);

    marker.on("click", function(){
      showSpotPopup(spot);
    });
  });
  
  // 画面タップで閉じる
  overlayEl.addEventListener("click", hideSpotPopup);

  //エリアの設定
  const area=response.area;
  if(area)polygonInitialize(area.area,map);

  //メニューの作成
  menuInitialize();
});