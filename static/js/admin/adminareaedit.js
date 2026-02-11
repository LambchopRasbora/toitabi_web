document.addEventListener('DOMContentLoaded', function(){
    const nameInput = document.getElementById('name');
    const descInput = document.getElementById('desc');
    const nameChanged = document.getElementById('areanameChangedHidden');
    const descChanged = document.getElementById('descriptionChangedHidden');
    const thumbCheckbox = document.getElementById('thumbCheckbox');
    const thumbFile = document.getElementById('thumbnailfile');
    const kmlCheckbox = document.getElementById('kmlCheckbox');
    const kmlFile = document.getElementById('kmlfile');
    const idInput = document.getElementById('id');

    const initial = {
        name: nameInput ? nameInput.value : '',
        desc: descInput ? descInput.value : ''
    };

    if (nameInput && nameChanged) {
        nameInput.addEventListener('input', function(){
            nameChanged.value = (nameInput.value !== initial.name) ? 'true' : 'false';
        });
    }

    if (descInput && descChanged) {
        descInput.addEventListener('input', function(){
            descChanged.value = (descInput.value !== initial.desc) ? 'true' : 'false';
        });
    }

    function updateThumbVisibility(){
        if (!thumbFile || !thumbCheckbox) return;
        thumbFile.style.display = thumbCheckbox.checked ? '' : 'none';
    }

    if (thumbCheckbox) {
        thumbCheckbox.addEventListener('change', updateThumbVisibility);
    }

    if (thumbFile) {
        thumbFile.addEventListener('change', function(){
            if (thumbFile.files && thumbFile.files.length > 0){
                if (thumbCheckbox) thumbCheckbox.checked = true;
            }
        });
    }

    function updateKmlVisibility(){
        if (!kmlFile || !kmlCheckbox) return;
        const visible = kmlCheckbox.checked;
        kmlFile.style.display = visible ? '' : 'none';
        kmlFile.required = visible;
        if (!visible){
            kmlFile.value = '';
            if (kmlCheckbox) kmlCheckbox.checked = false;
        }
    }

    if (kmlCheckbox){
        kmlCheckbox.addEventListener('change', updateKmlVisibility);
    }

    if (kmlFile){
        kmlFile.addEventListener('change', function(){
            if (kmlFile.files && kmlFile.files.length > 0){
                if (kmlCheckbox) kmlCheckbox.checked = true;
            }
        });
    }

    updateThumbVisibility();
    updateKmlVisibility();

    // Function to copy area form values to request form and submit
    const submitForm = function() {
        const firstForm = document.getElementById('areaForm');
        const requestForm = document.getElementById('requestform');
        
        if (firstForm && requestForm) {
            // Copy area form values to request form hidden inputs
            const areaIdInput = firstForm.querySelector('input[name="areaId"]');
            const areanameInput = firstForm.querySelector('input[name="areaname"]');
            const descriptionInput = firstForm.querySelector('textarea[name="description"]');
            const areanameChangedInput = document.getElementById('areanameChangedHidden');
            const descriptionChangedInput = document.getElementById('descriptionChangedHidden');
            const thumbnailChangedInput = document.getElementById('thumbCheckbox');
            const kmlChangedInput = document.getElementById('kmlCheckbox');

            let formData = new FormData(requestForm);

            formData.append('areaId', areaIdInput ? areaIdInput.value : '');
            formData.append('areanameChanged', areanameChangedInput ? areanameChangedInput.value : 'false');
            formData.append('areaname', areanameInput ? areanameInput.value : '');
            formData.append('descriptionChanged', descriptionChangedInput ? descriptionChangedInput.value : 'false');
            formData.append('description', descriptionInput ? descriptionInput.value : '');
            formData.append('thumbnailChanged', thumbnailChangedInput ? thumbnailChangedInput.checked : false);
            if( thumbnailChangedInput && thumbnailChangedInput.checked &&thumbFile && thumbFile.files && thumbFile.files.length > 0)
            {
              formData.append('thumbnailfile',  thumbFile.files[0]);
            }
            console.log(areaIdInput.value);
            formData.append('kmlChanged', kmlChangedInput ? kmlChangedInput.checked : false);
            if( kmlChangedInput && kmlChangedInput.checked && kmlFile && kmlFile.files && kmlFile.files.length > 0)
            {
              formData.append('kmlfile', kmlFile.files[0]);
            }

            fetch(requestForm.action, {
                method: 'POST',
                body: formData,
                redirect: 'follow'
            }).then(response => {
                if (response.ok) {
                    window.location.href = response.url;
                }}).catch(error => {
                console.error('Error submitting form:', error);
            });
        };
    };
    const deleteForm = function() 
    {
        const areaIdInput = firstForm.querySelector('input[name="areaId"]');

        const deleteform=document.getElementById('deleteform');
        let formData = new FormData(deleteform);
        formData.append('areaId', areaIdInput ? areaIdInput.value : '');

        fetch(deleteform.action, {
                method: 'POST',
                body: formData,
                redirect: 'follow'
            }).then(response => {
                if (response.ok) {
                    window.location.href = response.url;
                }}).catch(error => {
                console.error('Error submitting form:', error);
            });
    }
    // Attach click handler to submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitForm);
    }
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteForm);
    }
});
