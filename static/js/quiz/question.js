 
import { post } from "../common/serverRequest.js";
import { menuInitialize}from "../common/menu.js";
import { locateInitialize, mapInitialize, polygonInitialize } from "../common/map/mapInitialize.js"
import { mapIcons } from "../common/map/mapicons.js";

// —— 現在地マップ（Leaflet） —— //
//マップオブジェクトの作成
const mapElement = document.getElementById("map");
const map = mapInitialize(mapElement);

//位置情報初期設定
const lc=locateInitialize(map);

navigator.geolocation.getCurrentPosition(
  (pos) => {
    const {latitude, longitude} = pos.coords;
    map.setView([latitude, longitude], 17);
  },
  () => {
    // 失敗時は表示せずassertを出す
    alert("現在地の取得に失敗しました")
  },
  { enableHighAccuracy:false, timeout:20000, maximumAge:20000 }
);


// —— サムネ→メイン切替 —— //
const main = document.getElementById('mainPhoto');
const thumbs = document.getElementById('thumbs');
const distanceindicator=document.getElementById('distance');
const thumbbutton=thumbs.children;
const descriptionText=document.getElementById('description');
const authorText=document.getElementById('author');

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





//最新の現在地(この変数が変更される)
let latestLocation=null;
let lastsent=null;

//現在地を取得し続ける設定
const watchId= navigator.geolocation.watchPosition(
  (pos)=>{
    latestLocation = pos;
    lastsent=Date.now();
  },
  (err)=>{
    latestLocation=null;
    console.error("位置情報に関するエラー"+err);
  },
  { enableHighAccuracy:true, timeout:10000, maximumAge:5000 });

//サーバー通信のインターバル
const fetchTime=10000;
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
      question_id: response.question_number,
      spotId: response.spotDto.spotId, 
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
    setTimeout(fetchLocation,fetchTime);
  })
  .catch((err)=>{
    console.error("ヒントの取得に失敗しました", err);
    setTimeout(fetchLocation,fetchTime);
  })
}

//latestLocationを用いてサーバーからヒントを返してもらう関数
function getHint()
{
  const askedLat=latestLocation.coords.latitude;
  const askedLng=latestLocation.coords.longitude
  fetch('/api/hints/dirdis', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id:response.session_id,
      question_id: response.question_number,
      spotId: response.spotDto.spotId, 
      latitude: askedLat,
      longitude: askedLng
    })
  })
  .then((res)=>{
    return res.json();
    })
  .then((json)=>{
    const width=45;
    const randomDistanceWidth=500;

    const randomdis=Math.random()*randomDistanceWidth+json.distance;
    const randomdir=Math.random()*width-width*0.5+json.direction;

    createHintMarker(map,askedLat,askedLng,randomdir,width,randomdis);
  })
  .catch((err)=>{
    console.error("ヒントの取得に失敗しました", err);
    setTimeout(fetchLocation,fetchTime);
  })
}

function createHintMarker(map,lat,lng,dir,width,rad)
{
  const start=dir-width*0.5;
  const stop=dir+width*0.5;
  const radar=L.semiCircle([lat,lng],{
    radius:rad,
    startAngle:start,
    stopAngle:stop,
    color: '#3388ff',
    fillColor: '#3388ff',
    opacity:0,
    fillOpacity: 0.3
  }).addTo(map);

  const marker=L.marker([lat,lng],{ 
    icon:mapIcons.locationIcon,
    title:"ヒント地点"
  }).addTo(map);

  return {
    areaCircle:radar,
    hintPoint:marker
  };
}

//POST用関数
function postQuestion(isskip)
{
  // 現在地を取得してからサーバーに送る関数
  const postCallback= (pos) => {
      const {latitude, longitude} = pos.coords;
      const params={
        "session_id":response.session_id,
        "answerDto.answerLat": latitude,
        "answerDto.answerLng": longitude,
        "answerDto.isSkip": isskip,
        "answerDto.point": 0
      }
      post("./answerSave",params);
    };
  // 位置情報の取得に失敗したときのコールバック
  const errorCallback=(err) => {
      alert("現在地の取得に失敗しました");
      console.log("現在地取得失敗",err);
      // ロード画面を削除
      document.getElementById("loadingOverlay").style.display = "none";
    };
  // ロード画面を表示
  document.getElementById("loadingOverlay").style.display = "flex";

  //送信前に現在地が最新であるか確認し、最新でなければ再取得する
  if(Date.now()-lastsent<fetchTime) postCallback(latestLocation);
  else navigator.geolocation.getCurrentPosition(postCallback,errorCallback, { enableHighAccuracy:true, timeout:20000, maximumAge:5000 });
}

//ドキュメントが読み込まれた際のイベント
document.addEventListener('DOMContentLoaded',()=>{

  //説明テキストの追加
  if(currentSpot.description)descriptionText.textContent=currentSpot.description;
  //投稿者の追加
  const authorString=currentSpot.author??"問い人知らず";
  if(currentSpot.author)authorText.textContent="投稿者："+authorString;

  const area=response.area;
  if(area)polygonInitialize(area.area,map);


  const skip_btn=document.querySelector('.skip-btn');
  const post_btn=document.querySelector('.post-btn');
  if(skip_btn) skip_btn.addEventListener('click',()=>{postQuestion(true)});
  if(post_btn) post_btn.addEventListener('click',()=>{postQuestion(false)});

  //ヒント取得関数をボタンに紐づける
  const hintBtn=document.getElementById('hint-btn');
  if(hintBtn) hintBtn.addEventListener('click',getHint);

  menuInitialize();
});