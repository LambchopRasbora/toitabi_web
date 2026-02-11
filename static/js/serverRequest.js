
//データとともにURLへPOST、画面遷移まで行う
function postJsonAndmove(url,data)
{
    fetch(url,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    })
    .then(res=>{
        if(res.redirected)window.location.href=res.url;
        else return res.text();
    })
    .then(html=>{
        if(!html)return;
        document.open();
        document.writeln(html);
        document.close();
    })
    .catch(e=>{
        console.log(e);
    })
}

function postForm(url,formdata)
{
    fetch(url, {
    method: "POST",
    body: formdata,
    redirect: "follow"  // 自動 GET
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        if(data.redirected){
            window.location.href=data.redirectUrl;
            return;
        }
        console.log("URL is undefined");
    });
}

//Getリクエストを行うパラメータを含んだURLを返却する
function GetparamURL(url,dto)
{
    const param=new URLSearchParams(dto);
    return `${url}?${param.toString()}`;
}

//Getリクエストを行うパラメータを含んだURLを返却する
function GetListparamURL(url,list)
{
    const param=new URLSearchParams();
    list.forEach(element => {
     param.append("fileNames",element);
    });
    return `${url}?${param.toString()}`;
}

function post(path, params, method='post') {

  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) 
    {
  if (!params.hasOwnProperty(key)) continue;

    // 配列なら複数 input を作る
    if (Array.isArray(params[key])) {

      params[key].forEach(v => {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;   // ← 同じ name を複数送る
        hiddenField.value = v;
        form.appendChild(hiddenField);
      });

    } else {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];
      form.appendChild(hiddenField);
    }
  }
  
  // ===== CSRF 追加 =====
  const csrfToken = document.querySelector('meta[name="_csrf"]').content;
  const csrfParam = document.querySelector('meta[name="_csrf_parameter"]').content;

  const csrfInput = document.createElement('input');
  csrfInput.type = 'hidden';
  csrfInput.name = csrfParam;
  csrfInput.value = csrfToken;
  form.appendChild(csrfInput);

  document.body.appendChild(form);
  form.submit();
}

/**
 * 画像ファイルを presigned URL に PUT アップロードする
 * @param {string} uploadUrl - Presigned PUT URL
 * @param {File} file - input[type=file] から取得した画像
 * @returns {Promise<Response>} fetch のレスポンス
 */
async function uploadImageToPresignedURL(uploadUrl, file) 
{
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      // S3/GCS に Content-Type を送っておくと良い
      "Content-Type": file.type
    }
  });

  if (!res.ok) {
    throw new Error(`画像アップロードに失敗しました: ${res.status}`);
  }
  return res.json();
}