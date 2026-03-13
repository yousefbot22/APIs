import fetch from "node-fetch";

export default async function handler(req, res) {
  let { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "ضع رابط يوتيوب" });
  }

  // تنظيف الرابط من أي باراميتر إضافي
  url = url.split(/[?&]/)[0];

  try {
    const api = `https://obito-mr-apis.vercel.app/api/download/youtube?url=${encodeURIComponent(url)}`;
    const response = await fetch(api);
    const data = await response.json();

    if (!data.success || !data.qualities || data.qualities.length === 0) {
      return res.status(404).json({ success: false, message: "لم يتم العثور على الفيديو" });
    }

    // نبحث عن جودة 360p
    const video360 = data.qualities.find(q => q.format === "360p");

    if (!video360) {
      return res.status(404).json({ success: false, message: "جودة 360 غير متوفرة" });
    }

    return res.status(200).json({
      success: true,
      quality: "360p",
      title: video360.filename,
      download: video360.url
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
