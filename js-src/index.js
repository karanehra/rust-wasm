import { WhiteNoise, Map } from "wasm-test";
import { memory } from "wasm-test/wasm_test_bg";
import Player from "./player";

let DATA_SIZE = 32;
let CELL_SIZE = 20;
let MOVE_SPEED = 1;

let gameMap = Map.create(DATA_SIZE, 10, CELL_SIZE);
gameMap.populate();
console.log(gameMap);

let canvas = document.getElementById("main");
let gameCanvas = document.getElementById("map");

canvas.width = DATA_SIZE * CELL_SIZE;
canvas.height = DATA_SIZE * CELL_SIZE;
gameCanvas.width = DATA_SIZE * CELL_SIZE;
gameCanvas.height = DATA_SIZE * CELL_SIZE;

let ctx = canvas.getContext("2d");
let mapCtx = gameCanvas.getContext("2d");

let datum = new Uint8Array(
  memory.buffer,
  gameMap.render(),
  DATA_SIZE * DATA_SIZE
);

let img = new Image(CELL_SIZE, CELL_SIZE);
img.src = "./sprites/image_part_001.png";
img.onload = () => {
  for (let i = 0; i < DATA_SIZE ** 2; i++) {
    let yCoordinate = Math.floor(i / DATA_SIZE);
    let xCoordinate = i - yCoordinate * DATA_SIZE;
    datum[0] = 0;
    if (datum[i]) {
      mapCtx.drawImage(
        img,
        xCoordinate * CELL_SIZE,
        yCoordinate * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }
};

let player = new Player(ctx, 10);

const render = () => {
  ctx.clearRect(0, 0, DATA_SIZE * CELL_SIZE, DATA_SIZE * CELL_SIZE);
  player.x = gameMap.get_player_x();
  player.y = gameMap.get_player_y();
  player.update();
  requestAnimationFrame(render);
};

render();

// const getLocationSpritePath = (x, y) => {
//   let left = getLocationDataFromIndices(x - 1, y);
//   let right = getLocationDataFromIndices(x + 1, y);
//   let top = getLocationDataFromIndices(x, y - 1);
//   let bottom = getLocationDataFromIndices(x, y + 1);
//   let topLeft = getLocationDataFromIndices(x - 1, y - 1);
//   let topRight = getLocationDataFromIndices(x + 1, y - 1);
//   let bottomLeft = getLocationDataFromIndices(x - 1, y + 1);
//   let bottomRight = getLocationDataFromIndices(x + 1, y + 1);
//   if (top) {
//     return "./sprites/image_part_001.png";
//   } else if (bottom && !top) {
//     return "./sprites/image_part_005.png";
//   } else if (!bottom && !top) {
//     if (!right && !left) {
//       return "./sprites/image_part_009.png";
//     } else if (!right && left) {
//       return "./sprites/image_part_008.png";
//     } else if (right && !left) {
//       return "./sprites/image_part_006.png";
//     } else {
//       return "./sprites/image_part_007.png";
//     }
//   }
// };

// const getLocationDataFromIndices = (x, y) => {
//   return datum[x + y * DATA_SIZE];
// };

// const getLocationData = (x, y) => {
//   let normX = Math.floor(x / CELL_SIZE);
//   let normY = Math.floor(y / CELL_SIZE);
//   return datum[normX + normY * DATA_SIZE];
// };

// let player = new Player(ctx, CELL_SIZE / 2);

// const render = () => {
//   ctx.clearRect(0, 0, DATA_SIZE * CELL_SIZE, DATA_SIZE * CELL_SIZE);
//   drawMap();
//   translate();
//   player.update();
//   let data = whiteNoise.check_collisions(player.x, player.y);
//   player.collideTop = data[0];
//   player.collideBottom = data[1];
//   // checkCollisions();
//   requestAnimationFrame(render);
// };

// const translate = () => {
//   let xSpeed = 0;
//   if (keyData["ArrowLeft"] && !player.collideLeft) {
//     xSpeed = -MOVE_SPEED;
//   } else if (keyData["ArrowRight"] && !player.collideRight) {
//     xSpeed = MOVE_SPEED;
//   }
//   player.translate(xSpeed, 0);
//   // ctx.translate(-xSpeed, 0);
//   keyData["ArrowUp"] ? player.jump() : (player.JETPACK_ACTIVE = false);
// };

// const checkCollisions = () => {
//   if (
//     getLocationData(player.x, player.y - 1) ||
//     getLocationData(player.x + player.PLAYER_SIZE, player.y - 1)
//   ) {
//     player.collideTop = true;
//   } else {
//     player.collideTop = false;
//   }

//   if (
//     getLocationData(player.x, player.y + player.PLAYER_SIZE + 1) ||
//     getLocationData(
//       player.x + player.PLAYER_SIZE,
//       player.y + player.PLAYER_SIZE + 1
//     )
//   ) {
//     player.collideBottom = true;
//   } else {
//     player.collideBottom = false;
//   }

//   if (
//     getLocationData(player.x + player.PLAYER_SIZE + 1, player.y) ||
//     getLocationData(
//       player.x + player.PLAYER_SIZE + 1,
//       player.y + player.PLAYER_SIZE
//     )
//   ) {
//     player.collideRight = true;
//   } else {
//     player.collideRight = false;
//   }

//   if (
//     getLocationData(player.x - 1, player.y) ||
//     getLocationData(player.x - 1, player.y + player.PLAYER_SIZE)
//   ) {
//     player.collideLeft = true;
//   } else {
//     player.collideLeft = false;
//   }
// };

// let keyData = {};

// document.addEventListener("keydown", (e) => (keyData[e.key] = true));
// document.addEventListener("keyup", (e) => (keyData[e.key] = false));

// render();
