import { post } from "../common/serverRequest.js";
import { menuInitialize}from "../common/menu.js"

//areasを取得
const buttonareas=document.getElementsByClassName("buttonareas")[0];
const areas=data?data.areas:null;

const areacardtemplate=document.getElementById("area-card-template");

const themecardtemplate=document.getElementById("theme-card-template");

//キャッシュしたエリアのテーマを保存するためのMap
const themeCache=new Map();


//クイズをテーマでスタートさせる関数
function quizStartWithTheme({id,number})
{
  const params={
    "themeId":id,
    "zoneId":null,
    "totalQuestionNumber":number
  };
  post("/game/quizStart",params);
}

function quizStartTemporary({polygon,number})
{
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

  //menuの初期化
  menuInitialize();
  
});