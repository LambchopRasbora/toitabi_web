
export function insertCameraImage(videoCom)
{
    navigator.mediaDevices.getUserMedia({video:true})
    .then(stream=>{
        videoCom.srcObject=stream;
    })
    .catch(err=>{
        console.error("カメラにアクセスできません",err);
    })
}