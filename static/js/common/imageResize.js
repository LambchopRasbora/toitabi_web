
/**
 * 画像を指定したサイズにリサイズする（画面への追加なし）
 * @param {File} file - input type="file" から取得したファイル
 * @param {Object} options - maxWidth, maxHeight, quality
 * @returns {Promise<Blob>} - リサイズ後のBlobオブジェクト
 */

export async function resizeImage(file, { maxWidth = 1280, maxHeight = 1280, quality = 0.8, contenttype = 'image/jpeg' } = {}) 
{
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        //ファイルリーダーが画像を読み込んだ際にImageにURLをセット
        reader.onload = (e) => {
            img.src = e.target.result;
        };

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx=canvas.getContext('2d');

            let width = img.width;
            let height = img.height;

            //画像のアスペクト比を保ちながらリサイズ
            if (width > height) 
            {
                if (width > maxWidth)
                {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } 
            else 
            {
                if (height > maxHeight) 
                {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error('画像のリサイズに失敗しました'));
            }, contenttype, quality);
        };

        img.onerror = e=>reject(new Error('画像の読み込みに失敗しました'));

        reader.onerror = e=>reject(new Error('ファイルの読み込みに失敗しました'));

        reader.readAsDataURL(file);
    });
}