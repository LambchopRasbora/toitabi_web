
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
