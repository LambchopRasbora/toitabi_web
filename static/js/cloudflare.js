export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ===== CORS preflight =====
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // ===== PUT: 画像アップロード =====
    if (request.method === "PUT" && url.pathname === "/toitabi-test-image/upload") {

      // 1. Content-Type を取得
      const contentType = request.headers.get("content-type") || "application/octet-stream";

      // 2. MIME → 拡張子判定
      const ext = mimeToExt(contentType);

      // 3. 拡張子付きファイル名作成
      const key = crypto.randomUUID() + ext;

      // 4. R2 に保存
      await env.storage1.put(key, request.body, {
        httpMetadata: { contentType },
      });

      // 5. 公開 URL（あなたの GET ルートに合わせる）
      const publicUrl = `${url.origin}/toitabi-test-image/${key}`;

      return new Response(JSON.stringify({ key, url: publicUrl }), {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }

    // ===== GET: 画像読み出し =====
    if (url.pathname.startsWith("/toitabi-test-image/")) {
      const key = url.pathname.replace(/^\/toitabi-test-image\//, "");

      const object = await env.storage1.get(key);

      if (object === null) {
        return new Response("Not Found", { status: 404 });
      }

      return new Response(object.body, {
        headers: {
          "content-type": object.httpMetadata?.contentType || "application/octet-stream",
          "cache-control": "public, max-age=31536000, immutable",
          "Access-Control-Allow-Origin": "*", // ← GET にもCORS入れておく
        },
      });
    }

    return new Response("Invalid path", { status: 400 });
  },
};


// ===== MIME → 拡張子判別関数 =====
function mimeToExt(mime) {
  const map = {
    "image/png": ".png",
    "image/jpeg": ".jpg",  // jpeg → .jpg
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
  };
  return map[mime] || ""; // 不明な場合拡張子なし
}