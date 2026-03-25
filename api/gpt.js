export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "⚠️ اكتب سؤالك في ?q="
    });
  }

  try {
    const api = `https://www.emam-api.web.id/home/sections/Ai/api/Gpt/turbo?q=${encodeURIComponent(q)}`;

    const response = await fetch(api);
    const data = await response.json();

    return res.status(200).json({
      success: true,
      question: q,
      reply: data.message || "❌ مفيش رد",
      author: "TOJI" // 👈 غيرناها هنا
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
