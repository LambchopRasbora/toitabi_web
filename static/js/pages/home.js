//areasを取得
const buttonareas=document.getElementsByClassName("buttonareas")[0];
const zones=data?data.zoneDtos:null;
const areas=data?data.areas:null;

const areacardtemplate=document.getElementById("area-card-template");

const themecardtemplate=document.getElementById("theme-card-template");

const localsession=Cookies.get('session_id');
const continue_btn=document.getElementById('continue-btn');




const themeCache=new Map();

//クイズをスタートさせる関数
function quizStart({id,number})
{
  const params={
    "zoneId":id,
    "themeId":null,
    "totalQuestionNumber":number
  };
  post("/game/quizStart",params);
}

function quizStartWithTheme({id,number})
{
  const params={
    "themeId":id,
    "zoneId":null,
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

function createThemeCard(theme)
{
  const fragment=themecardtemplate.content.cloneNode(true);
  fragment.querySelector(".area-card").addEventListener('click',()=>{quizStartWithTheme({id: theme.themeId,number: 3})});
  fragment.querySelector("img").src=theme.thumbnailUri;
  fragment.querySelector(".label").textContent=theme.name;
  return fragment;
}

async function togglethemeList(areaId,container)
{
  if(container.dataset.loaded==="true")
  {
    container.classList.toggle("open");
    return;
  }
  if(themeCache.has(areaId))
  {
    return;
  }
  const res= await fetch(`/api/theme/findbyareaid?areaId=${areaId}`);
  if(!res.ok)
  {
    throw new Error('Failed to fetch themes');
  }
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
    buttonareas.appendChild(area_card);
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