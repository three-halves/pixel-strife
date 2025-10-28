import {imageDataToBoardState, indexOfMax } from "./utils.js";

// Globals
let teamAmount;
let colors = [];
let rgbcolors = [];
let boardSize;

// Optional initial board state that also dictates team amount.
// Stored in same array format as board, decoded from Base64 string
let initalState;

// Canvas ref
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")

// Image data object and color data array for drawing to canvas
let imageDataArray;
let imageData;

let board;

// Each pixel stores a float array of weights for each team based on team amount in neighborhood
let boardWeights;

// Nonzero value if this pixel's weight needs to be recalculated
let dirtyWeights;

// Amounts of pixels the square neighborhood extends in any direction 
// Hard coding neighborhood size as 1 for performance + greater values aren't very interesting
let unitWeight = 1 / 8;

let stepInterval;

const params = new URLSearchParams(document.location.search);
console.log(params);

// Tries to parse all required URL params. If unsuccessful, redirect to config wizard
function validateParams() {
    if (
    !parseInt(params.get("teams")) || 
    !parseInt(params.get("sizex")) || 
    !parseInt(params.get("sizey")) || 
    !parseInt(params.get("interval"))) {
        window.alert("Invalid URL parameters!")
        window.location.replace("config.html");
        }
}

// Returns true if setup should use initial state or false if not. Sets global initialState.
function validateInitialState() {
    let encodedInitialState = params.get("initial");
    let imageObject = new Image();
    imageObject.addEventListener("load", () => {
        try {
            initalState = imageDataToBoardState(imageObject).board
            // Do some basic validation checks
            initHelper((initalState.length === boardSize.x * boardSize.y) && (Math.max(...initalState) === teamAmount - 1));
        }
        catch(error){
            console.log(error);
            initHelper(false);
        }
    });
    imageObject.addEventListener("error", () => {
        initHelper(false);
    });
    imageObject.src = encodedInitialState;

}

// Initialize all game variables from config and setup initial board state
function init() {
    validateParams();

    teamAmount = parseInt(params.get("teams"));
    boardSize = {x: parseInt(params.get("sizex")), y: parseInt(params.get("sizey"))}
    stepInterval = parseInt(params.get("interval"));

    // setup board arrays
    board = new Uint8Array(boardSize.x * boardSize.y).fill(0);
    dirtyWeights = new Uint8Array(boardSize.x * boardSize.y).fill(1);
    boardWeights = new Array(boardSize.x * boardSize.y).fill(0).map(x => new Float32Array(teamAmount).fill(0));

    // set canvas sizing
    canvas.width = boardSize.x;
    canvas.height = boardSize.y;

    imageDataArray = new Uint8ClampedArray(boardSize.x * boardSize.y * 4);
    imageData = new ImageData(imageDataArray, boardSize.x, boardSize.y);

    // assign colors
    for (let i = 0; i < teamAmount; i++) {
        let c = params.get("c" + i);
        if (c && c.length === 7 && parseInt(c.substring(1), 16) !== NaN) {
            colors[i] = c
        }
        else {
            colors[i] = "#" + ("000000" + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
        }

        // Get RGB colors from hex for canvas drawing
        rgbcolors.push(new Uint8Array([
            parseInt(colors[i].substring(1, 3), 16),
            parseInt(colors[i].substring(3, 5), 16),
            parseInt(colors[i].substring(5, 7), 16),
            255
        ])
        );
    }

    console.log(colors)
    validateInitialState();
}

// Initializes the board. Called after passed initial is validated
function initHelper(isInitialStateValid) {
    // If we have a valid initial state, setup board with it
    if (isInitialStateValid) {
        board = initalState.slice();
    }
    // Otherwise, setup stripe pattern
    else {
        let segmentAmount = boardSize.x / teamAmount;
        for (let i = 0; i < boardSize.x; i++) {
            for (let j = 0; j < boardSize.y; j++) {
                // console.log(board);
                board[i + j * boardSize.x] = Math.floor(i / segmentAmount);
            }
        }
    }

    draw();
    main();
}

// Draw game state to canvas
function draw() {    
	for (let i = 0; i < boardSize.x * boardSize.y; i++) {
            let c = rgbcolors[board[i]]
            imageDataArray.set(c, i * 4);
	}

    ctx.putImageData(imageData, 0, 0);
}

// Do one step of strife logic
function step() {
	for (let i = 0; i < boardSize.x; i++) {
		for (let j = 0; j < boardSize.y; j++) {
            let pos = i + j * boardSize.x;
            // get most influential color in neighborhood and do random threshold check
            // calcPixelWeights(i, j);
            let weights = boardWeights[pos];
            // console.log(weights);
            // figure out which team this pixel is strifing
            let currentTeam = board[pos];
            weights[currentTeam] = -1;
            let maxIndex = indexOfMax(weights);

            // spread check
            if (weights[maxIndex] > Math.random()) {
                board[pos] = maxIndex;
                dirtyAdjacent(i, j)
            }
        }   
	}
}

// Calculates a pixels weights if it is dirty.
function calcPixelWeights(x, y) {
    // Add unit weight for each color pixel. Index in weights corresponds to pixel team
    let a = x + y * boardSize.x;
    let xp = Math.min(x + 1, boardSize.x - 1);
    let xn = Math.max(x - 1, 0);
    let yp = Math.min(y + 1, boardSize.y - 1) * boardSize.x;
    let yn = Math.max(y - 1, 0) * boardSize.x;
    y *= boardSize.x;

    boardWeights[a].fill(0);
    
    // Check 8 pixel neighborhood
    boardWeights[a][board[xp + y]] += unitWeight;
    boardWeights[a][board[xn + y]] += unitWeight;
    boardWeights[a][board[xp + yp]] += unitWeight;
    boardWeights[a][board[xn + yp]] += unitWeight; 
    boardWeights[a][board[xp + yn]] += unitWeight;
    boardWeights[a][board[xn + yn]] += unitWeight;
    boardWeights[a][board[x + yp]] += unitWeight;
    boardWeights[a][board[x + yn]] += unitWeight; 

    dirtyWeights[x + y * boardSize.x] = 0
}

function dirtyAdjacent(x, y) {

    let xp = Math.min(x + 1, boardSize.x - 1);
    let xn = Math.max(x - 1, 0);
    let yp = Math.min(y + 1, boardSize.y - 1) * boardSize.x;
    let yn = Math.max(y - 1, 0) * boardSize.x;
    y *= boardSize.x;

    dirtyWeights[xp + y] = 1;
    dirtyWeights[xn + y] = 1;
    dirtyWeights[xp + yp] = 1;
    dirtyWeights[xn + yp] = 1;
    dirtyWeights[xp + yn] = 1;
    dirtyWeights[xn + yn] = 1;
    dirtyWeights[x + yp] = 1;
    dirtyWeights[x + yn] = 1;
}

function calcAllWeights() {
    for (let i = 0; i < boardSize.x; i++) {
		for (let j = 0; j < boardSize.y; j++) {
            if (dirtyWeights[i + j * boardSize.x] !== 0)
                calcPixelWeights(i, j)
        }
    }
}

// Initalize and run game
init();

async function main() {
    await new Promise(r => setTimeout(r, 1000));
    while (true) {
        calcAllWeights();
        step();
        draw();
        await new Promise(r => setTimeout(r, stepInterval));
    }
}
