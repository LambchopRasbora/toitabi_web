    const params={
                session_id:response.session_id
            }
Cookies.remove('session_id');
const redirectURL=GetparamURL("/game/result",params);
    window.location.href=redirectURL;