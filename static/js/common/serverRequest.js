
//データとともにURLへPOST、画面遷移まで行う
export function postJsonAndmove(url,data)
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

export function postForm(url,formdata)
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
export function GetparamURL(url,dto)
{
    const param=new URLSearchParams(dto);
    return `${url}?${param.toString()}`;
}

//Getリクエストを行うパラメータを含んだURLを返却する
export function GetListparamURL(url,list)
{
    const param=new URLSearchParams();
    list.forEach(element => {
     param.append("fileNames",element);
    });
    return `${url}?${param.toString()}`;
}

export async function post(path, params, method='post') 
{
  var formData = new FormData();
  
  //フォームデータにパラメータを追加
  for (const key in params) {
    if (!params.hasOwnProperty(key)) continue;

    const value = params[key];

    // 配列
    if(value===null || value === undefined)
    {
      continue;
    }
    else if (Array.isArray(value)) {
      value.forEach(v => formData.append(key, v));
    }
    // ファイル（File or Blob）
    else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    }
    // 通常値
    else {
      formData.append(key, value);
    }
  }

  // ===== CSRF 追加 =====
  const csrfToken = document.querySelector('meta[name="_csrf"]').content;
  const csrfParam = document.querySelector('meta[name="_csrf_parameter"]').content;

  formData.append(csrfParam, csrfToken);

  //送信
  const response= await fetch(path,{
    method: method.toUpperCase(),
    body:formData
  });

  //遷移処理
  if (response.redirected) {
    // サーバーがリダイレクトした場合
    window.location.href = response.url;
  } else if (response.ok) {
    // 正常終了（リダイレクトなし）
    window.location.href = "/success";
  } else {
    // エラー
    alert("送信に失敗しました");
  }
}

/**
 * 画像ファイルを presigned URL に PUT アップロードする
 * @param {string} uploadUrl - Presigned PUT URL
 * @param {File} file - input[type=file] から取得した画像
 * @returns {Promise<Response>} fetch のレスポンス
 */
export async function uploadImageToPresignedURL(uploadUrl, file) 
{
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type
    }
  });

  if (!response.ok) {
    throw new Error(`画像アップロードに失敗しました: ${response.status}`);
  }
  return response.json();
}