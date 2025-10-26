import { imageDataToBoardState } from "./utils.js";

let selectedImage = new Image();
// Used to read file from upload
let reader  = new FileReader();

// Get HTML element references
let initialBoardStateInput = document.getElementById("initial");
let sizeXInput = document.getElementById("sizex");
let sizeYInput = document.getElementById("sizey");
let teamsInput = document.getElementById("teams");

document.getElementById('image-upload').addEventListener('change', function(e) {
if (e.target.files[0]) {
    reader.readAsDataURL(e.target.files[0]);
}});

reader.addEventListener("load", () => {
    selectedImage.src = reader.result;
});

selectedImage.addEventListener("load", () => {
    // set all form inputs based on image data
    // NOTE: board state is decoded here and in main.js due to image data being more compressed as Base64 png

    // do some sanity checks
    // TODO quantize image colors
    if (selectedImage.width > 512 || selectedImage.height > 512){
        window.alert("Try a simpler image! Maximum 512x512px, 255 colors.");
        return;
    }

    let imageBoardState = imageDataToBoardState(selectedImage);
    initialBoardStateInput.value = selectedImage.src;
    sizeXInput.value = selectedImage.width;
    sizeYInput.value = selectedImage.height;
    teamsInput.value = Math.max(...imageBoardState) + 1;
});