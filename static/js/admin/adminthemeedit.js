let initialData={};

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
    const nameInput=document.getElementById('name');
    const descInput=document.getElementById('desc');
    const isEnabledCheckbox=document.getElementById('enabled');
    const isHiddenCheckbox=document.getElementById('hidden');

    const nameChanged=initialData.name!==nameInput.value;
    const descriptionChanged=initialData.desc!==descInput.value;
    const enabledChanged=initialData.enabled!==isEnabledCheckbox.checked;
    const hiddenChanged=initialData.hidden!==isHiddenCheckbox.checked;

    let formData=new FormData(requestForm);

    formData.append('themeId',themeIdInput.value);
    formData.append('nameChanged',nameChanged);
    formData.append('name',nameChanged?nameInput.value:'');
    formData.append('descriptionChanged',descriptionChanged);
    formData.append('description',descriptionChanged?descInput.value:'');
    formData.append('enabledChanged',enabledChanged);
    formData.append('enabled',enabledChanged?isEnabledCheckbox.checked:false);
    formData.append('hiddenChanged',hiddenChanged);
    formData.append('hidden',hiddenChanged?isHiddenCheckbox.checked:false);


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

    const nameInput=document.getElementById('name');
    const descInput=document.getElementById('desc');
    const isEnabledCheckbox=document.getElementById('enabled');
    const isHiddenCheckbox=document.getElementById('hidden');

    initialData={
        name:nameInput?nameInput.value:'',
        desc:descInput?descInput.value:'',
        enabled:isEnabledCheckbox?isEnabledCheckbox.checked:false,
        hidden:isHiddenCheckbox?isHiddenCheckbox.checked:false,
        themeRules:[]
    }

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