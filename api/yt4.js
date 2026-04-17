export default async function handler(req, res) {
  const { url, type } = req.query

  if (!url || !url.includes("youtu")) {
    return res.status(400).json({
      success: false,
      message: "حط رابط يوتيوب صحيح"
    })
  }

  try {
    const api = `https://www.emam-api.web.id/home/sections/Download/api/api/download?url=${encodeURIComponent(url)}`
    
    const response = await fetch(api, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    })

    const data = await response.json()

    if (!data.medias) {
      return res.json({ success: false, message: "فشل جلب البيانات" })
    }

    // 🎧 فلترة الصوت
    const audios = data.medias.filter(m => m.type === "audio")
    const videos = data.medias.filter(m => m.type === "video")

    // ترتيب الجودة
    const audioOrder = ["251", "140", "250", "249", "139"]

    let bestAudio = null
    for (const q of audioOrder) {
      bestAudio = audios.find(a => a.formatId == q)
      if (bestAudio) break
    }
    if (!bestAudio) bestAudio = audios[0]

    // 🎥 أفضل فيديو (720 أو أقل عشان الحجم)
    let bestVideo = videos.find(v => v.formatId == "18") || videos[0]

    // 🔥 اختيار النوع
    if (type === "audio") {
      return res.json({
        success: true,
        title: data.title,
        thumbnail: data.thumbnail,
        download: bestAudio.url
      })
    }

    if (type === "video") {
      return res.json({
        success: true,
        title: data.title,
        thumbnail: data.thumbnail,
        download: bestVideo.url
      })
    }

    // 🎬 تشغيل (preview)
    return res.json({
      success: true,
      title: data.title,
      thumbnail: data.thumbnail,
      audio: bestAudio.url,
      video: bestVideo.url
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "حصل خطأ",
      error: err.message
    })
  }
}
