//areasを取得
const areas=document.getElementsByClassName("areas")[0];


const zones=data?data.zoneDtos:null;


const localsession=Cookies.get('session_id');
const continue_btn=document.getElementById('continue-btn');

//クイズをスタートさせる関数
function quizStart({id,number})
{
  const params={
    "zoneId":id,
    "totalQuestionNumber":number
  };
  post("/game/quizStart",params);
}
//quizを途中から行う関数
function quizCotinue({session_id})
{
  const params={
    "session_id":session_id
  };
  post("/game/quizResume",params);
}

//保存されているlocalsessionがあれば途中からを表示
if(continue_btn)
{
  if(localsession)
  {
    continue_btn.addEventListener('click',()=>quizCotinue({session_id:localsession}));
  }
  else
  {
    continue_btn.remove();
  }
}


//送信されたzoneを用いてクイズスタートボタンを作成
if(zones)
{
  zones.forEach(zone=>{
    //area-card部分作成
    let area_card=document.createElement("button");
    area_card.className="area-card";
    areas.appendChild(area_card);
    area_card.addEventListener('click',()=>{quizStart({id: zone.id,number: 3})});
    //thumb部分作成
    let thumb=document.createElement("div");
    thumb.className="icon-circle";
    area_card.appendChild(thumb);
    //map部分作成
    let icon=document.createElement("img");
    icon.src=zone.imagepath;
    thumb.appendChild(icon);
    //label作成
    let label=document.createElement("div");
    label.className="label";
    label.textContent=zone.name;
    area_card.appendChild(label);
  });
}



// 地図を作成する関数
function initThumbMap({ el, center, zoom }) {
  // Leaflet地図の初期化
  const map = L.map(el, {
    center,
    zoom,
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    tap: false,
    attributionControl: false,
  });

  // OSMタイルを追加
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);
}


