import axios from "axios";

export default async function handler(req, res) {
  // السماح بـ CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { q } = req.query;

  if (!q) {
    return res.status(200).json({
      success: false,
      message: "⚠️ اكتب سؤالك في ?q=",
      example: "/api/blackbox?q=مرحبا"
    });
  }

  try {
    // استخدام validated token ثابت (بدون كوكيز)
    const requestBody = {
      messages: [{ 
        role: "user", 
        content: q,
        id: Date.now().toString() 
      }],
      maxTokens: 1024,
      userSelectedAgent: "VscodeAgent",
      validated: "a38f5889-8fef-46d4-8ede-bf4668b6a9bb",
      mobileClient: true,
      codeModelMode: true,
      isChromeExt: false,
      clickedAnswer2: false,
      clickedAnswer3: false,
      clickedForceWebSearch: false,
      visitFromDelta: false,
      isMemoryEnabled: false,
      userSystemPrompt: null,
      playgroundTopP: null,
      playgroundTemperature: null
    };
    
    const response = await axios.post(
      "https://www.blackbox.ai/api/chat",
      requestBody,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
          "Accept": "text/event-stream, application/json, text/plain, */*",
          "Accept-Language": "ar,en-US;q=0.9,en;q=0.8",
          "Content-Type": "application/json",
          "Origin": "https://www.blackbox.ai",
          "Referer": "https://www.blackbox.ai/",
          "Sec-Ch-Ua": '"Chromium";v="116", "Not)A;Brand";v="24"',
          "Sec-Ch-Ua-Mobile": "?1",
          "Sec-Ch-Ua-Platform": "Android",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site"
        },
        timeout: 30000,
        responseType: "text"
      }
    );

    let text = response.data || "";
    
    // معالجة الرد المتدفق
    let finalText = "";
    
    if (text.includes("data:")) {
      const lines = text.split("\n");
      
      for (const line of lines) {
        if (line.startsWith("data: ") && !line.includes("[DONE]")) {
          const jsonStr = line.replace("data: ", "").trim();
          
          if (jsonStr && jsonStr !== "[DONE]") {
            try {
              const parsed = JSON.parse(jsonStr);
              
              // أنواع مختلفة من الردود
              if (parsed.type === "text" && parsed.text) {
                finalText += parsed.text;
              } else if (parsed.message) {
                finalText += parsed.message;
              } else if (parsed.response) {
                finalText += parsed.response;
              } else if (typeof parsed === "string") {
                finalText += parsed;
              } else if (parsed.content) {
                finalText += parsed.content;
              }
            } catch (e) {
              // إذا لم يكن JSON، أضف النص كما هو
              if (jsonStr && !jsonStr.includes("error")) {
                finalText += jsonStr;
              }
            }
          }
        }
      }
      
      text = finalText || text;
    }
    
    // تنظيف النص من علامات think
    if (text.includes("<think>")) {
      text = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
    }
    
    // تنظيف النص من الأحرف الخاصة
    text = text
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .trim();
    
    // التحقق من وجود رد فعلي
    if (!text || text.length < 2 || text.includes("error") || text.includes("Authentication")) {
      return res.status(200).json({
        success: false,
        question: q,
        reply: "❌ عذراً، لم أستطع الإجابة حالياً. حاول مرة أخرى.",
        author: "TOJI"
      });
    }

    return res.status(200).json({
      success: true,
      question: q,
      reply: text,
      author: "TOJI",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Blackbox API Error:", error.message);
    
    return res.status(200).json({
      success: false,
      question: q,
      reply: "❌ حدث خطأ في الاتصال. حاول مرة أخرى.",
      error: error.message,
      author: "TOJI"
    });
  }
}
