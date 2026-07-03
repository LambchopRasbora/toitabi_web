import { menuInitialize } from "../common/menu.js";
import ToitabiFooter from "../components/toitabi-footer.js";

document.addEventListener('DOMContentLoaded', function() {
    
    const {createApp}=Vue;
    createApp({
    data(){
      return {
        leftContents:[
          {
            caption:"ホームへ戻る",
            class:"home-btn",
            icon:"/asset/images/icon/icon_home.png",
            onClick:()=>{location.href='/';}
          }],
        rightContents:[
          {
            caption:"トイスポットを投稿",
            class:"post-btn",
            icon:"/asset/images/icon/icon_post.png",
            onClick:()=>{location.href='spotpost/capture';}
          }]
      }
    },
    components:{
      'toitabi-footer':ToitabiFooter
    }
  }).mount('#footer');

    const usernameField=document.getElementById('username-field');
    const emailField=document.getElementById('email-field');

    usernameField.textContent=user.username;
    emailField.textContent=user.email;

    menuInitialize();
});