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

gameMap.set_gravity(1);

const render = () => {
  ctx.clearRect(0, 0, DATA_SIZE * CELL_SIZE, DATA_SIZE * CELL_SIZE);
  player.x = gameMap.get_player_x();
  player.y = gameMap.get_player_y();
  // gameMap.translate_player(0.2, 0.2);
  gameMap.update_player();
  player.update();
  requestAnimationFrame(render);
};

render();

// let keyData = {};

// document.addEventListener("keydown", (e) => (keyData[e.key] = true));
// document.addEventListener("keyup", (e) => (keyData[e.key] = false));
