

function submitForm()
{
    const themeForm=document.getElementById('themeForm');
    const requestForm = document.getElementById('requestform');

    if(!requestForm||!themeForm){
        console.error("themeFormかrequestFormが存在しません");
        return;
    }

    //themeIdは必須
    const themeIdInput=themeForm.querySelector('input[name="themeId"]');
    if(!themeIdInput){
        console.error("themeIdが送信されていません");
        return;
    }

    let formData=new FormData(requestForm);

    formData.append('themeId',themeIdInput);

    fetch(requestForm.action,{
        method:'POST',
        body:formData,
        redirect:'follow'
    }).then(response => {
        if (response.ok) {
            window.location.href = response.url;
        }}).catch(error => {
        console.error('Error submitting form:', error);
    });
}

function deleteForm(){
    const themeForm=document.getElementById('themeForm');
    const deleteForm = document.getElementById('deleteform');

    if(!requestForm||!themeForm){
        console.error("themeFormかdeleteFormが存在しません");
        return;
    }

    //themeIdは必須
    const themeIdInput=themeForm.querySelector('input[name="themeId"]');
    if(!themeIdInput){
        console.error("themeIdが送信されていません");
        return;
    }
    let formData=new FormData(requestForm);
    formData.append('themeId',themeIdInput);

    fetch(deleteForm.action,{
        method:'POST',
        body:formData,
        redirect:'follow'
    }).then(response => {
        if (response.ok) {
            window.location.href = response.url;
        }}).catch(error => {
        console.error('Error submitting form:', error);
    });
}

document.addEventListener('DOMContentLoaded',()=>{

    //submit,deleteのボタンにイベントを付与
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitForm);
    }
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteForm);
    }
});