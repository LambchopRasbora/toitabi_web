
import { postFormdata } from "../common/serverRequest.js";
import ThemeRuleEditor from "../components/theme/themeruleeditor.js";


async function submitForm(form,rules)
{
     const formData=new FormData();
    formData.append('areaId', form.areaId);
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('enabled',form.enabled);
    formData.append('hidden',form.hidden);

    const thumbnailInput =form.thumbnailfile;
    if (thumbnailInput ) {
        formData.append('thumbnailfile', thumbnailInput);
    }

    let rulesData = [];

    rules.forEach((ruleItem) => {
        const ruleType = ruleItem.ruleType;
        if (ruleType && ruleType !== '') {
            if (ruleType === 'NONE' || ruleType === 'ALL') {
                rulesData.push({
                    ruleType: ruleType,
                    ruleValue: '[]'
                });
            } 
            else {
                const values = ruleItem.ruleValue;
                if (values.length > 0) {
                    rulesData.push({
                        ruleType: ruleType,
                        ruleValue: JSON.stringify(values)
                    });
                }
            }
        }
    });
    formData.append('rules',JSON.stringify(rulesData));

    await postFormdata('/admin/adminthemepost',formData);
}

document.addEventListener('DOMContentLoaded', function() {

    const {createApp,ref,reactive}=Vue;

    createApp({
        setup(){
            const formData=reactive({
                areaId:'',
                name:'',
                description:'',
                thumbnailfile:null,
                enabled:true,
                hidden:false
            });

            const rules=ref([
                {ruleType:'',ruleValue:[]}
            ]);
            const addRuleItem=()=>{
                rules.value.push({ruleType:'',ruleValue:[]});
            }
            const removeRuleItem=(index)=>{
                rules.value.splice(index,1);
            }

            const handleFileUpload=(event)=>{
                formData.thumbnailfile=event.target.files[0]||null;
            };

            const submit=()=>{
                submitForm(formData,rules.value)
            };

            return {
                formData,
                rules,
                addRuleItem,
                removeRuleItem,
                handleFileUpload,
                submit
            }
        },
        components:{
            ThemeRuleEditor
        }
    }).mount('#post-form')

});