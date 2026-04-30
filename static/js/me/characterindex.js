import {menuInitialize} from '../common/menu.js';

function showCharacterDetail(character) 
{

    const detailArea=document.getElementById("character-detail");

    const titleElement=document.getElementsByClassName("detail-title")[0];
    const imageElement=document.getElementsByClassName("detail-image")[0];
    const descriptionElement=document.getElementsByClassName("detail-description")[0];

    titleElement.textContent=character.name;
    imageElement.src=character.highImageUri;
    descriptionElement.textContent=character.description;

    detailArea.classList.remove("hidden");
}

function hideCharacterDetail()
{
    const detailArea=document.getElementById("character-detail");
    detailArea.classList.add("hidden");
}


document.addEventListener('DOMContentLoaded',()=>{

    const closeBtn=document.getElementsByClassName('detail-close-btn')[0];
    closeBtn.addEventListener('click',hideCharacterDetail);

    const characterCards=document.getElementsByClassName('character-card');
    Array.from(characterCards).forEach(card=>{
        const charaId=card.dataset.charaId;
        card.addEventListener('click',()=>{showCharacterDetail(charas.find(c => c.charaId === charaId)) });
    });

    menuInitialize();
});