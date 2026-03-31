let side_menu=undefined;
let menu_btns=undefined;
let menu_close_btn=undefined;

export function menuInitialize()
{
    //メニュー関係の処理
    menu_btns=document.getElementsByClassName('menu-btn');
    side_menu=document.getElementsByClassName("side-menu")[0];
    menu_close_btn=document.getElementsByClassName("menu-close-btn")[0];
    //メニューボタンを押したときの関数
    function toggleMenu()
    {
        side_menu.classList.toggle("active");
    }
    //関数をそれぞれのbtnのイベントに追加する
    for(let i=0;i<menu_btns.length;i++)
    {
        menu_btns[i].addEventListener('click',toggleMenu);
    }
    if(menu_close_btn) menu_close_btn.addEventListener('click',toggleMenu);

    //このスクリプトが読み込まれた際にほかのコンテンツが読み込まれていなかった時用、DOMContentLoadedイベントで要素を取得する
    document.addEventListener('DOMContentLoaded',()=>{
        if(!side_menu) side_menu=document.getElementsByClassName("side-menu")[0];
        menu_btns=document.getElementsByClassName('menu-btn');
        for(let i=0;i<menu_btns.length;i++)
        {
            menu_btns[i].addEventListener('click',toggleMenu);
        }
        if(!menu_close_btn)
        { 
            menu_close_btn=document.getElementsByClassName("menu-close-btn")[0];
            menu_close_btn.addEventListener('click',toggleMenu);
        }
    });
}

export function toggleMenu()
{
    if(!side_menu) side_menu=document.getElementsByClassName("side-menu")[0];
    side_menu.classList.toggle("active");
}