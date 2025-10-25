import { rleEncode } from "./encoding.js";
import { rgbToHex } from "./utils.js";

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

    // Canvas to extract pixel data from upload
    let canvas = new OffscreenCanvas(selectedImage.width, selectedImage.height);
    let ctx = canvas.getContext("2d");

    ctx.drawImage(selectedImage, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Try to make board state from image data
    let imageBoardState = imageDataToBoardState(imageData.data);
    if (imageBoardState) {
        // set all form inputs based on image data
        initialBoardStateInput.value = rleEncode(imageBoardState);
        sizeXInput.value = selectedImage.width;
        sizeYInput.value = selectedImage.height;
        teamsInput.value = Math.max(...imageBoardState) + 1;
    }
});

// Returns an unencoded board state uint8 array given image data
function imageDataToBoardState(data) {
    let board = new Uint8Array(data.length / 4);
    let colors = [];
    for (let i = 0; i < data.length; i += 4) {
        let color = rgbToHex(data[i], data[i + 1], data[i + 2]);
        let cIndex = colors.indexOf(color);
        if (cIndex === -1) {
            colors.push(color)
            cIndex = colors.length - 1;
        }

        board[i / 4] = cIndex;
    }
    
    return board
}