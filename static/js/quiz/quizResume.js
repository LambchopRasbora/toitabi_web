
let redirectURL="";
if(response.isAnswer)
{
    const params={
            session_id:response.session_id,
            answer_id:response.current_question_number
        }
    redirectURL=GetparamURL("/game/answer",params);
}
else
{
    const params={
            session_id:response.session_id,
            question_number:response.current_question_number
        }
    redirectURL=GetparamURL("/game/question",params);
}
console.log(response);
window.location.href=redirectURL;
