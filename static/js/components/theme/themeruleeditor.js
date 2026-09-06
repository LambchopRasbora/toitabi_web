const ThemeRuleEditor={

    props:
    {
        modelValue:{
            type:Object,
            required:true,
            default:{
                ruleType:'',
                ruleValue:[]
            }
        },
        index:{type:Number,required:true}
    },
    emits:['update:modelValue','remove'],
    template:`
    <div data-rule-section="fullwidth">
            <label>ルールタイプ</label>
            <select class="ruletype-select" v-model="localRuleType" required>
                <option value="">選択してください</option>
                <option value="NONE">NONE</option>
                <option value="ALL">ALL</option>
                <option value="TAG_MATCH">TAG_MATCH</option>
                <option value="ID_MATCH">ID_MATCH</option>
            </select>
        </div>
        <div v-if="modelValue.ruleType!=='NONE' && modelValue.ruleType!=='ALL'" data-rule-section="fullwidth">
            <label>ルール値</label>
            <div class="rule-values-container">
                <div class="rule-value-input" v-for="(val, valIndex) in modelValue.ruleValue" :key="valIndex">
                        <input 
                            :type="modelValue.ruleType === 'ID_MATCH' ? 'number' : 'text'" 
                            :value="val"
                            @input="updateValue(valIndex, $event.target.value)"
                            :placeholder="modelValue.ruleType === 'ID_MATCH' ? '数値を入力' : '文字列を入力'" 
                            :min="modelValue.ruleType === 'ID_MATCH' ? 0 : null"
                            required
                        />
                        <button type="button" class="remove-value-btn" @click="removeRuleValue(valIndex)">削除</button>
                    </div>
            </div>
            <button type="button" class="add-value-btn" @click ="addRuleValue">値を追加</button>
        </div>
        <div style="grid-column: 1 / -1; text-align: right;">
            <button type="button" class="remove-rule-btn" @click="$emit('remove')">ルールを削除</button>
        </div>
    </div>
    `,
    setup(props,{emit}){
        const localRuleType = Vue.computed({
            get:()=>props.modelValue.ruleType,
            set:(newType)=>{
                const updated={...props.modelValue,ruleType:newType,ruleValue:[]};
                emit('update:modelValue',updated);
            }
        })
        const addRuleValue=()=>{
        const newValues=[...props.modelValue.ruleValue,''];
        emit('update:modelValue',{...props.modelValue,ruleValue:newValues});
       };
       const removeRuleValue=(index)=>{
        const newValues=props.modelValue.ruleValue.filter((_,i)=>i!==index);
        emit('update:modelValue',{...props.modelValue,ruleValue:newValues})
       };
       const updateValue=(index,value)=>{
        const newValues=[...props.modelValue.ruleValue];
        newValues[index]=value;
        emit('update:modelValue',{...props.modelValue,ruleValue:newValues});
       };

       return{
        localRuleType,
        updateValue,
        addRuleValue,
        removeRuleValue
       }
    }

};

export default ThemeRuleEditor;