
export default async function handler(req, res) {
  const { url, type } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      message: "حط رابط يوتيوب صحيح"
    });
  }

  try {
    const api =
      `https://www.emam-api.web.id/home/sections/Download/api/api/download?url=${encodeURIComponent(url)}`;

    const response = await fetch(api, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.medias || !Array.isArray(data.medias)) {
      return res.status(502).json({
        success: false,
        message: "فشل جلب البيانات"
      });
    }

    const audios = data.medias.filter(
      m => m.type === "audio" && m.url
    );

    const videos = data.medias.filter(
      m => m.type === "video" && m.url
    );

    // اختيار أفضل صوت
    const audioOrder = ["251", "140", "250", "249", "139"];

    let bestAudio = null;

    for (const q of audioOrder) {
      bestAudio = audios.find(
        a => String(a.formatId) === q
      );

      if (bestAudio) break;
    }

    if (!bestAudio) bestAudio = audios[0];

    // اختيار أفضل فيديو
    const bestVideo =
      videos.find(v => String(v.formatId) === "18") ||
      videos[0];

    // التحقق من الملفات
    if (
      (type === "audio" || type === "stream-audio") &&
      !bestAudio
    ) {
      return res.status(404).json({
        success: false,
        message: "الصوت غير متاح"
      });
    }

    if (
      (type === "video" || type === "stream-video") &&
      !bestVideo
    ) {
      return res.status(404).json({
        success: false,
        message: "الفيديو غير متاح"
      });
    }

    // رابط الصوت
    if (type === "audio") {
      return res.status(200).json({
        success: true,
        title: data.title,
        thumbnail: data.thumbnail,
        download: bestAudio.url
      });
    }

    // رابط الفيديو
    if (type === "video") {
      return res.status(200).json({
        success: true,
        title: data.title,
        thumbnail: data.thumbnail,
        download: bestVideo.url
      });
    }

    // تحميل الصوت
    if (type === "stream-audio") {
      const fileRes = await fetch(bestAudio.url);

      if (!fileRes.ok) {
        return res.status(502).json({
          success: false,
          message: "فشل تحميل الصوت"
        });
      }

      const buffer = Buffer.from(
        await fileRes.arrayBuffer()
      );

      res.setHeader("Content-Type", "audio/webm");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="audio.webm"'
      );

      return res.status(200).send(buffer);
    }

    // تحميل الفيديو
    if (type === "stream-video") {
      const fileRes = await fetch(bestVideo.url);

      if (!fileRes.ok) {
        return res.status(502).json({
          success: false,
          message: "فشل تحميل الفيديو"
        });
      }

      const buffer = Buffer.from(
        await fileRes.arrayBuffer()
      );

      res.setHeader("Content-Type", "video/mp4");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="video.mp4"'
      );

      return res.status(200).send(buffer);
    }

    // البيانات الافتراضية
    return res.status(200).json({
      success: true,
      title: data.title,
      thumbnail: data.thumbnail,
      audio: bestAudio?.url || null,
      video: bestVideo?.url || null
    });

  } catch (err) {
    console.error("YouTube API Error:", err);

    return res.status(500).json({
      success: false,
      message: "حصل خطأ",
      error: err.message
    });
  }
}
