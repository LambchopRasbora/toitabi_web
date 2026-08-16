 
import { post, postApi } from "../common/serverRequest.js";
import { menuInitialize}from "../common/menu.js";
import { locateInitialize, mapInitialize, polygonInitialize } from "../common/map/mapInitialize.js"
import { mapIcons } from "../common/map/mapicons.js";
import SpotDescriptionCard from "../components/spot-description-card.js";
import PhotoGallery from "../components/photo-gallery.js";
import ToitabiFooter from "../components/toitabi-footer.js";
import LocationPickerMap from "../components/locationPickerMap.js";

// —— 現在地マップ（Leaflet） —— //
//マップオブジェクトの作成
const mapElement = document.getElementById("map");
const map = mapInitialize(mapElement);

//位置情報初期設定
const lc=locateInitialize(map);
const fetchTime=5000;

navigator.geolocation.getCurrentPosition(
  (pos) => {
    const {latitude, longitude} = pos.coords;
    map.setView([latitude, longitude], 17);
  },
  () => {
    alert("現在地の取得に失敗しました")
  },
  { enableHighAccuracy:false, timeout:20000, maximumAge:fetchTime}
);

let locationChoice=null;

const currentSpot=response.spotDto;

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
  { enableHighAccuracy:true, timeout:10000, maximumAge:fetchTime});

//latestLocationを用いてサーバーからヒントを返してもらう関数
async function getHint()
{
  let loc=null;
  if(Date.now()-lastsent<fetchTime)
  {
    loc={ lat:latestLocation.coords.latitude,lng:latestLocation.coords.longitude};
  }
  else{
    loc=await locationChoice.getLocationByMapAsync();
  }

  const askedLat=loc.lat;
  const askedLng=loc.lng;

  const params={
    session_id:response.session_id,
    question_id: response.question_number,
    spotId: response.spotDto.spotId, 
    latitude: askedLat,
    longitude: askedLng
  };

  try{
    const res= await postApi('/api/hints/dirdis',params)
    const json=await res.json();

    const width=45;
    const randomDistanceWidth=500;

    const randomdis=Math.random()*randomDistanceWidth+json.distance;
    console.log(randomdis);
    const randomdir=Math.random()*width-width*0.5+json.direction;

    createHintMarker(map,askedLat,askedLng,randomdir,width,randomdis);
  }
  catch(err){
    console.error("ヒントの取得に失敗しました", err);
  }
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
      console.log("現在地取得失敗",err);
      // ロード画面を削除
      document.getElementById("loadingOverlay").style.display = "none";
      if(locationChoice)
      {
        locationChoice.init((loc)=>{
          const params={
            "session_id":response.session_id,
            "answerDto.answerLat": loc.lat,
            "answerDto.answerLng": loc.lng,
            "answerDto.isSkip": isskip,
            "answerDto.point": 0
          }
          post("./answerSave",params);
        });
      }
    };
  // ロード画面を表示
  document.getElementById("loadingOverlay").style.display = "flex";

  //送信前に現在地が最新であるか確認し、最新でなければ再取得する
  if(Date.now()-lastsent<fetchTime) postCallback(latestLocation);
  else 
  {
    navigator.geolocation.getCurrentPosition(postCallback,errorCallback, { enableHighAccuracy:true, timeout:20000, maximumAge:fetchTime });
  }
}

//ドキュメントが読み込まれた際のイベント
document.addEventListener('DOMContentLoaded',()=>{

  const {createApp}=Vue;
  createApp({
    data(){
      return {
        spotPhotos:response.spotDto.images,
        spottags:response.spotDto.tags,
      }
    },
    components:{
      'spot-description-card': SpotDescriptionCard,
      'photo-gallery':PhotoGallery
    }
  }).mount('#spot-info');

  locationChoice = createApp({
    data(){
      return {
        // モーダルやコンポーネントの表示状態制御が必要な場合に使用
      isVisible: false,
      // 確定時に呼び出すコールバック関数を保持
      onConfirmCallback: null
      }
    },
    components:{
      'location-picker-map': LocationPickerMap
    },
    methods:{

      getLocationByMapAsync()
      {
        return new Promise((resolve)=>{
          this.init(resolve);
        })
      },
      /**
       * 初期化メソッド
       * @param {Function} onConfirm - 確定時に実行する関数 (引数: {lat: number, lng: number})
       */
      init(onConfirm) 
      {
        this.onConfirmCallback = onConfirm;
        this.isVisible = true;
      },
      /**
       * 確定処理
       * 地図コンポーネントから座標を取得し、登録されたコールバックを実行する
       */
      confirm() {
        const locationPicker = this.$refs.locationPicker;
        const loc = locationPicker.getRegisterdPoint(); 

        if (typeof this.onConfirmCallback === 'function') {
          this.onConfirmCallback(loc);
        }
        this.onConfirmCallback=null;
        this.isVisible = false;
      },
      cancel()
      {
        this.onConfirmCallback=null;
        this.isVisible = false;
      }
    },mounted(){
        console.log(this.isVisible);
    }
  }).mount('#locationChoice');

  createApp({
    data(){
      return {
        leftContents:[
          {
            caption:"ホームへ戻る",
            class:"home-btn",
            icon:"/asset/images/icon/icon_home.png",
            onClick:()=>{location.href='/';}
          }],
        rightContents:[
          {
            caption:"スポットを確定!!",
            class:"spot-btn",
            icon:"/asset/images/icon/icon_visit.png",
            onClick:()=>{postQuestion(false)}
          }]
      }
    },
    components:{
      'toitabi-footer':ToitabiFooter
    }
  }).mount('#footer');

  const area=response.area;
  if(area)polygonInitialize(area.area,map);


  const skip_btn=document.querySelector('.skip-btn');
  const post_btn=document.querySelector('.next-btn');
  if(skip_btn) skip_btn.addEventListener('click',()=>{postQuestion(true)});
  if(post_btn) post_btn.addEventListener('click',()=>{postQuestion(false)});

  //ヒント取得関数をボタンに紐づける
  const hintBtn=document.getElementById('hint-btn');
  if(hintBtn) hintBtn.addEventListener('click',getHint);

  menuInitialize();
});