
export async function snsShare(score, time, dist)
{
    // 共有テキストを組み立て
      const text  = `#トイタビ をゴール！ スコア ${score} 点｜時間 ${time}｜距離 ${dist}`;

      const shareUrl = location.href; 

      // 1) Web Share API（iOS/Androidのブラウザで動作）
      if (navigator.share) {
        try 
        {
          await navigator.share({ title: "トイタビ", text, url: shareUrl });
          return;
        } 
        catch (_) 
        {
            //共有失敗の場合alertで通知
            alert("共有に失敗しました。");
            return;
        }
      }

      // 2) X（Twitter）intent
      const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(xUrl, "_blank", "noopener,noreferrer");

      // 3) Instagram はURLテキスト共有の公式エンドポイントがないため、
      //    画像投稿やストーリーズ共有はアプリ連携が必要。
      //    ここではXにフォールバックした上で、必要ならトースト表示などで
      //    「Instagramは画像共有のみ対応」と案内すると良いです。
}