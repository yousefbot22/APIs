import fetch from "node-fetch"

export default async function handler(req, res) {

const { url, quality } = req.query

if (!url) {
return res.status(400).json({
success:false,
message:"ضع رابط يوتيوب"
})
}

try {

const api = `https://obito-mr-apis.vercel.app/api/download/youtube?url=${encodeURIComponent(url)}`
const response = await fetch(api)
const data = await response.json()

if (!data.success || !data.qualities) {
return res.status(404).json({
success:false,
message:"لم يتم العثور على الفيديو"
})
}

// لو طلب جودة محددة
if (quality) {

const video = data.qualities.find(v => v.format === quality)

if (!video) {
return res.status(404).json({
success:false,
message:"الجودة غير متوفرة"
})
}

return res.status(200).json({
success:true,
quality:quality,
url:video.url
})

}

// لو لم يحدد جودة
return res.status(200).json({
success:true,
thumbnail:data.thumbnail,
qualities:data.qualities
})

} catch(err){

return res.status(500).json({
success:false,
error:err.message
})

}

}
