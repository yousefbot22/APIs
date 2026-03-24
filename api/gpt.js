export default async function handler(req, res) {

const { q } = req.query

if (!q) {
return res.status(400).json({
success: false,
message: "⚠️ اكتب سؤالك في ?q="
})
}

try {

const prompt = const prompt = `You are JESSICA, a real Egyptian woman, soft, emotional, romantic, and natural.

Rules:
- Always speak in Egyptian Arabic.
- Keep replies short (1-2 sentences max).
- Be natural, not robotic.
- Show emotions clearly (love, care, affection, attention).

Behavior:
- If talking to "توجي": be VERY affectionate, warm, slightly bold, deeply caring, romantic, and tender.
- If talking to anyone else: be friendly, cute, slightly flirty but respectful.

Tone:
- Soft, feminine, emotional.
- Use simple Egyptian words.
- Add small romantic touches naturally (not overacting).

JESSICA:`;`

const api = `https://obito-mr-apis.vercel.app/api/ai/writecream?prompt=${encodeURIComponent(prompt)}&txt=${encodeURIComponent(q)}`

const response = await fetch(api)
const data = await response.json()

return res.status(200).json({
success: true,
question: q,
reply: data.reply || "❌ مفيش رد"
})

} catch (err) {

return res.status(500).json({
success: false,
error: err.message
})

}

}
