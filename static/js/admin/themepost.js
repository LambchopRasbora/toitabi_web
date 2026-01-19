let ruleCount = 1;

// Initialize the first rule's value fields
document.addEventListener('DOMContentLoaded', function() {
    updateRuleValueFields(0);
});

function updateRuleValueFields(ruleIndex) {
    const ruleTypeSelect = document.querySelector(`#ruletype-${ruleIndex}`);
    const ruleValuesContainer = document.querySelector(`#rulevalues-${ruleIndex}`);
    const ruleValueContainerDiv = document.querySelector(`#rulevalues-container-${ruleIndex}`);
    const selectedType = ruleTypeSelect.value;
    
    // Clear existing fields
    ruleValuesContainer.innerHTML = '';
    
    // Hide the entire container if NONE or ALL
    if (selectedType === 'NONE' || selectedType === 'ALL' || selectedType === '') {
        ruleValueContainerDiv.style.display = 'none';
    } else {
        ruleValueContainerDiv.style.display = 'block';
        
        // Add first input field based on type
        if (selectedType === 'ID_MATCH') {
            addRuleValue(ruleIndex, 'number');
        } else if (selectedType === 'TAG_MATCH') {
            addRuleValue(ruleIndex, 'text');
        }
    }
}

function addRuleValue(ruleIndex, inputType = null) {
    const ruleTypeSelect = document.querySelector(`#ruletype-${ruleIndex}`);
    const selectedType = ruleTypeSelect.value;
    
    if (selectedType === 'NONE' || selectedType === 'ALL' || selectedType === '') {
        alert('ルールタイプを選択してください');
        return;
    }
    
    const ruleValuesContainer = document.querySelector(`#rulevalues-${ruleIndex}`);
    
    // Determine input type
    let type = inputType;
    if (!type) {
        type = selectedType === 'ID_MATCH' ? 'number' : 'text';
    }
    
    // Count existing inputs
    const valueIndex = ruleValuesContainer.children.length;
    
    const inputWrapper = document.createElement('div');
    inputWrapper.style.display = 'flex';
    inputWrapper.style.gap = '8px';
    inputWrapper.style.alignItems = 'center';
    inputWrapper.className = 'rule-value-input';
    inputWrapper.dataset.valueIndex = valueIndex;
    
    const input = document.createElement('input');
    input.type = type;
    input.name = `rulevalues-${ruleIndex}-${valueIndex}`;
    input.className = `rule-value-${ruleIndex}`;
    input.style.flex = '1';
    input.required = true;
    
    if (type === 'number') {
        input.min = '0';
        input.placeholder = '数値を入力';
    } else {
        input.placeholder = '文字列を入力';
    }
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-value-btn';
    removeBtn.textContent = '削除';
    removeBtn.style.background = '#f44336';
    removeBtn.style.color = 'white';
    removeBtn.style.padding = '5px 10px';
    removeBtn.style.border = 'none';
    removeBtn.style.borderRadius = '4px';
    removeBtn.style.cursor = 'pointer';
    removeBtn.style.fontSize = '12px';
    removeBtn.onclick = function() {
        inputWrapper.remove();
    };
    
    inputWrapper.appendChild(input);
    inputWrapper.appendChild(removeBtn);
    ruleValuesContainer.appendChild(inputWrapper);
}

function addRuleItem() {
    const rulesContainer = document.getElementById('rulesContainer');
    
    const newRuleItem = document.createElement('div');
    newRuleItem.className = 'rule-item';
    newRuleItem.dataset.ruleIndex = ruleCount;
    
    newRuleItem.innerHTML = `
        <div style="grid-column: 1 / -1;">
            <label for="ruletype-${ruleCount}">ルールタイプ</label>
            <select id="ruletype-${ruleCount}" class="ruletype-select" data-rule-index="${ruleCount}" onchange="updateRuleValueFields(${ruleCount})" required>
                <option value="">選択してください</option>
                <option value="NONE">NONE</option>
                <option value="ALL">ALL</option>
                <option value="TAG_MATCH">TAG_MATCH</option>
                <option value="ID_MATCH">ID_MATCH</option>
            </select>
        </div>
        <div style="grid-column: 1 / -1;" id="rulevalues-container-${ruleCount}">
            <label>ルール値</label>
            <div id="rulevalues-${ruleCount}" style="display: flex; flex-direction: column; gap: 8px;">
                <!-- Values will be added here dynamically -->
            </div>
            <button type="button" class="add-value-btn" onclick="addRuleValue(${ruleCount})" style="margin-top: 8px; background-color: #2196F3; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">値を追加</button>
        </div>
        <div style="grid-column: 1 / -1; text-align: right;">
            <button type="button" class="remove-rule-btn" onclick="removeRuleItem(${ruleCount})">ルールを削除</button>
        </div>
    `;
    
    rulesContainer.appendChild(newRuleItem);
    ruleCount++;
}

function removeRuleItem(index) {
    const ruleItem = document.querySelector(`[data-rule-index="${index}"]`);
    if (ruleItem) {
        ruleItem.remove();
    }
}

// Handle checkbox values for POST submission
document.querySelector('form').addEventListener('submit', function(e) {
    const enabledCheckbox = document.getElementById('enabled');
    const hiddenCheckbox = document.getElementById('hidden');
    
    // Process rules and convert to JSON format
    const ruleItems = document.querySelectorAll('.rule-item');
    const rulesData = [];
    
    ruleItems.forEach((ruleItem) => {
        const ruleIndex = ruleItem.dataset.ruleIndex;
        const ruleTypeSelect = document.querySelector(`#ruletype-${ruleIndex}`);
        const ruleType = ruleTypeSelect.value;
        
        if (ruleType && ruleType !== '') {
            if (ruleType === 'NONE' || ruleType === 'ALL') {
                // No values needed
                rulesData.push({
                    type: ruleType,
                    values: []
                });
            } else {
                // Collect values
                const valueInputs = ruleItem.querySelectorAll(`.rule-value-${ruleIndex}`);
                const values = [];
                
                valueInputs.forEach((input) => {
                    if (input.value) {
                        if (ruleType === 'ID_MATCH') {
                            values.push(parseInt(input.value));
                        } else if (ruleType === 'TAG_MATCH') {
                            values.push(input.value);
                        }
                    }
                });
                
                if (values.length > 0) {
                    rulesData.push({
                        type: ruleType,
                        values: values
                    });
                }
            }
        }
    });
    
    // Create hidden inputs for rules
    rulesData.forEach((rule, index) => {
        const ruleTypeInput = document.createElement('input');
        ruleTypeInput.type = 'hidden';
        ruleTypeInput.name = 'ruletypes';
        ruleTypeInput.value = rule.type;
        this.appendChild(ruleTypeInput);
        
        const ruleValueInput = document.createElement('input');
        ruleValueInput.type = 'hidden';
        ruleValueInput.name = 'rulevalues';
        ruleValueInput.value = JSON.stringify(rule.values);
        this.appendChild(ruleValueInput);
    });
    
    // Create hidden inputs for checkboxes
    if (!enabledCheckbox.checked) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'enabled';
        input.value = 'false';
        this.appendChild(input);
    }
    
    if (!hiddenCheckbox.checked) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'hidden';
        input.value = 'false';
        this.appendChild(input);
    }
});
