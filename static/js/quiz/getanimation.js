
function showMessage()
{
    const charactermessage= document.getElementsByClassName("message-area-container")[0];
    charactermessage.style.opacity = "1";
}

function hiddengetOverlay()
{
    const getoverlay=document.getElementById("get-overlay");
    getoverlay.classList.add("hidden");
}
function showMain()
{
    const app=document.getElementsByClassName("app")[0];
    app.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded",()=>{
    const character=response.getCharacterDto;
    if(!character)
    {
        hiddengetOverlay();
        showMain();
        return;
    }
    
    const characterimg = document.getElementsByClassName("character-img")[0];
    characterimg.src=character.lowImagePath;
    characterimg.addEventListener("animationend",showMessage);

    const messageTitle=document.getElementsByClassName("message-title")[0];
    messageTitle.textContent=character.name;
    const messageText=document.getElementsByClassName("message-text")[0];
    messageText.textContent=character.description;

    const get_close_btn=document.getElementsByClassName("get-close-btn")[0];
    get_close_btn.addEventListener("click",()=>{
        console.log("close btn clicked");
        hiddengetOverlay();
        showMain();
    });
});

