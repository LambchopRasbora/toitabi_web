import { mapIcons } from "../common/map/mapicons.js";
import { mapInitialize } from "../common/map/mapInitialize.js";
import { menuInitialize } from "../common/menu.js";
import {post} from "../common/serverRequest.js"
import PhotoGallery from "../components/photo-gallery.js";



document.addEventListener('DOMContentLoaded', function() {

  const {createApp}=Vue;
  createApp({
    data(){
      return {
        spotPhotos:spot.images,
        spottags:spot.tags,
      }
    },
    components:{
      'photo-gallery':PhotoGallery
    }
  }).mount('#spot-detail-screen');

  const editBtn=document.getElementsByClassName('edit-btn')[0];
  editBtn.addEventListener('click',()=>{location.href='/me/spotedit?spotId='+spot.spotId;});

  const deleteBtn=document.getElementsByClassName('delete-btn')[0];
  deleteBtn.addEventListener('click',()=>{

    post('/me/deletespot',{spotId:spot.spotId});
  });

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

  //投稿者の設定
  const authorElement=document.querySelector('.author-field');
  authorElement.textContent=spot.author||'問人知らず';

  menuInitialize();
});
