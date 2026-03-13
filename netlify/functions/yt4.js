export async function handler(event) {

const params = event.queryStringParameters
const url = params.url

if (!url) {
return {
statusCode: 400,
body: JSON.stringify({
success: false,
message: "ضع رابط يوتيوب"
})
}
}

try {

const api = `https://obito-mr-apis.vercel.app/api/download/youtube?url=${encodeURIComponent(url)}`
const res = await fetch(api)
const data = await res.json()

if (!data.result || !data.result.video) {
return {
statusCode: 404,
body: JSON.stringify({
success: false,
message: "لم يتم العثور على الفيديو"
})
}
}

// اختيار جودة 360
let video360 = data.result.video.find(v => v.quality === "360p")

if (!video360) {
return {
statusCode: 404,
body: JSON.stringify({
success: false,
message: "جودة 360 غير متوفرة"
})
}
}

return {
statusCode: 200,
body: JSON.stringify({
success: true,
quality: "360p",
title: data.result.title,
thumbnail: data.result.thumbnail,
download: video360.url
})
}

} catch (err) {

return {
statusCode: 500,
body: JSON.stringify({
success: false,
error: err.message
})
}

}

}
