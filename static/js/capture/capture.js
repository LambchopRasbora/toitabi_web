const shootBtn   = document.getElementById('shootBtn');
const fileInputtemp=document.getElementById('fileInputtemp');
const fileInput  = document.getElementById('fileInput');
const formArea   = document.getElementById('formArea');
const previewGrid = document.getElementById('previewGrid');
const captionEl  = document.getElementById('caption');
const submitBtn  = document.getElementById('submitBtn');
const retakeBtn  = document.getElementById('retakeBtn');
const locBtn     = document.getElementById('locBtn');
const locStatus  = document.getElementById('locStatus');

//filesは先に4の配列にしておくnullの場所にファイルを当てはめていく
let files = [null,null,null,null];
let geo = null;

let currentForucusImgId=0;


function setcurrentForcusImgId(id){
  currentForucusImgId=id; 
  currentForucusImgId=Math.min(3,currentForucusImgId);

  //現在選択されているimgのクラスをfocusedに設定
  children = previewGrid.children;
  for(i=0;i<children.length;i++)
  {
    children[i].classList.toggle('focused',i==currentForucusImgId);
  }
}

// カメラ起動（スマホならカメラ、PCならファイル選択）
shootBtn.addEventListener('click', () => fileInput.click());


// ファイル選択時
fileInput.addEventListener('change', () => {

  let fileNumber=fileInput.files.length;
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
      img.onclick=()=>{ setcurrentForcusImgId(index); }
      previewGrid.appendChild(img);
    }
  });

  //現在選択されているimgのクラスをfocusedに設定
  children = previewGrid.children;
  for(i=0;i<children.length;i++)
  {
    children[i].classList.toggle('focused',i==currentForucusImgId);
  }
  
  formArea.classList.remove('is-hidden');
  submitBtn.disabled = (files.length < 1);
});

// 位置情報取得
locBtn.addEventListener('click', () => {
  if (!('geolocation' in navigator)) {
    locStatus.textContent = 'この端末は位置情報に非対応です';
    return;
  }
  locStatus.textContent = '取得中…';
  navigator.geolocation.getCurrentPosition(
    pos => {
      geo = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        acc: pos.coords.accuracy
      };
      locStatus.textContent = `取得: ${geo.lat.toFixed(5)}, ${geo.lng.toFixed(5)} (±${Math.round(geo.acc)}m)`;
    },
    err => {
      console.warn(err);
      locStatus.textContent = '取得に失敗しました';
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

// 撮り直し
retakeBtn.addEventListener('click', () => {
  fileInput.value = '';
  previewGrid.innerHTML = '';
  formArea.classList.add('is-hidden');
  submitBtn.disabled = true;
  files = [];
});

// 投稿ボタン
submitBtn.addEventListener('click', async () => {
  if (files.length === 0) return;

  const fd = new FormData();
  if(files.length<1){
    alert('画像が選択されていません!!');
    return;
  }
  else if(!geo)
  {
    alert('トイスポットの位置が選択されていません!!');
    return;
  }
  // ロード画面を表示
  document.getElementById("loadingOverlay").style.display = "flex";
  //画像送信用のURL
  const url="https://toitabi.net/toitabi-test-image/upload";
  const promises = files
    .filter(f => f instanceof File)                 // null/undefined を除外
    .map(f => uploadImageToPresignedURL(url, f));
    
  let params={
    "latitude":geo.lat,
    "longitude":geo.lng,
    "author":"dummyauthor",
    "description":captionEl.value,
    "images":[]
  }
  const datas= await Promise.all(promises);
  datas.forEach((data)=>{
    params.images.push(data.url);
   });
   console.log(params);
   console.log(params.images.at(0));
  post('./confirm',params,);
});
