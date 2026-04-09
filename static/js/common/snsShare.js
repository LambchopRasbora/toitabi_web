
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
}