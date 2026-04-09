import{post,uploadImageToPresignedURL } from '../common/serverRequest.js';
import {menuInitialize} from '../common/menu.js';
import { mapIcons } from "../common/map/mapicons.js";
import { resizeImage } from '../common/imageResize.js';
import { mapInitialize } from '../common/map/mapInitialize.js';

//filesは先に4の配列にしておくnullの場所にファイルを当てはめていく
let files = [null,null,null,null];
 //最新の現在地(この変数が変更される)
let latestLocation={latitude:null,longitude:null};

let currentForucusImgId=0;

//currentForcusImgIdを更新して、プレビューのimgのfocusedクラスを切り替える
function setcurrentForcusImgId(id,previewGrid)
{
  let children = previewGrid.children;
  currentForucusImgId=id; 
  currentForucusImgId=Math.min(children.length,currentForucusImgId);

  //現在選択されているimgのクラスをfocusedに設定
  for(let i=0;i<children.length;i++)
  {
    children[i].classList.toggle('focused',i==currentForucusImgId);
  }
}

//画像関係をリセットする
function resetImages(fileInput, previewGrid, formArea, submitBtn)
{
  fileInput.value = '';
  previewGrid.innerHTML = '';
  formArea.classList.add('is-hidden');
  submitBtn.disabled = true;
  files = [];
}

//送信する位置情報をセットする
function setlatestLocation(lat, lng,marker,locationStatusElement)
{
  latestLocation={latitude:lat,longitude:lng};
  marker.setLatLng([lat, lng]);
  locationStatusElement.textContent = `位置: 緯度 ${latestLocation.latitude.toFixed(5)}, 経度 ${latestLocation.longitude.toFixed(5)} `;
}

//タグのオンオフ
function toggleTag(tagBtn)
{
  tagBtn.dataset.active=tagBtn.dataset.active=='true'?'false':'true';
}

//タグ要素の追加関数
function addTag(parent,template,tagName,isActive)
{
  const tagElement=template.content.cloneNode(true);
  console.log(tagElement);
  tagElement.querySelector('.tag-label').textContent = tagName;
  const tagBtn=tagElement.querySelector('.tags');
  tagBtn.addEventListener('click',()=>toggleTag(tagBtn));
  tagBtn.dataset.active=isActive?'true':'false';
  tagBtn.dataset.tagName=tagName;
  
  parent.appendChild(tagBtn);
}

//投稿時のエラー関数
function showError(message)
{
  alert(message);
  // ロード画面を非表示
  const loadingOverlay = document.getElementById("loadingOverlay");
  if(loadingOverlay) loadingOverlay.style.display = "none";
}

//スポットのポストを行う
async function postSpot(captionEl)
{
  //filesからnull/undefinedを除外してFileオブジェクトだけにする
  files=files.filter(f=>f instanceof File);

  const fd = new FormData();
  if(files.length<1){
    alert('画像が選択されていません!!');
    return;
  }
  if(!latestLocation)
  {
    alert('トイスポットの位置が選択されていません!!');
    return;
  }
  // ロード画面を表示
  document.getElementById("loadingOverlay").style.display = "flex";

  console.log(files);

  
  //リサイズを行う
  const resizedImagePromises=files.map(file=>resizeImage(file, { maxWidth: 1280, maxHeight: 1280, quality: 0.8, contenttype: 'image/jpeg' }));

  
  // presigned URL の取得
  //画像送信用のURL
  const url="/api/spotpost/uploadurl";

  const imagedescriptions=files.map((file)=>{
      return {
        "extension":`.jpg`,
        "contentType":'image/jpeg',
        "filesize":file?file.size:0
      }});

  const presignedURLPromises = fetch(url,{method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
    "images":imagedescriptions
  })});

  //リサイズの完了を待つ(resizedImagesは純粋なバイナリの配列)
  const resizedImages= await Promise.all(resizedImagePromises);

  const presignedURLResponse = await presignedURLPromises;
  if(!presignedURLResponse.ok)showError('アップロードURLの取得に失敗しました'+presignedURLResponse.statusText);
  const presignedURLData = await presignedURLResponse.json();


  const promises = resizedImages.map((f,i )=> uploadImageToPresignedURL(presignedURLData.images[i].uploadUri, f));
  
  //タグの収集
  let tags = [];

  const tagElements=document.getElementsByClassName('tags');

  for(let tagElement of tagElements)
  {
    if(tagElement.dataset.active==='true')
    {
      tags.push(tagElement.dataset.tagName);
    }
  }

  //スポットのフォーム作成
  let params={
    "latitude":latestLocation.latitude,
    "longitude":latestLocation.longitude,
    "description":captionEl.value,
    "images":presignedURLData.images.map(img=>img.publicAccessUri),
    "tags":tags
  }
  //画像のアップロード完了まで待つ
  const datas= await Promise.all(promises);

  //ポストを行う
  post('./confirm',params,);
}

