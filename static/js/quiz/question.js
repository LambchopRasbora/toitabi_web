 
 
 // —— サムネ→メイン切替 —— //
const main = document.getElementById('mainPhoto');
const thumbs = document.getElementById('thumbs');
const distanceindicator=document.getElementById('distance');
const thumbbutton=thumbs.children;
const descriptionText=document.getElementById('description');



const currentSpot=response.spotDto;
const images=currentSpot.images;

//画像のデータ埋め込み
for(let i =0;i<images.length;i++)
{
  if(i>=thumbbutton.length)break;
  const btn=thumbbutton[i];
  btn.dataset.src=images[i];
  btn.children[0].src=images[i];
}
main.src=thumbbutton[0].dataset.src;

//thumbのクリック時イベント
thumbs.addEventListener('click', (e) => {
  const btn = e.target.closest('.thumb');
  if(!btn) return;
  const src = btn.dataset.src;
  if(!src) return;
  main.src = src;
  // active 表示
  thumbs.querySelectorAll('.thumb').forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');
}, {passive:true});

//説明テキストの追加
if(currentSpot.description)descriptionText.textContent=currentSpot.description;

// —— 現在地マップ（Leaflet） —— //
//マップオブジェクトの作成
const map = L.map('map', { zoomControl: false });
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'}).addTo(map);

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
    console.assert("現在地の取得に失敗しました")
  },
  { enableHighAccuracy:true, timeout:5000, maximumAge:0 }
);

//最新の現在地(この変数が変更される)
let latestLocation=null;

//現在地を取得し続ける設定
navigator.geolocation.watchPosition(
  (pos)=>{
    latestLocation = pos;
  },
  (err)=>{
    latestLocation=null;
    console.error("位置情報に関するエラー"+err);
  },
  { enableHighAccuracy:true, timeout:8000, maximumAge:0 });

//サーバー通信のインターバル
const fetchTime=5000;
//latestLocationを用いてサーバーからヒントを返してもらう関数
function fetchLocation()
{
 if(!latestLocation)
  {
    console.log("現在地が取得できていません");
    setTimeout(()=>{
      fetchLocation();
    },fetchTime);
    return;
  } 
  fetch('/api/hints/location', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id:response.session_id,
      question_number:response.question_number,
      spot_id:response.spotDto.id,
      latitude: latestLocation.coords.latitude,
      longitude: latestLocation.coords.longitude
    })
  })
  .then((res)=>{
    return res.json();
    })
  .then((json)=>{
    const dis= json.distance;
    distanceindicator.textContent='あと'+dis+'m';
    setTimeout(()=>{
    fetchLocation();
  },fetchTime);
  })
  .catch(console.error);
}

//初期設定
fetchLocation();

//POST用関数
function onclickPost()
{
  // ロード画面を表示
  document.getElementById("loadingOverlay").style.display = "flex";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const {latitude, longitude} = pos.coords;
      const params={
        "session_id":response.session_id,
        "answerDto.answerLat": latitude,
        "answerDto.answerLng": longitude,
        "answerDto.isSkip": false,
        "answerDto.point": 0
      }
      console.log(params);
      post("./answerSave",params);
    },
    () => {
      alert("現在地の取得に失敗しました");
      console.log("現在地取得失敗");
      // ロード画面を表示
      document.getElementById("loadingOverlay").style.display = "none";
    },
    { enableHighAccuracy:true, timeout:8000, maximumAge:0 }
  );
}