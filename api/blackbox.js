// ملف: pages/api/blackbox.js
export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(200).json({
      success: false,
      message: "⚠️ اكتب سؤالك في ?q="
    });
  }

  try {
    // استخدام API بديل مجاني ومستقر
    const apiUrl = `https://api.dreaded.site/api/chatgpt?text=${encodeURIComponent(q)}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    return res.status(200).json({
      success: true,
      question: q,
      reply: data.response || data.message || data.result || "❌ مفيش رد",
      author: "TOJI"
    });

  } catch (err) {
    // محاولة API بديل ثانٍ
    try {
      const backupUrl = `https://api.ryzendesu.vip/api/ai/chatgpt?text=${encodeURIComponent(q)}`;
      const backupRes = await fetch(backupUrl);
      const backupData = await backupRes.json();
      
      return res.status(200).json({
        success: true,
        question: q,
        reply: backupData.result || backupData.message || "❌ مفيش رد",
        author: "TOJI"
      });
    } catch (err2) {
      return res.status(200).json({
        success: false,
        error: err2.message,
        reply: "❌ حدث خطأ، حاول مرة أخرى"
      });
    }
  }
}
