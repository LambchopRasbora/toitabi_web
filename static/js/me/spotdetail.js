import { mapIcons } from "../common/map/mapicons.js";
import { mapInitialize } from "../common/map/mapInitialize.js";
import { menuInitialize } from "../common/menu.js";
import {post} from "../common/serverRequest.js"


function setCurrentImgId(id, previewimageElements, mainImageElement) 
{
  previewimageElements.forEach((el, index) => {
    el.classList.toggle('focused', index === id);
  });
  mainImageElement.src = previewimageElements[id].src;
}


document.addEventListener('DOMContentLoaded', function() {


  const editBtn=document.getElementsByClassName('edit-btn')[0];
  editBtn.addEventListener('click',()=>{location.href='/me/spotedit?spotId='+spot.spotId;});

  const deleteBtn=document.getElementsByClassName('delete-btn')[0];
  deleteBtn.addEventListener('click',()=>{

    post('/me/deletespot',{spotId:spot.spotId});
  });


  // プレビュー画像とメイン画像の要素を取得
  const previewimageElements = document.querySelectorAll('.preview-image');
  const mainImageElement = document.getElementsByClassName('main-image')[0];

  //フォーカス変更をそれぞれのサブ画像に設定
  previewimageElements.forEach((el, index) => {
    el.addEventListener('click', () => setCurrentImgId(index, previewimageElements, mainImageElement));
    el.src=spot.images[index] || '/asset/images/default/NoImage.jpg';
  });

  

  setCurrentImgId(0, previewimageElements, mainImageElement);

  //説明文の設定
  const descriptionElement=document.getElementsByClassName('description')[0];
  descriptionElement.textContent=spot.description;

  //タグの設定
  const tagContainer=document.getElementsByClassName('tag-field')[0];

  spot.tags.forEach(tag=>{
    const tagElement=document.createElement('p');
    tagElement.classList.add('tag');
    tagElement.textContent='#' + tag.name;
    tagContainer.appendChild(tagElement);
  });

  //場所を示すマップとマーカーの設定
  const mapElement=document.getElementById('map');
  const map=mapInitialize(mapElement);
  map.setView([spot.latitude, spot.longitude], 15);
  L.marker([spot.latitude, spot.longitude],{icon:mapIcons.postedSpotIcon}).addTo(map);

  menuInitialize();
});
