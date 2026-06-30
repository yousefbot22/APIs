import fetch from "node-fetch"; // لو في Node.js القديم

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      message: "ضع رابط يوتيوب"
    });
  }

  try {
    const api = `https://obito-mr-apis.vercel.app/api/download/youtube?url=${encodeURIComponent(url)}`;
    const response = await fetch(api);
    const data = await response.json();

    if (!data.result || !data.result.video) {
      return res.status(404).json({
        success: false,
        message: "لم يتم العثور على الفيديو"
      });
    }

    // اختيار جودة 360
    let video360 = data.result.video.find(v => v.quality === "360p");

    if (!video360) {
      return res.status(404).json({
        success: false,
        message: "جودة 360 غير متوفرة"
      });
    }

    return res.status(200).json({
      success: true,
      quality: "360p",
      title: data.result.title,
      thumbnail: data.result.thumbnail,
      download: video360.url
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
