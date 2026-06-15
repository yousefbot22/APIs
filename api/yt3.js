export default async function handler(req, res) {
  const { url, type } = req.query

  if (!url || !url.includes("youtu")) {
    return res.status(400).json({ success: false, message: "حط رابط يوتيوب صحيح" })
  }

  try {
    const api = `https://www.emam-api.web.id/home/sections/Download/api/api/download?url=${encodeURIComponent(url)}`
    
    const response = await fetch(api, { headers: { "User-Agent": "Mozilla/5.0" } })
    const data = await response.json()

    if (!data.medias) return res.json({ success: false, message: "فشل جلب البيانات" })

    const audios = data.medias.filter(m => m.type === "audio")
    const videos = data.medias.filter(m => m.type === "video")

    const audioOrder = ["251", "140", "250", "249", "139"]
    let bestAudio = null
    for (const q of audioOrder) {
      bestAudio = audios.find(a => a.formatId == q)
      if (bestAudio) break
    }
    if (!bestAudio) bestAudio = audios[0]

    let bestVideo = videos.find(v => v.formatId == "18") || videos[0]

    // 🔥 لو type=stream يحمل ويبعت الملف مباشرة
    if (type === "stream") {
      const targetUrl = req.query.audio === "false" ? bestVideo.url : bestAudio.url
      const fileRes = await fetch(targetUrl)
      if (!fileRes.ok) return res.status(403).json({ success: false, message: "فشل تحميل الملف" })

      const contentType = req.query.audio === "false" ? "video/mp4" : "audio/webm"
      res.setHeader("Content-Type", contentType)
      res.setHeader("Content-Disposition", `attachment; filename="file"`)

      // pipe الملف مباشرة للمستخدم
      const { Readable } = await import("stream")
      Readable.fromWeb(fileRes.body).pipe(res)
      return
    }

    if (type === "audio") {
      return res.json({ success: true, title: data.title, thumbnail: data.thumbnail, download: bestAudio.url })
    }

    if (type === "video") {
      return res.json({ success: true, title: data.title, thumbnail: data.thumbnail, download: bestVideo.url })
    }

    return res.json({
      success: true,
      title: data.title,
      thumbnail: data.thumbnail,
      audio: bestAudio.url,
      video: bestVideo.url
    })

  } catch (err) {
    return res.status(500).json({ success: false, message: "حصل خطأ", error: err.message })
  }
}    }
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
