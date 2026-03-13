/* ????? ?????? */

let user = localStorage.getItem("user");

if(!user){
window.location.href="index.html";
}

/* ????? ??????? */

let email = localStorage.getItem("email") || "user@email.com";

document.getElementById("userEmail").innerText = email;

/* ???? ????????? */

let profileImage = localStorage.getItem("profileImage");

if(profileImage){
document.getElementById("profileImage").src = profileImage;
}

/* ????? API KEY */

let key = localStorage.getItem("apikey");

if(!key){

key = "sk_" + Math.random().toString(36).substring(2,12) + "_" + Date.now();

localStorage.setItem("apikey",key);

}

document.getElementById("apikey").innerText = key;

/* ??? API */

function copyAPI(){

navigator.clipboard.writeText(key);

alert("API Key Copied ?");

}

/* ?????? */

function goDashboard(){
window.location.href="dashboard.html";
}

function goApis(){
window.location.href="apis.html";
}

/* ??????? */

function contact(){
window.open("https://t.me/MNYAAMK");
}

/* ????? ?????? */

function logout(){

localStorage.clear();

window.location.href="index.html";

}
