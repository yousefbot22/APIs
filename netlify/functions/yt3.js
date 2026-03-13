export async function handler(event) {

const params = event.queryStringParameters
const url = params.url

if (!url) {
return {
statusCode: 400,
body: JSON.stringify({
success: false,
message: "حط رابط يوتيوب"
})
}
}

const api = `https://obito-mr-apis.vercel.app/api/download/youtube?url=${encodeURIComponent(url)}`

const res = await fetch(api)
const data = await res.json()

return {
statusCode: 200,
body: JSON.stringify(data)
}

}
