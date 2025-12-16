const redirectURL ="/game/questionStart";

const param={
    "session_id":response.session_id
}
//セッション情報をCookieに保存
Cookies.set('session_id',response.session_id,{ expires: 7 });
console.log(response);
post(redirectURL,param);