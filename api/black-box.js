import axios from "axios";

export default async function handler(req, res) {
  const q = req.query.q;

  if (!q) {
    return res.status(200).json({
      success: false,
      message: "اكتب سؤالك في ?q="
    });
  }

  // 🔥 الكوكي جاهز
  const COOKIE = `next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiLWpRZ2lSMW5xQzN1a3A1NWRNeXk4bERUdDJRSGFSclhzR28yXzJxOWNGd0NtaWN0RGtZOEdfYm40WjhZUjRFN0QxRVZvR19DSm5mSEtHeGFkNmdrX2cifQ..OLd-DJWtjXMNDGXn-nahEw.Yl5frPJNxAwf6EfPhAy_BASlk-9obKhnBVxrRfy7DtNSX5c0vkt_t_maVHw01VU4xpF3XszbomyIgMflIrmdhNKNrt2ct1CjxuE2b5DzJfB9lx11AiUPHTj0pN1sGfQxnlbGLS8X0DfpSoL2YsELbxBrkCQnQ5kN47JxKbynOkMR2x4aZ9QnAL5b_Mm5gM7Qjq32LpDNOidt3qn96PkHDp1_RdzPiEiWN9i_kuot24_nARuWO3XZMhe_ZXo47Vtwx0e534H3EX7EKji5DOT_-SZJODtQpnl3v8JcmkBnRA-3XGBMbzywvQPLqJYpQTJkfSydLLW2DtZicTlrTVZbKWgB28-S72LcWWpJteYayYpU9ieCSRq3nSg7L6shDJC2icVGTA2PL8p941W8tsf-5HwWmVWTSwqEKirS_frU5COz-LYrwvsNeoKhsN9Nc9jhAp76I6PUehvzzAj-qQEDvnFuPWtjvWAIvdbLDFwNo_oPLEqVWsEx9jEXvLN_0r5E5q4UreW-4qU18lFF8QTnMTpNFbyeyoQk2EKnSrM0Mwtj2Ea6IRegtUew-YBM5C_qoTB7EtsEGqfXORLh7eT71HIxCL6tPnKtp3pbo7NKkX8.ynnwb-5jYKZchjEftNOb5ey53h5Pd1_dsFELnUOHD2w; intercom-session-x55eda6t=b0RNbEU3YnR6WjkrQ2xYdVN5dVJIR2d3U0NBZzY5YXZMZzRYdlVpN1VMbkRGcXd6ak5QZFZuYWtaem8vdXhFSi9udjZRSkRsSllMOW1oSVZhWlYxLzJmVFdiSGlPSTdBOHQ0QmRLMm55QlQxS1J6S0xGQlU5SUltRHBOZ3lRc0F2QUNUMmxCMGlZNzY4QlJlcVQzbU5XaW1xdEI2SENzWHVZKzhZSzhScDZjOUV6aFNOSEtQZmxNK2hjbEtzUTBzM0V2UXlidUtpbHBYaktxVkthSlY0Zz09LS1MOEtUQzBOcFRjdm82cHFjcCt6RGV3PT0=--aaaf0d52b62f706f57f0cd29c680861fc10daacc; sessionId=d464fb52-1688-4675-81cd-1ae902fd88e6;`;

  try {
    const response = await axios.post(
      "https://www.blackbox.ai/api/chat",
      {
        messages: [{ role: "user", content: q }],
        maxTokens: 1024,
        userSelectedAgent: "VscodeAgent",
        validated: "a38f5889-8fef-46d4-8ede-bf4668b6a9bb"
      },
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "text/event-stream",
          "Content-Type": "application/json",
          "Origin": "https://www.blackbox.ai",
          "Referer": "https://www.blackbox.ai/",
          "Cookie": COOKIE
        },
        timeout: 10000,
        responseType: "text"
      }
    );

    let text = response.data || "";

    // 🔥 parse streaming
    if (text.includes("data:")) {
      let final = "";

      text.split("\n").forEach(line => {
        if (line.startsWith("data:")) {
          const jsonStr = line.replace("data: ", "").trim();
          if (jsonStr === "[DONE]") return;

          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.type === "text") final += parsed.text;
            if (parsed.type === "error") throw new Error(parsed.errorText);
          } catch {}
        }
      });

      text = final;
    }

    // 🧹 تنظيف <think>
    const thinkMatch = text.match(/<think>(.*?)<\/think>/s);
    if (thinkMatch) {
      text = text.replace(thinkMatch[0], "").trim();
    }

    if (!text || text.length < 2) {
      return res.status(200).json({
        success: false,
        reply: "❌ مفيش رد "
      });
    }

    return res.status(200).json({
      success: true,
      question: q,
      reply: text,
      author: "TOJI"
    });

  } catch (err) {
    return res.status(200).json({
      success: false,
      error: "❌ حصل خطأ",
      details: err.message
    });
  }
}
