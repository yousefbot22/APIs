export default async function handler(req, res) {

const { url } = req.query

if (!url) {
return res.status(400).json({
success: false,
message: "ضع رابط يوتيوب"
})
}

try {

const api = `https://www.emam-api.web.id/home/sections/Download/api/Youtube/ymcdn?url=${encodeURIComponent(url)}`

const response = await fetch(api)
const data = await response.json()

return res.status(200).json(data)

} catch (err) {

return res.status(500).json({
success: false,
error: err.message
})

}

}
