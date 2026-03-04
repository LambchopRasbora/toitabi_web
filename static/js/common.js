//メニュー関係の処理
let menu_btn=document.getElementById('menu-btn');
let side_menu=document.getElementsByClassName("side-menu")[0];
let menu_close_btn=document.getElementsByClassName("menu-close-btn")[0];
//メニューボタンを押したときの関数
function toggleMenu()
{
  side_menu.classList.toggle("active");
}
//関数をそれぞれのbtnのイベントに追加する
if(menu_btn)menu_btn.addEventListener('click',toggleMenu);
if(menu_close_btn) menu_close_btn.addEventListener('click',toggleMenu);


//QuestionDtoをローカルストレージに保存する
function saveQuestionDto(questionDto,key)
{
    const json=JSON.stringify(questionDto);

    const encripted=encrypt(json);

    localStorage.setItem(key,encripted);
}

//QuestionDtoをローカルから取り出す
function loadQuestionDto(key)
{
    const encrypted=localStorage.getItem(key);
    console.log(encrypted);
    if(!encrypted)return null;
    const json =decrypt(encrypted);
    return JSON.parse(json);
}

//このスクリプトが読み込まれた際にほかのコンテンツが読み込まれていなかった時用、DOMContentLoadedイベントで要素を取得する
document.addEventListener('DOMContentLoaded',()=>{
    if(!side_menu) side_menu=document.getElementsByClassName("side-menu")[0];
    if(!menu_btn)
    {
        menu_btn=document.getElementById('menu-btn');
        menu_btn.addEventListener('click',toggleMenu);
    }
    if(!menu_close_btn)
    { 
        menu_close_btn=document.getElementsByClassName("menu-close-btn")[0];
        menu_close_btn.addEventListener('click',toggleMenu);
    }
});