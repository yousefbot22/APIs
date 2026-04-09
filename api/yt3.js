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

    // ✅ التحقق من وجود رابط التحميل
    if (!data.status || !data.data?.url) {
      return res.status(500).json({
        success: false,
        author: "TOJI",
        message: "فشل الحصول على رابط الصوت من المصدر",
        error: "رابط الصوت غير موجود"
      })
    }

    // ✅ الرد النهائي
    return res.status(200).json({
      ...data,
      author: "TOJI"
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
