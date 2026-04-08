import { mapIcons } from "../common/map/mapicons.js";
import {menuInitialize} from "../common/menu.js";
import { snsShare } from "../common/snsShare.js";

function initGoalPage({distanceMeters, questions,answers}) 
{
  //合計距離合計時間の表示
  const km = distanceMeters >= 1000
    ? (distanceMeters / 1000).toFixed(1) + " km"
    : Math.round(distanceMeters) + " m";
  document.getElementById("distValue").textContent = km;

  const score = answers.reduce((accumulator, answer)=> accumulator+answer.point,0);

  document.getElementById("scoreValue").textContent = score;
  
  //マップの作製
  const N = questions.length;  // ←spot数　//
  const spots = Array.from({ length: N }, (_, i) => ({
      id: i + 1,
      name: `スポット${i + 1}`,
      latlng: [questions[i].latitude,questions[i].longitude],
      photoUrl:questions[i].images[0]
    }));

  // マップ初期化（3スポットの中心あたりにズーム）
  const centerLat =
    spots.reduce((sum, s) => sum + s.latlng[0], 0) / spots.length;
  const centerLng =
    spots.reduce((sum, s) => sum + s.latlng[1], 0) / spots.length;


  const map = L.map("result-map", {
    zoomControl: false
  }).setView([centerLat, centerLng], 16);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

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
    { enableHighAccuracy:false, timeout:5000, maximumAge:5000 }
  );

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
  const spotIcon = mapIcons.spot;

  //各スポットをタッチしたときに表示するようにする
  spots.forEach(spot => {
    const marker = L.marker(spot.latlng, { icon: spotIcon }).addTo(map);

    marker.on("click", function(){
      showSpotPopup(spot);
    });
  });
  
  // 画面タップで閉じる
  overlayEl.addEventListener("click", hideSpotPopup);
}

//ドキュメントが読み込まれたときに実行する関数
document.addEventListener("DOMContentLoaded",()=>{

  //シェアボタンにシェアイベントを追加
  const shareBtn = document.getElementById("shareBtn");
  shareBtn?.addEventListener("click", async () => {
    await snsShare(0, "かかった時間は未実装", 0);
  });

  //ゴールページの作成
  initGoalPage({
    minutes: 0,
    distanceMeters: 0,
    questions: response.questions,
    answers: response.answers
  });

  //メニューの作成
  menuInitialize();
});