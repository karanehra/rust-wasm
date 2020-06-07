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
  ctx.fillStyle = "red";
  ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  ctx.closePath();
};

const translate = (dx, dy) => {
  let topX = x + CELL_SIZE / 2;
  let topY = y;

  let bottomX = topX;
  let bottomY = topY + CELL_SIZE;

  let leftX = x;
  let leftY = y + CELL_SIZE / 2;

  let rightX = x + CELL_SIZE;
  let rightY = y + CELL_SIZE / 2;

  if (Math.abs(dx) > 0) {
    if (dx > 0) {
      if (getLocationData(rightX + dx, rightY) === 0) {
        x += dx;
      } else {
        x = x + dx - ((x + dx) % CELL_SIZE);
      }
    } else {
      if (getLocationData(leftX + dx, leftY) === 0) {
        x += dx;
      } else {
        x = x + dx - ((x + dx) % CELL_SIZE);
      }
    }
  }
  if (Math.abs(dy) > 0) {
    if (dy > 0) {
      if (getLocationData(bottomX + dx, bottomY) === 0) {
        x += dx;
      } else {
        x = x + dx - ((x + dx) % CELL_SIZE);
      }
    } else {
      if (getLocationData(topY + dx, topY) === 0) {
        x += dx;
      } else {
        x = x + dx - ((x + dx) % CELL_SIZE);
      }
    }
  }
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

const handleKeypress = (event) => {
  switch (event.key) {
    case "ArrowUp":
      translate(0, -1);
      break;
    case "ArrowDown":
      translate(0, 1);
      break;
    case "ArrowRight":
      translate(1, 0);
      break;
    case "ArrowLeft":
      translate(-1, 0);
      break;
  }
};

document.addEventListener("keydown", handleKeypress);
