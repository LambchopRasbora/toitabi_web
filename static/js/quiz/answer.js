
function onclickNext()
{
  const params={
    "session_id":response.session_id
  };
  const postURL=response.finish?"/game/quizFinish":"/game/questionStart";
  post(postURL,params);
}