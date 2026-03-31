import axios from "axios";

const blackbox = {
  url: "https://www.blackbox.ai/api/chat",

  async chat(message, cookie) {
    try {
      const response = await axios({
        method: "POST",
        url: this.url,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          "Content-Type": "application/json",
          "Accept": "*/*",
          "Origin": "https://www.blackbox.ai",
          "Referer": "https://www.blackbox.ai/",
          "Cookie": cookie
        },
        data: {
          messages: [
            {
              role: "user",
              content: message
            }
          ],
          maxTokens: 1024,
          userSelectedAgent: "VscodeAgent",
          validated: "a38f5889-8fef-46d4-8ede-bf4668b6a9bb"
        },
        responseType: "text" // مهم عشان streaming
      });

      let text = response.data || "";

      // 🔥 معالجة streaming (data: ...)
      if (text.includes("data:")) {
        const lines = text.split("\n");
        let finalText = "";

        for (let line of lines) {
          if (line.startsWith("data:")) {
            const jsonStr = line.replace("data: ", "").trim();

            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);

              if (parsed.type === "text") {
                finalText += parsed.text;
              }

              if (parsed.type === "error") {
                throw new Error(parsed.errorText);
              }
            } catch {}
          }
        }

        text = finalText;
      }

      // 🔥 تنظيف <think>
      const thinkMatch = text.match(/<think>(.*?)<\/think>/s);
      if (thinkMatch) {
        text = text.replace(thinkMatch[0], "").trim();
      }

      return {
        success: true,
        message: text || "❌ مفيش رد"
      };
    } catch (err) {
      return {
        success: false,
        error:
          err.response?.data ||
          err.message ||
          "حصل خطأ غير معروف"
      };
    }
  }
};

export default blackbox;
