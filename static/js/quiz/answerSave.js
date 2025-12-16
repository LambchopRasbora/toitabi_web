 const params={
            session_id:response.session_id,
            answer_id:response.answer_id
        };

const redirectURL =GetparamURL("/game/answer",params);
window.location.href=redirectURL;