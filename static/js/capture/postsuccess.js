
const heroImg=document.getElementById("heroImg");
const thumbList=document.getElementById("thumbList");
const captionEl=document.getElementById("captionText");

const currentSpot=postResponse.spotDto;
const imagePaths=currentSpot.images;

let currentForucusImgId=0;



function setcurrentForcusImgId(id)
{
  thumImgs=thumbList.children;
  console.log(id);
  currentForucusImgId=id; 
  currentForucusImgId=Math.min(imagePaths.length-1,currentForucusImgId);

  console.log(currentForucusImgId);

  //現在選択されているimgのクラスをfocusedに設定
  for(let i=0;i<thumImgs.length;i++)
  {
    thumImgs[i].classList.toggle('focused',i==currentForucusImgId);
  }

  heroImg.src=imagePaths[currentForucusImgId];
}

for(let i=0;i<imagePaths.length;i++)
{
  const img = document.createElement('img');
  img.src = imagePaths[i];
  img.onclick =()=>{ setcurrentForcusImgId(i); }
  thumbList.appendChild(img);
}

heroImg.src=imagePaths[currentForucusImgId];

if(currentSpot.description)
{
  captionEl.textContent=currentSpot.description;
}
