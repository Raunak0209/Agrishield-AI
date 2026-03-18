function previewImage(){

let file = document.getElementById("leaf").files[0]

if(!file) return

let reader = new FileReader()

reader.onload = function(e){

let img = document.getElementById("preview")

img.src = e.target.result
img.style.display = "block"

}

reader.readAsDataURL(file)
}


async function detect(){

let file = document.getElementById("leaf").files[0]

if(!file){
alert("Please upload an image first")
return
}

document.getElementById("loader").style.display = "block"

let form = new FormData()
form.append("leaf", file)

try{

let res = await fetch("/predict", {
method: "POST",
body: form
})

let data = await res.json()

document.getElementById("loader").style.display = "none"

let confidence = data.confidence
let rawDisease = data.disease

let disease = ""
let treatment = ""
let risk = ""
let warning = ""

// 🔥 Smart AI logic
if(confidence < 60){
    disease = "Uncertain Detection"
    treatment = "Result is inconclusive. Monitor the plant and re-analyze if symptoms increase."
    risk = "Low confidence prediction due to insufficient model certainty"
    warning = "⚠️ Low Confidence Result"
}
else if(rawDisease.includes("Healthy")){
    disease = "Healthy"
    treatment = "No treatment needed. Maintain proper care."
    risk = "No immediate risk detected"
}
else{
    disease = "Diseased"
    treatment = "Apply fungicide and remove infected leaves."
    risk = "High risk of infection spread"
}

// Color logic
let color = "#ff5252"
if(disease === "Healthy") color = "#00e676"
if(disease === "Uncertain Detection") color = "#ffc107"

// UI Output
document.getElementById("result").innerHTML = `
${warning ? `<div class="warning">${warning}</div>` : ""}

<h3 style="color:${color}">${disease}</h3>

<div class="bar">
<div class="fill" id="barFill"></div>
</div>

<p><b>Confidence:</b> ${confidence}%</p>

<p><b>Risk:</b> ${risk}</p>

<p><b>Treatment:</b> ${treatment}</p>
`

setTimeout(()=>{
document.getElementById("barFill").style.width = confidence + "%"
},100)

}catch(err){

document.getElementById("loader").style.display = "none"

document.getElementById("result").innerHTML = "Error analyzing image"

}

}