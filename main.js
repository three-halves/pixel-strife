import {clamp, indexOfMax } from "./utils.js";

// globals
let teamAmount;
let colors = [];
let names = [];
let boardSize;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")
const swpCanvas = document.createElement("canvas");
const swpCtx = swpCanvas.getContext("2d")

let board;

// Each pixel stores a float array of weights for each team based on team amount in neighborhood
let boardWeights;

// Nonzero value if this pixel's weight needs to be recalculated
let dirtyWeights;

// Amounts of pixels the square neighborhood extends in any direction 
let neighborhoodSize = 1;
let unitWeight = 1 / ((2 * neighborhoodSize + 1) * (2 * neighborhoodSize + 1) - 1);

let stepInterval;

const params = new URLSearchParams(document.location.search);
console.log(params);

// Initialize all game variables from config and setup initial board state
function init() {
    // TODO get from url
    teamAmount = parseInt(params.get("teams"));

    boardSize = {x: parseInt(params.get("sizex")), y: parseInt(params.get("sizey"))}
    // setup board arrays
    board = new Uint8Array(boardSize.x * boardSize.y).fill(0);
    dirtyWeights = new Uint8Array(boardSize.x * boardSize.y).fill(1);
    boardWeights = new Array(boardSize.x * boardSize.y).fill(0).map(x => new Float32Array(teamAmount).fill(0));

    stepInterval = parseInt(params.get("interval"));

    // set canvas sizing
    canvas.width = boardSize.x;
    canvas.height = boardSize.y;
    swpCanvas.height = canvas.height;
    swpCanvas.width = canvas.width;

    // assign colors and names
    for (let i = 0; i < teamAmount; i++) {
        colors[i] = "#" + ("000000" + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
        names[i] = "team " + i;
    }

    console.log(colors)

    // set initial board state
    let segmentAmount = boardSize.x / teamAmount;
    for (let i = 0; i < boardSize.x; i++) {
        for (let j = 0; j < boardSize.y; j++) {
            // console.log(board);
            board[i + j * boardSize.x] = Math.floor(i / segmentAmount);
        }
    }

}

// Draw game state to canvas
function draw() {
	for (let i = 0; i < boardSize.x; i++) {
		for (let j = 0; j < boardSize.y; j++) {
			    swpCtx.fillStyle = colors[board[i + j * boardSize.x]];	
                // swpCtx.fillStyle = dirtyWeights[board[i + j * boardSize.x]] === 0 ? "red" : "blue";						
				swpCtx.fillRect(i, j, 1, 1);
		}
	}

    ctx.drawImage(swpCanvas, 0, 0);
}

// Do one step of strife logic
function step() {
	for (let i = 0; i < boardSize.x; i++) {
		for (let j = 0; j < boardSize.y; j++) {
            // get most influential color in neighborhood and do random threshold check
            // calcPixelWeights(i, j);
            let weights = boardWeights[i + j * boardSize.x].slice();
            // console.log(weights);
            // figure out which team this pixel is strifing
            let maxIndex = indexOfMax(weights);
            let currentTeam = board[i + j * boardSize.x];

            if (maxIndex == currentTeam) {
                weights[currentTeam] = -1;
                maxIndex = indexOfMax(weights);
            }

            // spread check
            if (weights[maxIndex] > Math.random()) {
                board[i + j * boardSize.x] = maxIndex;
                dirtyAdjacent(i, j)
            }
        }   
	}
}

// Calculates a pixels weights if it is dirty.
function calcPixelWeights(x, y) {
    boardWeights[x + y * boardSize.x].fill(0);
    // Add unit weight for each color pixel. Index in weights corresponds to pixel team
    for(let i = -neighborhoodSize; i <= neighborhoodSize; i++) {
        for(let j = -neighborhoodSize; j <= neighborhoodSize; j++) {
            if ((i === 0) && (j === 0)) continue;
            let ni = clamp(0, boardSize.x -1, x + i);
            let nj = clamp(0, boardSize.y -1, y + j);
            // console.log(boardWeights[x + y * boardSize.x]);
            boardWeights[x + y * boardSize.x][board[ni + nj * boardSize.x]] += unitWeight;
        }
    }

    dirtyWeights[x + y * boardSize.x] = 0
}

function dirtyAdjacent(x, y) {
    for(let i = -neighborhoodSize; i <= neighborhoodSize; i++) {
        for(let j = -neighborhoodSize; j <= neighborhoodSize; j++) {
            if ((i === 0) && (j === 0)) continue;

            dirtyWeights[(x + i) + (j + y) * boardSize.x] = 1;
        }
    }
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
draw();
main();

async function main() {
    while (true) {
        calcAllWeights();
        step();
        draw();
        await new Promise(r => setTimeout(r, stepInterval));
    }
}