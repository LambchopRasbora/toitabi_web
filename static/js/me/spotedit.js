import{post,uploadImageToPresignedURL,fetchPresignedURL } from '../common/serverRequest.js';
import {menuInitialize} from '../common/menu.js';
import { mapIcons } from "../common/map/mapicons.js";
import { resizeImage } from '../common/imageResize.js';
import { mapInitialize } from '../common/map/mapInitialize.js';


let images=[
    {id:0,src:'/asset/images/default/NoImage.jpg',file:null,status:'NONE'},
    {id:1,src:'/asset/images/default/NoImage.jpg',file:null,status:'NONE'},
    {id:2,src:'/asset/images/default/NoImage.jpg',file:null,status:'NONE'},
    {id:3,src:'/asset/images/default/NoImage.jpg',file:null,status:'NONE'},
];

 //最新の現在地(この変数が変更される)
let latestLocation={latitude:null,longitude:null};

let currentForucusImgId=0;

let editSpot=null;

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
function resetImages(imageLements, formArea, submitBtn)
{
  submitBtn.disabled = true;
  images = [
    {id:0,src:'/asset/images/default/NoImage.jpg',file:null,status:'NONE'},
    {id:1,src:'/asset/images/default/NoImage.jpg',file:null,status:'NONE'},
    {id:2,src:'/asset/images/default/NoImage.jpg',file:null,status:'NONE'},
    {id:3,src:'/asset/images/default/NoImage.jpg',file:null,status:'NONE'},
  ];

  imageLements.forEach((el,index)=>el.src=images[index].src);
}

