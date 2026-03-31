export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(200).json({
      success: false,
      message: "⚠️ اكتب سؤالك في ?q="
    });
  }

  try {
    // API مجاني من Heroku
    const response = await fetch(`https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(q)}`);
    const data = await response.json();
    
    return res.status(200).json({
      success: true,
      question: q,
      reply: data.response || "❌ مفيش رد",
      author: "TOJI"
    });

  } catch (err) {
    return res.status(200).json({
      success: false,
      reply: "❌ حدث خطأ: " + err.message
    });
  }
}
