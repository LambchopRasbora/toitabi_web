
const params={
        session_id:response.session_id,
        question_number:response.question_number
    };
const redirectURL =GetparamURL("/game/question",params);
window.location.href=redirectURL;