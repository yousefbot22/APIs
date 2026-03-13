import fetch from "node-fetch";

export default async function handler(req, res) {
  let { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "ضع رابط يوتيوب" });
  }

  // تنظيف الرابط من أي باراميتر إضافي مثل ?si=
  url = url.split(/[?&]/)[0];

  try {
    // نستخدم API خارجي موثوق
    const api = `https://obito-mr-apis.vercel.app/api/download/youtube?url=${encodeURIComponent(url)}`;
    const response = await fetch(api);
    const data = await response.json();

    if (!data.success || !data.qualities || data.qualities.length === 0) {
      return res.status(404).json({ success: false, message: "لم يتم العثور على الفيديو" });
    }

    // نهيأ الرد لكل الجودات
    const qualities = data.qualities.map(q => ({
      format: q.format,      // 128k, 144p, 360p, 720p…
      filename: q.filename,  // اسم الملف
      download: q.url        // رابط التحميل المباشر
    }));

    return res.status(200).json({
      success: true,
      title: data.qualities[0].filename,
      thumbnail: data.result?.thumbnail || null,
      qualities
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
