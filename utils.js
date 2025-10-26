export function clamp(min, max, x){
    return Math.max(min, Math.min(max, x));
}

// Returns the index of the first maximum element in the list
export function indexOfMax(arr) {
    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Returns an unencoded board state uint8 array given image data
export function imageDataToBoardState(imageObject) {
    //  Canvas to extract pixel data from upload
    // console.log(imageObject.width);
    let canvas = new OffscreenCanvas(imageObject.width, imageObject.height);
    let ctx = canvas.getContext("2d");

    ctx.drawImage(imageObject, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

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

    return {board: board, colors: colors};
}