//初期化管理(ページのすべてが読み込まれた後に実行)
document.addEventListener('DOMContentLoaded',()=>{
  
  //地図関係の初期化
  const mapFrame=document.getElementById('mapFrame');
  const locStatus  = document.getElementById('locStatus');

  const map=mapInitialize(mapFrame);

  const marker=L.marker([34.985458, 135.757756],{icon:mapIcons.postedSpot}).bindTooltip('現在地').addTo(map);

  //現在地を取得
  navigator.geolocation.getCurrentPosition(
    (pos)=>{
      setlatestLocation(pos.coords.latitude,pos.coords.longitude,marker,locStatus);
      map.setView([pos.coords.latitude, pos.coords.longitude], 13);

    },
    (err)=>{
      latestLocation=null;
      console.error("位置情報に関するエラー"+err);
    },
    { enableHighAccuracy:true, timeout:10000, maximumAge:5000 });

  //mapFrameでのイベントを削除
  mapFrame.addEventListener('contextmenu', (e) => e.preventDefault(),false);
  //mapの長押し、右クリックイベントを設定
  map.on('contextmenu', e => setlatestLocation(e.latlng.lat,e.latlng.lng,marker,locStatus));

  const shootBtn   = document.getElementById('shootBtn');
  const fileInput  = document.getElementById('fileInput');
  const formArea   = document.getElementById('formArea');
  const previewGrid = document.getElementById('previewGrid');
  const captionEl  = document.getElementById('caption');
  const submitBtn  = document.getElementById('submitBtn');
  const retakeBtn  = document.getElementById('retakeBtn');


  // カメラ起動（スマホならカメラ、PCならファイル選択）イベントを設定
  shootBtn.addEventListener('click', () => fileInput.click());

  // ファイル選択時
  fileInput.addEventListener('change', () => {

    const fileNumber=fileInput.files.length;
    if(currentForucusImgId+fileNumber>files.length)
    {
      alert('アップロードは最大4枚までです。');
      fileInput.value = '';
      return;
    }

    //currentForcusImgIdからfilesを更新していく(nullでなくても置き換え)
    for (let i = 0; i < fileNumber; i++) {
      const targetIndex = currentForucusImgId + i;
      if (targetIndex >= files.length) break;
      files[targetIndex] = fileInput.files[i];
    }

    //追加した分だけcurrentForcusImgidを進める(0<=currentForcusImgId<4)
    currentForucusImgId+=fileNumber;
    currentForucusImgId=Math.min(3,currentForucusImgId);

    // ファイルが選択されていない場合は処理を終了
    if (files.length === 0) return;

    // 4枚制限
    if (files.length > 4) {
      alert('アップロードは最大4枚までです。');
      fileInput.value = '';
      return;
    }

    // プレビュー表示
    previewGrid.innerHTML = '';
    files.forEach((file,index )=> {
      if(file)
      {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.onclick=()=>{ setcurrentForcusImgId(index,previewGrid); }
        previewGrid.appendChild(img);
      }
    });

    //現在選択されているimgのクラスをfocusedに設定
    setcurrentForcusImgId(currentForucusImgId,previewGrid);
    
    formArea.classList.remove('is-hidden');
    submitBtn.disabled = (files.length < 1);
  });

  // 位置情報取得
  const locBtn     = document.getElementById('locBtn');
  locBtn.addEventListener('click', () => {
    if (!('geolocation' in navigator)) {
      locStatus.textContent = 'この端末は位置情報に非対応です';
      return;
    }
    locStatus.textContent = '取得中…';
    navigator.geolocation.getCurrentPosition(
      pos =>  setlatestLocation(pos.coords.latitude,pos.coords.longitude,marker,locStatus),
      err => {
        console.warn(err);
        locStatus.textContent = '取得に失敗しました';
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
  //タグの初期化
  const initailTags=["グルメ","観光地","ショップ","何気ない景色","史跡","みんなの思い出"]
  const tagArea=document.getElementsByClassName('tag-area')[0];
  const tagTemplate=document.getElementById('tag-template');

  initailTags.forEach(tag=>addTag(tagArea,tagTemplate,tag,false));

  //タグの追加ボタンの設定
  const addTagBtn=document.getElementById('addTagBtn');
  const tagInput=document.getElementById('tagInput');

  addTagBtn.addEventListener('click',()=>{
    const newTag=tagInput.value.trim();
    if(newTag.length==0)return;
    addTag(tagArea,tagTemplate,newTag,true);
    tagInput.value='';
    tagInput.focus();
  });
  //タグ入力でEnterキーが押されたときのイベント
  tagInput.addEventListener('keypress',(e)=>{
    if(e.key==='Enter')
    {
      addTagBtn.click();
    } 
  });


  // 撮り直しボタンの設定
  retakeBtn.addEventListener('click', () => {resetImages(fileInput, previewGrid, formArea, submitBtn);});

  // 投稿ボタンの設定
  submitBtn.addEventListener('click', async () => 
  {
    await postSpot(captionEl);
  });
  //メニューの初期化
  menuInitialize();
});

//このファイルが読み込まれてすぐ実行するコード(htmlの要素が必要ないもの)
