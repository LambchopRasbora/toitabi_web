import { postFormdata } from "../common/serverRequest.js";
import ThemeRuleEditor from "../components/theme/themeruleeditor.js";

const initialData=window.__THEME_DATA__ ||{};

const tags=window.__TAG_DATA__||{};

async function submitForm(initialData,initailRules,form,rules)
{
    //themeIdは必須
    const themeId=form.themeId;
    if(!themeId){
        console.error("themeIdが送信されていません");
        return;
    }
    const name=form.name;
    const desc=form.description;
    const isEnabled=form.enabled;
    const isHidden=form.hidden;

    const nameChanged=initialData.name!==name;
    const descriptionChanged=initialData.desc!==desc;
    const enabledChanged=initialData.enabled!==isEnabled;
    const hiddenChanged=initialData.hidden!==isHidden;
    const thumbnailChanged=form.isthumbnailChanged;

    let formData=new FormData();

    formData.append('themeId',themeId);
    formData.append('nameChanged',nameChanged);
    formData.append('name',nameChanged?name:'');
    formData.append('descriptionChanged',descriptionChanged);
    formData.append('thumbnailChanged',thumbnailChanged)
    formData.append('description',descriptionChanged?desc:'');
    formData.append('enabledChanged',enabledChanged);
    formData.append('enabled',enabledChanged?isEnabled:false);
    formData.append('hiddenChanged',hiddenChanged);
    formData.append('hidden',hiddenChanged?isHidden:false);

    if(thumbnailChanged&&form.thumbnailFile)
    {
        formData.append('thumbnailFile',form.thumbnailFile);
    }

    const ruleChanged=initailRules!==rules;
    console.log(ruleChanged);
    formData.append('rulesChanged',ruleChanged);
    if(ruleChanged)
    {
        let rulesData = [];
        rules.forEach((ruleItem) => {
            const ruleType = ruleItem.ruleType;
            if (ruleType && ruleType !== '') {
                if (ruleType === 'NONE' || ruleType === 'ALL') {
                    rulesData.push({
                        themeId:ruleItem.themeId||null,
                        themeruleId:ruleItem.themeruleId||null,
                        ruleType: ruleType,
                        ruleValue: '[]'
                    });
                } 
                else {
                    const values = ruleItem.ruleValue;
                    if (values.length > 0) {
                        rulesData.push({
                            themeId:ruleItem.themeId||null,
                            themeruleId:ruleItem.themeruleId||null,
                            ruleType: ruleType,
                            ruleValue: JSON.stringify(values)
                        });
                    }
                }
            }
        });
        formData.append('rules',JSON.stringify(rulesData));
    }
    else{
        formData.append('rules',null);
    }
    

    await postFormdata("/admin/adminthemeedit",formData)
}

async function deleteForm(themeId){
    //themeIdは必須
    if(!themeId){
        console.error("themeIdが送信されていません");
        return;
    }
    let formData=new FormData();
    formData.append('themeId',themeId);
    await postFormdata("/admin/adminthemedelete",formData);
}

document.addEventListener('DOMContentLoaded',()=>{

    const {createApp,ref,reactive}=Vue;

    createApp({
        components:{
            ThemeRuleEditor
        },
        setup(){

            const form=reactive({
                themeId:initialData.themeId||0,
                areaId:initialData.areaId||0,
                name:initialData.name||'',
                description:initialData.description||'',
                thumbnailFile:null,
                isthumbnailChanged:false,
                enabled:initialData.enabled||true,
                hidden:initialData.hidden||false,
            });

            console.log(form.themeId);
            const previewThumbnailURL=ref(initialData.thumbnailUri||null);

            let initialRules=null;

            if(initialData.rules){
                initialRules=initialData.rules.map((rule,index)=>{
                    let parsed=[];
                    try{
                        parsed=JSON.parse(rule.ruleValue);
                        if(rule.ruleType==='TAG_MATCH')
                        {
                            const tagNames=parsed.map((id)=>{
                                return tags.find((t)=>{return t.tagId===id}).name;
                            });
                            return {...rule,ruleValue:tagNames};
                        }
                    }
                    catch(e){
                        console.error(e);
                    }
                    return {...rule,ruleValue:parsed};
                });
            }

            const rules=ref(initialRules||[{ruleType:'',ruleValue:[]}]);

            const addRuleItem=()=>{
                rules.value.push({ruleType:'',ruleValue:[]});
            }
            const removeRuleItem=(index)=>{
                rules.value.splice(index,1);
            }

            const handleFileUpload=(event)=>{
                form.thumbnailFile=event.target.files[0]||null;
                if(!form.thumbnailFile)return;
                previewThumbnailURL.value=URL.createObjectURL(form.thumbnailFile);
                console.log(previewThumbnailURL.value);
            };

            const submitEdit=()=>{
                submitForm(initialData,initialRules,form,rules.value);
            };


            const submitDelete=()=>{
                deleteForm();
            };

            console.log("vue loaded");
            return {
                form,
                rules,
                addRuleItem,
                removeRuleItem,
                handleFileUpload,
                submitEdit,
                submitDelete,
                previewThumbnailURL
            }
        }

    }).mount('#edit-form');
});