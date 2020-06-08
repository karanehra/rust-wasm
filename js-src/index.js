// import { WhiteNoise, DiaSquare } from "wasm-test";
import { WhiteNoise } from "wasm-test";
import { memory } from "wasm-test/wasm_test_bg";
import Player from "./player";

let DATA_SIZE = 32;
let CELL_SIZE = 20;
let MOVE_SPEED = 1;

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
whiteNoise.octavize();
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
      let img = new Image(CELL_SIZE, CELL_SIZE);
      img.src = "./sprites/image_part_003.png";
      ctx.drawImage(
        img,
        xCoordinate * CELL_SIZE,
        yCoordinate * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }
};

const getLocationData = (x, y) => {
  let normX = Math.floor(x / CELL_SIZE);
  let normY = Math.floor(y / CELL_SIZE);
  return datum[normX + normY * DATA_SIZE];
};

let player = new Player(ctx, CELL_SIZE / 2);

const render = () => {
  ctx.clearRect(0, 0, DATA_SIZE * CELL_SIZE, DATA_SIZE * CELL_SIZE);
  drawMap();
  translate();
  player.update();
  checkCollisions();
  requestAnimationFrame(render);
};

const translate = () => {
  let xSpeed = 0;
  if (keyData["ArrowLeft"] && !player.collideLeft) {
    xSpeed = -MOVE_SPEED;
  } else if (keyData["ArrowRight"] && !player.collideRight) {
    xSpeed = MOVE_SPEED;
  }
  player.translate(xSpeed, 0);
  keyData["ArrowUp"] ? player.jump() : (player.JETPACK_ACTIVE = false);
};

const checkCollisions = () => {
  if (
    getLocationData(player.x, player.y - 1) ||
    getLocationData(player.x + player.PLAYER_SIZE, player.y - 1)
  ) {
    player.collideTop = true;
  } else {
    player.collideTop = false;
  }

  if (
    getLocationData(player.x, player.y + player.PLAYER_SIZE + 1) ||
    getLocationData(
      player.x + player.PLAYER_SIZE,
      player.y + player.PLAYER_SIZE + 1
    )
  ) {
    player.collideBottom = true;
  } else {
    player.collideBottom = false;
  }

  if (
    getLocationData(player.x + player.PLAYER_SIZE + 1, player.y) ||
    getLocationData(
      player.x + player.PLAYER_SIZE + 1,
      player.y + player.PLAYER_SIZE
    )
  ) {
    player.collideRight = true;
  } else {
    player.collideRight = false;
  }

  if (
    getLocationData(player.x - 1, player.y) ||
    getLocationData(player.x - 1, player.y + player.PLAYER_SIZE)
  ) {
    player.collideLeft = true;
  } else {
    player.collideLeft = false;
  }
};

let keyData = {};

document.addEventListener("keydown", (e) => (keyData[e.key] = true));
document.addEventListener("keyup", (e) => (keyData[e.key] = false));

render();
