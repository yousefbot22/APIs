export default async function handler(req, res) {
  const { q } = req.query;  // السؤال من ?q=

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "⚠️ اكتب سؤالك في ?q=",
      example: "/api/blackbox?q=مرحبا"
    });
  }

  try {
    // Blackbox يعمل بـ POST وليس GET
    const blackboxUrl = "https://www.blackbox.ai/api/chat";
    
    const response = await fetch(blackboxUrl, {
      method: 'POST',
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36",
        "Content-Type": "application/json",
        "origin": "https://www.blackbox.ai"
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: q }],
        maxTokens: 2048,
        userSelectedAgent: "VscodeAgent",
        validated: "a38f5889-8fef-46d4-8ede-bf4668b6a9bb",
        mobileClient: true
      })
    });
    
    let reply = await response.text();
    
    // تنظيف الرد
    const thinkMatch = reply.match(/<think>(.*?)<\/think>/s);
    if (thinkMatch) {
      reply = reply.replace(thinkMatch[0], "").trim();
    }
    
    reply = reply.replace(/\\n/g, '\n').trim();

    return res.status(200).json({
      success: true,
      question: q,
      reply: reply || "❌ مفيش رد",
      author: "TOJI"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
