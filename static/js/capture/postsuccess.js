import { mapIcons } from "../common/map/mapicons.js";
import { mapInitialize } from "../common/map/mapInitialize.js";
import { menuInitialize } from "../common/menu.js";

let currentImgId=0;

function setCurrentImgId(id, previewimageElements, mainImageElement) 
{
  currentImgId = id;
  previewimageElements.forEach((el, index) => {
    el.classList.toggle('focused', index === currentImgId);
  });
  mainImageElement.src = previewimageElements[currentImgId].src;
}

function initSpotField(spotFieldElement, spot)
{
  // プレビュー画像とメイン画像の要素を取得
  const previewimageElements = spotFieldElement.querySelectorAll('.preview-image');
  const mainImageElement = spotFieldElement.querySelector('.main-image');

  //フォーカス変更をそれぞれのサブ画像に設定
  previewimageElements.forEach((el, index) => {
    el.addEventListener('click', () => setCurrentImgId(index, previewimageElements, mainImageElement));
    el.src=spot.images[index] || '/asset/images/default/NoImage.jpg';
  });

  setCurrentImgId(0, previewimageElements, mainImageElement);

  //説明文の設定
  const descriptionElement=spotFieldElement.querySelector('.description');
  descriptionElement.textContent=spot.description?? '';

  //タグの設定
  const tagContainer=spotFieldElement.querySelector('.tag-field');

  spot.tags.forEach(tag=>{
    const tagElement=document.createElement('p');
    tagElement.classList.add('tag');
    tagElement.textContent='#' + tag.name;
    tagContainer.appendChild(tagElement);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initSpotField(document.getElementsByClassName(`content`)[0],spot);

  //場所を示すマップとマーカーの設定
  const mapElement=document.getElementById('map');
  const map=mapInitialize(mapElement);
  map.setView([spot.latitude, spot.longitude], 15);
  L.marker([spot.latitude, spot.longitude],{icon:mapIcons.postedSpotIcon}).addTo(map);

  menuInitialize();
});
