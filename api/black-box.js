// ملف: pages/api/blackbox.js
export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "⚠️ اكتب سؤالك في ?q="
    });
  }

  try {
    const blackboxUrl = "https://www.blackbox.ai/api/chat";
    
    // نفس الجسم الذي يرسله الموقع الأصلي
    const requestBody = {
      id: null,
      previewToken: null,
      userId: null,
      codeModelMode: true,
      trendingAgentMode: {},
      isMicMode: false,
      userSystemPrompt: null,
      maxTokens: 1024,
      playgroundTopP: null,
      playgroundTemperature: null,
      isChromeExt: false,
      githubToken: "",
      clickedAnswer2: false,
      clickedAnswer3: false,
      clickedForceWebSearch: false,
      visitFromDelta: false,
      isMemoryEnabled: false,
      mobileClient: false,
      userSelectedModel: null,
      userSelectedAgent: "VscodeAgent",
      validated: "a38f5889-8fef-46d4-8ede-bf4668b6a9bb",
      imageGenerationMode: false,
      imageGenMode: "autoMode",
      webSearchModePrompt: false,
      deepSearchMode: false,
      promptSelection: "",
      domains: null,
      vscodeClient: false,
      codeInterpreterMode: false,
      customProfile: {
        name: "",
        occupation: "",
        traits: [],
        additionalInfo: "",
        enableNewChats: false
      },
      webSearchModeOption: {
        autoMode: true,
        webMode: false,
        offlineMode: false
      },
      session: null,
      isPremium: false,
      teamAccount: "",
      subscriptionCache: null,
      beastMode: false,
      reasoningMode: false,
      designerMode: false,
      workspaceId: "",
      asyncMode: false,
      integrations: {},
      isTaskPersistent: false,
      selectedElement: null,
      messages: [{
        role: "user",
        content: q,
        id: Date.now().toString()
      }]
    };
    
    const response = await fetch(blackboxUrl, {
      method: 'POST',
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        "Content-Type": "application/json",
        "Accept": "text/event-stream, application/json",
        "Origin": "https://www.blackbox.ai",
        "Referer": "https://www.blackbox.ai/",
        "Accept-Language": "ar,en-US;q=0.9,en;q=0.8"
      },
      body: JSON.stringify(requestBody)
    });
    
    // قراءة الرد (قد يكون text/event-stream)
    let reply = await response.text();
    
    // تنظيف الرد من بيانات التدفق
    reply = reply
      .split('\n')
      .filter(line => line.startsWith('data: '))
      .map(line => line.replace('data: ', ''))
      .filter(line => line !== '[DONE]')
      .join('\n');
    
    // محاولة استخراج النص من JSON
    try {
      const parsed = JSON.parse(reply);
      reply = parsed.message || parsed.text || parsed.response || reply;
    } catch (e) {
      // إذا لم يكن JSON، استخدم النص كله
    }
    
    // تنظيف إضافي
    reply = reply
      .replace(/<think>[\s\S]*?<\/think>/g, '')
      .replace(/\\n/g, '\n')
      .trim();
    
    if (!reply || reply.includes('error') || reply.includes('Authentication')) {
      return res.status(200).json({
        success: true,
        question: q,
        reply: "❌ عذراً، لم أستطع الإجابة حالياً. حاول مرة أخرى.",
        author: "TOJI"
      });
    }

    return res.status(200).json({
      success: true,
      question: q,
      reply: reply,
      author: "TOJI"
    });

  } catch (err) {
    console.error('Blackbox Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
