
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

  const confirmIcon = L.icon({ iconUrl: ICONS.userConfirm, iconSize: [28, 36], iconAnchor: [14, 28] });
  const trueIcon    = L.icon({ iconUrl: ICONS.trueSpot,   iconSize: [28, 36], iconAnchor: [14, 28] });

  const confirmMarker = L.marker(userLatLng, { icon: confirmIcon }).addTo(map).bindTooltip("あなたの確定位置");
  const trueMarker    = L.marker(spotLatLng, { icon: trueIcon }).addTo(map).bindTooltip("正解のスポット");

  // ライン&両者が入る範囲にフィット
  const line = L.polyline([userLatLng, spotLatLng], { weight: 4, opacity: 0.6 }).addTo(map);
  map.fitBounds(line.getBounds().pad(0.3));

  // ざっくり距離（地図上）を表示（任意）
  const meters = map.distance(userLatLng, spotLatLng);
  line.bindTooltip(`誤差 約 ${meters < 1000 ? Math.round(meters) + "m" : (meters/1000).toFixed(2) + "km"}`, { sticky: true });
}
setTimeout(() => {
  map.invalidateSize();
}, 300);