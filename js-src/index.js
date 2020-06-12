import { WhiteNoise, Map } from "wasm-test";
import { memory } from "wasm-test/wasm_test_bg";
import Player from "./player";

let gameMap = Map.create(32, 10, 20);
console.log(gameMap);

// OLD implementation below.

let DATA_SIZE = 32;
let CELL_SIZE = 20;
let MOVE_SPEED = 1;

/**
 * @type {HTMLCanvasElement}
 */
let canvas = document.getElementById("main");
let map = document.getElementById("map");
canvas.width = DATA_SIZE * CELL_SIZE;
canvas.height = DATA_SIZE * CELL_SIZE;
map.width = DATA_SIZE * CELL_SIZE;
map.height = DATA_SIZE * CELL_SIZE;
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
let ctx2 = map.getContext("2d");

let whiteNoise = WhiteNoise.new(DATA_SIZE);
whiteNoise.render();
whiteNoise.octavize();
let datum = new Uint8Array(
  memory.buffer,
  whiteNoise.get_pixeldata_ptr(),
  DATA_SIZE * DATA_SIZE
);

let x = 0;
let y = 0;

const drawMap = () => {
  let totalCells = DATA_SIZE ** 2;
  ctx2.clearRect(0, 0, DATA_SIZE * CELL_SIZE, DATA_SIZE * CELL_SIZE);
  for (let i = 0; i < totalCells; i++) {
    let yCoordinate = Math.floor(i / DATA_SIZE);
    let xCoordinate = i - yCoordinate * DATA_SIZE;
    datum[0] = 0;
    if (datum[i]) {
      let img = new Image(CELL_SIZE, CELL_SIZE);
      img.src = getLocationSpritePath(xCoordinate, yCoordinate);
      ctx2.drawImage(
        img,
        xCoordinate * CELL_SIZE,
        yCoordinate * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }
};

const getLocationSpritePath = (x, y) => {
  let left = getLocationDataFromIndices(x - 1, y);
  let right = getLocationDataFromIndices(x + 1, y);
  let top = getLocationDataFromIndices(x, y - 1);
  let bottom = getLocationDataFromIndices(x, y + 1);
  let topLeft = getLocationDataFromIndices(x - 1, y - 1);
  let topRight = getLocationDataFromIndices(x + 1, y - 1);
  let bottomLeft = getLocationDataFromIndices(x - 1, y + 1);
  let bottomRight = getLocationDataFromIndices(x + 1, y + 1);
  if (top) {
    return "./sprites/image_part_001.png";
  } else if (bottom && !top) {
    return "./sprites/image_part_005.png";
  } else if (!bottom && !top) {
    if (!right && !left) {
      return "./sprites/image_part_009.png";
    } else if (!right && left) {
      return "./sprites/image_part_008.png";
    } else if (right && !left) {
      return "./sprites/image_part_006.png";
    } else {
      return "./sprites/image_part_007.png";
    }
  }
};

const getLocationDataFromIndices = (x, y) => {
  return datum[x + y * DATA_SIZE];
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
  let data = whiteNoise.check_collisions(player.x, player.y);
  player.collideTop = data[0];
  player.collideBottom = data[1];
  // checkCollisions();
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
  // ctx.translate(-xSpeed, 0);
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
