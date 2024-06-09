let video = document.getElementById("video");
let canvas = document.body.appendChild(document.createElement("canvas"));
let ctx =  canvas.getContext("2d");
let displaySize;


// ukuran panjang dan lebar kamera dan canvas
let width = 700;
let height = 370;

// menjalankan video dikamera atau sudah di steam ke dalam html
const startStream = () => {
    console.log('---START STREAM---');
    navigator.mediaDevices.getUserMedia({
        video: {width,height},
        audio: false
    }).then((steam) => {video.srcObject = steam});
}

console.log(faceapi.nets);

// Jalankan dulu semua ini baru jalankan startStream
console.log("---START LOAD MODEL---");
Promise.all([
    faceapi.nets.ageGenderNet.loadFromUri('models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models'),

]).then(startStream);


// fungsi detect
async function  detect() {
    const detections =await faceapi.detectAllFaces(video)
                                                        .withFaceLandmarks()
                                                        .withFaceExpressions()
                                                        .withAgeAndGender();

    ctx.clearRect(0,0,width,height);
    const resizeDetections = faceapi.resizeResults(detections,displaySize);
    faceapi.draw.drawDetections(canvas, resizeDetections);
    faceapi.draw.drawFaceLandmarks(canvas,resizeDetections);
    faceapi.draw.drawFaceExpressions(canvas,resizeDetections);

    console.log(resizeDetections);
    resizeDetections.forEach(result => {
        const {age, gender, genderProbability} = result;
   ;
    new faceapi.draw.DrawTextField([
        `${Math.round(age,0)} Tahun`,
        `${gender} ${Math.round(genderProbability)}`
    ],
    result.detection.box.bottomRight
    ).draw(canvas);
}
);
}

// Tunggu hingga video nya play maka jalankan fungsi detect
video.addEventListener('play',() => {
    displaySize = {width,height};
    faceapi.matchDimensions(canvas,displaySize);
    setInterval(detect,700);
})