//送信する位置情報をセットする
function setlatestLocation(lat, lng,marker,locationStatusElement)
{
  latestLocation.latitude=lat;
  latestLocation.longitude=lng;
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
async function postSpot(captionEl,hiddenEl)
{
    if(images.filter(img=>img.status!='NONE').length<1)
    {
        alert('画像が選択されていません!!');
        return;
    }
    
    // ロード画面を表示
    document.getElementById("loadingOverlay").style.display = "flex";

    try
    {
        //アップロード用のURL
        const imagedescriptions=images.filter(img=>img.status==='NEW')
        .map(img=>({
            "extension":`.jpg`,
            "contentType":'image/jpeg',
            "filesize":img.file.size
        }));

        const presignedURLs = await fetchPresignedURL(imagedescriptions);

        const uploadPromises=images.map(async (img,index)=>{
            if(img.status==='NEW')
            {
                const resizedFile = await resizeImage(img.file, { maxWidth: 1280, maxHeight: 1280, quality: 0.8, contenttype: 'image/jpeg' })
                .catch(err=>{throw new Error('画像のリサイズに失敗しました'+err.message);});

                const presingedURL=presignedURLs.images.shift();
                await uploadImageToPresignedURL(presingedURL.uploadUri,resizedFile)
                .catch(err=>{throw new Error('画像のアップロードに失敗しました'+err.message);});
                return {id:index,src:presingedURL.publicAccessUri,file:null,status:'NEW'}; 
            }
            return img;
        });
        
        images = await Promise.all(uploadPromises);
    }
    catch(err)
    {
        showError(err.message);
        return;
    }

  //タグの収集
  let tags=[];
  const tagElements=document.getElementsByClassName('tags');
  Array.from(tagElements).filter(tagElement=>tagElement.dataset.active==='true')
  .forEach(tagElement=>tags.push(tagElement.dataset.tagName));

  //スポットのフォーム作成
  let params={
    "spotId":editSpot.spotId,
    "latitude":latestLocation.latitude,
    "longitude":latestLocation.longitude,
    "description":captionEl.value,
    "images":images.filter(img=>img.status!=='NONE').map(img=>img.src),
    "tags": tags,
    "hidden": hiddenEl.checked
  }
  //ポストを行う
  try{
    post('/me/spotedit',params,);
  }
  catch(err)
  {
    showError('スポットの投稿に失敗しました'+err.message);
    return;
  }
}



//初期化管理(ページのすべてが読み込まれた後に実行)
document.addEventListener('DOMContentLoaded',()=>{
    //spotから値をセットする
    if(!spot)alert('スポットの情報の取得に失敗しました');
    editSpot=structuredClone(spot);
    latestLocation={latitude:editSpot.latitude,longitude:editSpot.longitude};
    editSpot.images.forEach((img, index)=>{images[index]={id:index,src:img,status:'STAY'};});

  //地図関係の初期化
  const mapFrame=document.getElementById('mapFrame');
  const locStatus  = document.getElementById('locStatus');

  const map=mapInitialize(mapFrame);

  const marker=L.marker([34.985458, 135.757756],{icon:mapIcons.postedSpotIcon}).bindTooltip('現在地').addTo(map);
    setlatestLocation(latestLocation.latitude,latestLocation.longitude,marker,locStatus);
    map.setView([latestLocation.latitude, latestLocation.longitude], 13);

  //mapFrameでのイベントを削除
  mapFrame.addEventListener('contextmenu', (e) => e.preventDefault(),false);
  //mapの長押し、右クリックイベントを設定
  map.on('contextmenu', e => setlatestLocation(e.latlng.lat,e.latlng.lng,marker,locStatus));

  const shootBtn   = document.getElementById('shootBtn');
  const fileInput  = document.getElementById('fileInput');
  const formArea   = document.getElementById('formArea');
  const previewGrid = document.getElementById('previewGrid');
  const imageEls=previewGrid.children;
  Array.from(imageEls).forEach((e,i)=>e.onclick=()=>setcurrentForcusImgId(i,previewGrid))
  images.forEach((img,index)=>{imageEls[index].src=img.src;});

  const captionEl  = document.getElementById('caption');
  captionEl.value=editSpot.description;
  
  const hiddenEl=document.getElementById('isHiddenCheckbox');
  hiddenEl.checked=editSpot.hidden;
  const submitBtn  = document.getElementById('submitBtn');
  const retakeBtn  = document.getElementById('retakeBtn');


  // カメラ起動（スマホならカメラ、PCならファイル選択）イベントを設定
  shootBtn.addEventListener('click', () => fileInput.click());

  // ファイル選択時
  fileInput.addEventListener('change', () => {

    const fileNumber=fileInput.files.length;
    if(fileNumber<1)return;

    if(currentForucusImgId+fileNumber>images.length)
    {
      alert('アップロードは最大4枚までです。');
      fileInput.value = '';
      return;
    }

    //currentForcusImgIdからfilesを更新していく(nullでなくても置き換え)
    for (let i = 0; i < fileNumber; i++) {
        const targetIndex = currentForucusImgId + i;
        if (targetIndex >= images.length)
        {
        alert('アップロードは最大4枚までです。');
        break;
      }
      images[targetIndex]={id:targetIndex,src:URL.createObjectURL(fileInput.files[i]),file:fileInput.files[i],status:'NEW'};
      imageEls[targetIndex].src = images[targetIndex].src;
    }

    //追加した分だけcurrentForcusImgidを進める(0<=currentForcusImgId<4)
    currentForucusImgId+=fileNumber;
    currentForucusImgId=Math.min(3,currentForucusImgId);
    
    //現在選択されているimgのクラスをfocusedに設定
    setcurrentForcusImgId(currentForucusImgId,previewGrid);
    
    fileInput.value = '';
    submitBtn.disabled = (images.filter(img => img.status !== 'NONE').length < 1);
  });

  setcurrentForcusImgId(0,previewGrid);

  //タグの初期化
  const initailTags=new Set(["グルメ","観光地","ショップ","何気ない景色","史跡","みんなの思い出"],editSpot.tags);
  const tagArea=document.getElementsByClassName('tag-area')[0];
  const tagTemplate=document.getElementById('tag-template');

  initailTags.forEach(tag=>addTag(tagArea,tagTemplate,tag,editSpot.tags.includes(tag)));

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
    if(e.key==='Enter')addTagBtn.click();
  });


  // 撮り直しボタンの設定
  retakeBtn.addEventListener('click', () => {resetImages(imageEls, formArea, submitBtn);});

  // 投稿ボタンの設定
  submitBtn.addEventListener('click', async () => 
  {
    await postSpot(captionEl, hiddenEl);
  });
  submitBtn.disabled = (images.filter(img => img.status !== 'NONE').length < 1);
  //メニューの初期化
  menuInitialize();
});

//このファイルが読み込まれてすぐ実行するコード(htmlの要素が必要ないもの)
