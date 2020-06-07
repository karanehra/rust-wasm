// import { WhiteNoise, DiaSquare } from "wasm-test";
import { WhiteNoise } from "wasm-test";
import { memory } from "wasm-test/wasm_test_bg";

let DATA_SIZE = 32;
let CELL_SIZE = 20;
let BALL_RADIUS = CELL_SIZE / 2;

/**
 * @type {HTMLCanvasElement}
 */
let canvas = document.getElementById("main");
canvas.width = DATA_SIZE * CELL_SIZE;
canvas.height = DATA_SIZE * CELL_SIZE;
canvas.style = `
  image-rendering: optimizeSpeed;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: -o-crisp-edges;
  image-rendering: optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
  -ms-interpolation-mode: nearest-neighbor;
`;
let ctx = canvas.getContext("2d");

let whiteNoise = WhiteNoise.new(DATA_SIZE);
whiteNoise.render();
let datum = new Uint8Array(
  memory.buffer,
  whiteNoise.get_pixeldata_ptr(),
  DATA_SIZE * DATA_SIZE
);

const move = () => {
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, DATA_SIZE * CELL_SIZE, DATA_SIZE * CELL_SIZE);
  ctx.translate(-1, -1);
  render();
};
const move2 = () => {
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, DATA_SIZE * CELL_SIZE, DATA_SIZE * CELL_SIZE);
  ctx.translate(1, 1);
  render();
};

let btn = document.getElementById("btn");
btn.addEventListener("click", move);
let btn2 = document.getElementById("btn2");
btn2.addEventListener("click", move2);

const dx = 1;
const dy = 1;
let x = 0;
let y = 0;

const drawMap = () => {
  let totalCells = DATA_SIZE ** 2;
  ctx.clearRect(0, 0, DATA_SIZE * CELL_SIZE, DATA_SIZE * CELL_SIZE);
  for (let i = 0; i < totalCells; i++) {
    let yCoordinate = Math.floor(i / DATA_SIZE);
    let xCoordinate = i - yCoordinate * DATA_SIZE;
    datum[0] = 0;
    if (datum[i]) {
      ctx.beginPath();
      ctx.fillStyle = "#000000";
      ctx.fillRect(
        xCoordinate * CELL_SIZE,
        yCoordinate * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
      ctx.closePath();
    }
  }
};

const drawLoop = () => {
  ctx.beginPath();
  ctx.arc(x, y, BALL_RADIUS, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
  let centerX = Math.floor(x / CELL_SIZE);
  let centerY = Math.floor(y / CELL_SIZE);

  let topX = x;
  let topY = y - BALL_RADIUS;
  let rightX = x + BALL_RADIUS;
  let rightY = y;
  let bottomX = x;
  let bottomY = x + BALL_RADIUS;
  let leftX = x - BALL_RADIUS;
  let leftY = y;

  console.log(
    "top:",
    getLocationData(topX, topY),
    "right",
    getLocationData(rightX, rightY),
    "bottom",
    getLocationData(bottomX, bottomY),
    "left",
    getLocationData(leftX, leftY)
  );

  // console.log(datum[centerX + centerY * DATA_SIZE]);
};

const getLocationData = (x, y) => {
  let normX = Math.floor(x / CELL_SIZE);
  let normY = Math.floor(y / CELL_SIZE);
  return datum[normX + normY * DATA_SIZE];
};

const render = () => {
  ctx.clearRect(0, 0, DATA_SIZE * CELL_SIZE, DATA_SIZE * CELL_SIZE);
  drawMap();
  drawLoop();
};

setInterval(render, 10);

// const render = () => {
//   whiteNoise.render();
//   whiteNoise.octavize();
// let datum = new Uint32Array(
//   memory.buffer,
//   whiteNoise.get_pixeldata_ptr(),
//   DATA_SIZE * DATA_SIZE
// );
//   let ctx = canvas.getContext("2d");

//   let newImageData = ctx.createImageData(DATA_SIZE, DATA_SIZE);
//   let newImageDataBuffer = new Uint32Array(newImageData.data.buffer);

//   newImageDataBuffer.set(datum);
//   ctx.putImageData(newImageData, 0, 0);
// };

const handleKeypress = (event) => {
  switch (event.key) {
    case "ArrowUp":
      y -= dy;
      break;
    case "ArrowDown":
      y += dy;
      break;
    case "ArrowRight":
      x += dx;
      break;
    case "ArrowLeft":
      x -= dx;
      break;
  }
};

document.addEventListener("keydown", handleKeypress);

// render();
