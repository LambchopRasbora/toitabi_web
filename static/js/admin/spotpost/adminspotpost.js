// マーカー用変数
var marker;
// 地図用変数
var map;

//送信するタグの配列
var tags = [];

document.addEventListener("DOMContentLoaded",()=>{
    
    //地図の処理
    
    // 初期位置（例：京都駅）
    var initialLat = 34.9864338;
    var initialLng = 135.7602079;

    // 地図を生成
    map = L.map('map').setView([initialLat, initialLng], 13);

    // タイルレイヤー追加 (OSM)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    

    // 地図クリックイベント
    map.on('click', function(e) {
    var lat = e.latlng.lat.toFixed(7);
    var lng = e.latlng.lng.toFixed(7);

    // inputに値をセット
    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lng;

    // 既存マーカー削除
    if (marker) {
        map.removeLayer(marker);
    }
    // 新しいマーカーを置く
    marker = L.marker([lat, lng]).addTo(map);
    });
    
    //プレビュー処理
    
    // ファイル選択時のプレビュー処理
    document.getElementById('postingfile').addEventListener('change', function(e) {
        var preview = document.getElementById('preview');
        preview.innerHTML = ""; // 以前のプレビューをクリア
    
        var files = e.target.files;
        var maxFiles = 4; // 最大4枚まで
    
        Array.from(files).slice(0, maxFiles).forEach(file => {
        if (!file.type.match('image.*')) return;
    
        var reader = new FileReader();
        reader.onload = function(evt) {
            var img = document.createElement("img");
            img.src = evt.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
        });
    });

    // タグ入力の処理
    (function(){
    var form = document.querySelector('.postingformarea');
    var tagInput = document.getElementById('tag-input');
    var addBtn = document.getElementById('add-tag-btn');
    var tagList = document.getElementById('tag-list');
    

    function createHiddenInput(tag){
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'tags';
        input.value = tag;
        input.dataset.tagValue = tag;
        return input;
    }

    function renderTag(tag){
        var span = document.createElement('span');
        span.className = 'tag';
        span.dataset.tag = tag;
        span.textContent = tag;

        var remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'tag-remove';
        remove.textContent = '×';
        remove.addEventListener('click', function(){
        tags = tags.filter(function(t){ return t !== tag; });
        var hidden = form.querySelector('input[type="hidden"][name="tags"][data-tag-value="'+tag+'"]');
        if(hidden) hidden.remove();
        span.remove();
        });

        span.appendChild(remove);
        tagList.appendChild(span);
    }

    function addTagFromInput(){
        var v = tagInput.value.trim();
        if(!v) return;
        // allow comma-separated multiple
        var parts = v.split(',').map(function(s){ return s.trim(); }).filter(Boolean);
        parts.forEach(function(p){
            // normalize: force single leading '#'
            var norm = p.replace(/^#+/, '');
            if(!norm) return;
            norm = '#' + norm;
            if(tags.indexOf(norm) !== -1) return;
            tags.push(norm);
            form.appendChild(createHiddenInput(norm));
            renderTag(norm);
        });
        tagInput.value = '';
        tagInput.focus();
    }

    tagInput.addEventListener('keydown', function(e){
        if(e.key === 'Enter'){
        e.preventDefault();
        addTagFromInput();
        } else if(e.key === ','){
        e.preventDefault();
        addTagFromInput();
        }
    });

    addBtn.addEventListener('click', addTagFromInput);
    })();
});