
export function mapInitialize(mapContainer)
{
    if(!L)throw new Error("Leafletが読み込まれていません");

    
    const map=L.map(mapContainer,{zoomControl:false,maxZoom:21}) //地図上のズームコントロールを消す
        .setView([34.985458, 135.757756], 13); // 京都駅の座標を初期表示

    //openstreetmapのタイルレイヤーを追加
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom:21,
        maxNativeZoom:19
    }).addTo(map);

    return map;
}