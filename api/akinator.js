// pages/api/akinator.js
export default async function handler(req, res) {
  const { action, session, signature, step, answer } = req.query;

  try {
    //  بدء اللعبة
    if (action === "start") {
      const api = `https://obito-mr-apis.vercel.app/api/game/akinator_start?lang=ar`;
      const response = await fetch(api);
      const data = await response.json();
      return res.status(200).json(data.data);
    }

    // 2️⃣ إرسال إجابة
    if (action === "answer") {
      if (!session || !signature || !step || answer === undefined) {
        return res.status(400).json({ success: false, message: "بيانات ناقصة" });
      }

      const api = `https://obito-mr-apis.vercel.app/api/game/akinator_answer?session=${session}&signature=${signature}&step=${step}&answer=${answer}`;
      const response = await fetch(api);
      const data = await response.json();
      return res.status(200).json(data.data);
    }

    return res.status(400).json({ success: false, message: "حدد action=start أو action=answer" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
