export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "⚠️ اكتب سؤالك في ?q="
    });
  }

  try {
    // إرسال السؤال مباشرة للـ API بدون برومت
    const api = `https://obito-mr-apis.vercel.app/api/ai/writecream?prompt?q=${encodeURIComponent(q)}`;

    const response = await fetch(api);
    const data = await response.json();

    return res.status(200).json({
      success: true,
      question: q,
      reply: data.reply || "❌ مفيش رد"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
