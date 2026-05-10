import {menuInitialize} from '../common/menu.js';
import { characterPositions } from './character/characterPositions.js';

function showCharacterDetail(character) 
{

    const detailArea=document.getElementById("character-detail");

    const titleElement=document.getElementsByClassName("detail-title")[0];
    const imageElement=document.getElementsByClassName("detail-image")[0];
    const descriptionElement=document.getElementsByClassName("detail-description")[0];

    titleElement.textContent=character.name;
    imageElement.src=character.highImageUri;
    descriptionElement.textContent=character.description;

    detailArea.classList.toggle("overlay");
    detailArea.classList.remove("hidden");
}

function hideCharacterDetail()
{
    const detailArea=document.getElementById("character-detail");
    detailArea.classList.add("hidden");
    detailArea.classList.toggle("overlay")
}


document.addEventListener('DOMContentLoaded',()=>{

    const closeBtn=document.getElementsByClassName('detail-close-btn')[0];
    closeBtn.addEventListener('click',hideCharacterDetail);
    const charaPositions=characterPositions;

    const charaContainer=document.getElementsByClassName("character-container")[0];

    const charaTemplate=document.getElementById("character-index-button");

    charas.forEach(chara=>{
        const position=charaPositions.find(({charaId})=>charaId===chara.charaId);
        const fragment = charaTemplate.content.cloneNode(true);
        const container= fragment.querySelector(".chara-button");
        container.addEventListener('click',()=>{showCharacterDetail(chara);});
        fragment.querySelector(".chara-img").src=chara.lowImageUri;
        container.style.width=`${position.width}px`;
        container.style.left=`${position.x}px`;
        container.style.top=`${position.y}px`;

        charaContainer.appendChild(fragment);

    });

    const characterCards=document.getElementsByClassName('character-card');
    Array.from(characterCards).forEach(card=>{
        const charaId=card.dataset.charaId;
        card.addEventListener('click',()=>{showCharacterDetail(charas.find(c => c.charaId === charaId)) });
    });

    menuInitialize();
});