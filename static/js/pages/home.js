import { post } from "../common/serverRequest.js";
import { menuInitialize}from "../common/menu.js"
import { mapInitialize } from "../common/map/mapInitialize.js";
import { localizeDrawJP } from "../common/map/mapDraw.js";

//areasを取得
const buttonareas=document.getElementsByClassName("buttonareas")[0];
const areas=data?data.areas:null;

const areacardtemplate=document.getElementById("area-card-template");

const themecardtemplate=document.getElementById("theme-card-template");

//キャッシュしたエリアのテーマを保存するためのMap
const themeCache=new Map();


let latestLocation=null;
let latestGeoJson=null;
//latestLocationに常に現在地を代入
const watchId= navigator.geolocation.watchPosition(
  (pos)=>{ latestLocation = pos;},
  (err)=>{
    latestLocation=null;
    console.error("位置情報に関するエラー"+err);
  },
  { enableHighAccuracy:false, timeout:10000, maximumAge:5000 });

//クイズをテーマでスタートさせる関数
function quizStartWithTheme({id,number})
{
  const params={
    "themeId":id,
    "totalQuestionNumber":number
  };
  post("/game/quizStart",params);
}

function quizStartTemporary({polygon,number})
{
  if(!polygon)
  {
    alert("ポリゴンを描画してください");
    return;
  }
  const params={
    "polygon":polygon,
    "totalQuestionNumber":number
  };
  post("/game/quizStartTemporary",params);
}

//quizを途中から行う関数
function quizCotinue({session_id})
{
  const params={
    "session_id":session_id
  };
  post("/game/quizResume",params);
}

//テーマカードを作成する関数
function createThemeCard(theme)
{
  const fragment=themecardtemplate.content.cloneNode(true);
  fragment.querySelector(".theme-card").addEventListener('click',()=>{quizStartWithTheme({id: theme.themeId,number: 3})});
  fragment.querySelector(".theme-label").textContent=theme.name;
  return fragment;
}

async function togglethemeList(areaId,container)
{
  if(container.dataset.loaded==="true")
  {
    container.classList.toggle("open");
    return;
  }
  if(themeCache.has(areaId)) return;

  const res= await fetch(`/api/theme/findbyareaid?areaId=${areaId}`);
  if(!res.ok)throw new Error('Failed to fetch themes');
  
  const data=await res.json();
  themeCache.set(areaId,data);
  
  for(const theme of data)
  {
    const themeCard=createThemeCard(theme);
    container.appendChild(themeCard);
  }
  container.dataset.loaded="true";
  container.classList.add("open");
  return;
}
//ダイアログの初期化設定
function initializeDialog(dialog,map)
{
  dialog.showModal();
  if(latestLocation)
  {
    map.setView([latestLocation.coords.latitude,latestLocation.coords.longitude],17);
    map.invalidateSize();
  }
  
}

//初期化設定
document.addEventListener('DOMContentLoaded',()=>
{
  const continue_btn=document.getElementById('continue-btn');
  //保存されているlocalsessionがあれば途中からを表示
  if(continue_btn)
  {
    const localsession=Cookies.get('session_id');
    if(localsession)
    {
      continue_btn.addEventListener('click',()=>quizCotinue({session_id:localsession}));
    }
    else
    {
      continue_btn.remove();
    }
  }

  //areasがあればエリアカードを作成
  if(areas)
  {
    areas.forEach(area=>{
      //area-card部分作成
      const fragment=areacardtemplate.content.cloneNode(true);
      const area_card=fragment.querySelector(".area-card");
      const theme_list=fragment.querySelector(".theme-list");
      area_card.addEventListener('click',()=>{togglethemeList(area.areaId, theme_list)});
      const img=area_card.querySelector("img");
      img.src=area.thumbnailUri;
      const label=area_card.querySelector(".label");
      label.textContent=area.areaname;
      buttonareas.appendChild(fragment);
    });
  }

  //エリア作成のボタンにダイアログ表示の設定
  const create_area_btn=document.getElementById("create-area-btn");
  const dialog=document.getElementById("create-area-dialog");

  const create_map_element=document.getElementById("create-map");
  const createAreaMap=mapInitialize(create_map_element);

  const drawnItems=new L.FeatureGroup();
  createAreaMap.addLayer(drawnItems);
  localizeDrawJP();

  const drawControl=new L.Control.Draw({
    edit:{featureGroup:drawnItems},
    draw:{
      polygon:true,
      polyline:false,
      rectangle:false,
      circle:false,
      marker:false,
      circlemarker:false
    }
  });
  createAreaMap.addControl(drawControl);
  createAreaMap.on(L.Draw.Event.CREATED,function (e){
    const layer=e.layer;
    drawnItems.clearLayers();
    drawnItems.addLayer(layer);

    latestGeoJson=layer.toGeoJSON();
  });

  const submitCreateArea=document.getElementById("create-map-confirm");
  submitCreateArea.addEventListener('click',()=>{quizStartTemporary({polygon:JSON.stringify(latestGeoJson.geometry),number:3});});
  
  const cancelCreateArea=document.getElementById("create-map-cancel");
  cancelCreateArea.addEventListener('click',()=>{dialog.close();})

  create_area_btn.addEventListener('click',()=>{initializeDialog(dialog,createAreaMap)});

  //menuの初期化
  menuInitialize();
  
});