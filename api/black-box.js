import axios from "axios";

const blackbox = {
  url: "https://www.blackbox.ai/api/chat",

  async chat(message, cookie) {
    try {
      const res = await axios.post(
        this.url,
        {
          messages: [{ role: "user", content: message }],
          maxTokens: 1024,
          userSelectedAgent: "VscodeAgent",
          validated: "a38f5889-8fef-46d4-8ede-bf4668b6a9bb"
        },
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
            "Accept": "text/event-stream",
            "Content-Type": "application/json",
            "Origin": "https://www.blackbox.ai",
            "Referer": "https://www.blackbox.ai/",
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "cors",
            "sec-fetch-dest": "empty",
            "Cookie": cookie
          },
          responseType: "text"
        }
      );

      let text = res.data || "";

      // لو مفيش رد
      if (!text || text.length < 5) {
        return {
          success: false,
          error: "❌ مفيش رد (غالباً الكوكي انتهى)"
        };
      }

      // معالجة streaming
      if (text.includes("data:")) {
        let final = "";

        text.split("\n").forEach(line => {
          if (line.startsWith("data:")) {
            let json = line.replace("data: ", "");

            if (json === "[DONE]") return;

            try {
              let parsed = JSON.parse(json);

              if (parsed.type === "text") {
                final += parsed.text;
              }

              if (parsed.type === "error") {
                throw new Error(parsed.errorText);
              }
            } catch {}
          }
        });

        text = final;
      }

      // fallback لو فاضي
      if (!text.trim()) {
        return {
          success: false,
          error: "❌ Blackbox رفض الطلب (جدد الكوكي)"
        };
      }

      return {
        success: true,
        message: text
      };

    } catch (err) {
      return {
        success: false,
        error: err.message || "❌ حصل خطأ"
      };
    }
  }
};

export default blackbox;
