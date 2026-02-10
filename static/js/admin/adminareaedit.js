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
        const firstForm = document.querySelector('form:not(#requestform)');
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

            // Get or create hidden inputs in request form
            const setHiddenValue = (name, value) => {
                let input = requestForm.querySelector(`input[name="${name}"]`);
                if (input) {
                    input.value = value;
                } else {
                    input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = name;
                    input.value = value;
                    requestForm.appendChild(input);
                }
            };

            // Copy values from area form to request form
            if (areaIdInput) setHiddenValue('areaId', areaIdInput.value);
            if (areanameInput) setHiddenValue('areaname', areanameInput.value);
            if (descriptionInput) setHiddenValue('description', descriptionInput.value);
            if (areanameChangedInput) setHiddenValue('areanameChanged', areanameChangedInput.value);
            if (descriptionChangedInput) setHiddenValue('descriptionChanged', descriptionChangedInput.value);
            if (thumbnailChangedInput) setHiddenValue('thumbnailChanged', thumbnailChangedInput.checked);
            if (kmlChangedInput) setHiddenValue('kmlChanged', kmlChangedInput.checked);

            // Submit the request form
            requestForm.submit();
        }
    };

    // Attach click handler to submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitForm);
    }
});
