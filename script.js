//const video = document.getElementById("videoElement");
var video = document.querySelector("#videoElement");
console.log('touched');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
])
.then(startVideo)
.catch((e)=>{console.log('error is:',e)})

function startVideo(){
    console.log('working here');
    
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
        })
        .catch(function (error) {
          console.log("Something went wrong!",error);
        });
    }
}

video.addEventListener('playing',()=>{
  console.log('Playing Noww!!');
  const canvas = faceapi.createCanvasFromMedia(video)
  //console.log('canvas is:',canvas);
  document.body.append(canvas)
  //console.log('video width and height:',video.width,video.height,video);
  const displaySize = { width: video.width, height: video.height }
  //console.log('displaySize:',displaySize);
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
   
//----------experimental

/*   var img = new Image();
   img.src='./Aditya_image.jpg';
   
    const results = await faceapi
  .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
  .withFaceLandmarks()
  .withFaceDescriptors()
    const faceMatcher = new faceapi.FaceMatcher(results)
    
    const results2 = await faceapi
  .detectAllFaces(video,new faceapi.TinyFaceDetectorOptions())
  .withFaceLandmarks()
  .withFaceDescriptors()

results2.forEach(fd => {
  const bestMatch = faceMatcher.findBestMatch(fd.descriptor)
  console.log('bestMatch:',bestMatch.toString())
})*/
  }, 100)
})

//startVideo();
