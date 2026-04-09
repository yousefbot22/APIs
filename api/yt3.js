export default async function handler(req, res) {

  const { url } = req.query

  // ✅ التحقق من الرابط
  if (!url || !url.includes("youtu")) {
    return res.status(400).json({
      success: false,
      author: "TOJI",
      message: "ضع رابط يوتيوب صالح"
    })
  }

  try {

    const api = `https://www.emam-api.web.id/home/sections/Download/api/api/download?url=${encodeURIComponent(url)}`
    const response = await fetch(api)

    let data
    try {
      data = await response.json()
    } catch (e) {
      return res.status(500).json({
        success: false,
        author: "TOJI",
        message: "حدث خطأ أثناء التحميل",
        error: "البيانات التي رجعت من المصدر ليست JSON صالح"
      })
    }

    // ✅ التحقق من وجود البيانات
    if (!data.status || !data.data?.medias || data.data.medias.length === 0) {
      return res.status(500).json({
        success: false,
        author: "TOJI",
        message: "فشل الحصول على الصوت من المصدر",
        error: "لا توجد وسائط متاحة"
      })
    }

    // ✅ البحث عن أفضل جودة صوت
    let audioUrl = null
    let selectedFormat = null
    
    // ترتيب الجودة (الأفضل أولاً)
    const qualityOrder = ['251', '140', '250', '249', '139']
    
    for (const quality of qualityOrder) {
      const found = data.data.medias.find(m => m.formatId === quality && m.type === 'audio')
      if (found) {
        audioUrl = found.url
        selectedFormat = found
        break
      }
    }
    
    // إذا لم يجد، خذ أول audio موجود
    if (!audioUrl) {
      const firstAudio = data.data.medias.find(m => m.type === 'audio')
      if (firstAudio) {
        audioUrl = firstAudio.url
        selectedFormat = firstAudio
      }
    }
    
    if (!audioUrl) {
      return res.status(500).json({
        success: false,
        author: "TOJI",
        message: "فشل الحصول على رابط الصوت",
        error: "لا يوجد رابط صوت متاح"
      })
    }

    // ✅ الرد النهائي مع رابط الصوت
    return res.status(200).json({
      success: true,
      author: "TOJI",
      title: data.data.title,
      thumbnail: data.data.thumbnail,
      duration: data.data.duration,
      audio: {
        url: audioUrl,
        quality: selectedFormat.label || selectedFormat.formatId,
        extension: selectedFormat.ext,
        bitrate: selectedFormat.bitrate
      }
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      author: "TOJI",
      message: "حدث خطأ أثناء التحميل",
      error: err.message
    })
  }
}
