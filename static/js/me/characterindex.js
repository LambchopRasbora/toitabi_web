import menuInitialize from '../common/menu.js';

function showCharacterDetail(character) 
{
    const detailArea=document.getElementById("character-detail");

    const titleElement=document.getElementsByClassName("detail-title")[0];
    const imageElement=document.getElementsByClassName("detail-image")[0];
    const descriptionElement=document.getElementsByClassName("detail-description")[0];

    titleElement.textContent=character.name;
    imageElement.src=character.imageUri;
    descriptionElement.textContent=character.description;

    detailArea.classList.remove("hidden");
}

function hideCharacterDetail()
{
    const detailArea=document.getElementById("character-detail");
    detailArea.classList.add("hidden");
}


document.addEventListener('DOMContentLoaded',()=>{
    menuInitialize();
});