export default async function handler(req, res) {

const { url } = req.query

if (!url) {
return res.status(400).json({
success: false,
message: "حط رابط يوتيوب"
})
}

const api = `https://obito-mr-apis.vercel.app/api/download/youtube?url=${encodeURIComponent(url)}`

const response = await fetch(api)
const data = await response.json()

res.status(200).json(data)

}
