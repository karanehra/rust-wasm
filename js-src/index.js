import { WhiteNoise, Map } from "wasm-test";
import { memory } from "wasm-test/wasm_test_bg";
import Player from "./player";

let SCALE_FACTOR = 1;

let DATA_SIZE = 32 / SCALE_FACTOR;
let CELL_SIZE = Math.floor(window.innerHeight / DATA_SIZE) * SCALE_FACTOR;
let PLAYER_SIZE = 10 * SCALE_FACTOR;
let GRAVITY = 1 * SCALE_FACTOR;
let FLY_SPEED = -0.8 * SCALE_FACTOR;
let MOVE_SPEED = 0.99 * SCALE_FACTOR;

let gameMap = Map.create(DATA_SIZE, PLAYER_SIZE, CELL_SIZE);
gameMap.populate();

let canvas = document.getElementById("main");
/**
 * @type {HTMLCanvasElement}
 */
let gameCanvas = document.getElementById("map");

canvas.width = DATA_SIZE * CELL_SIZE;
canvas.height = DATA_SIZE * CELL_SIZE;
gameCanvas.width = DATA_SIZE * CELL_SIZE;
gameCanvas.height = DATA_SIZE * CELL_SIZE;

let ctx = canvas.getContext("2d");
let mapCtx = gameCanvas.getContext("2d");
let isMapBeingSetup = false;
let img = new Image(CELL_SIZE, CELL_SIZE);
img.src = "./sprites/image_part_001.png";
img.onload = () => {
  setupMap();
};

const setupMap = () => {
  isMapBeingSetup = true;
  let datum = new Uint8Array(
    memory.buffer,
    gameMap.render(),
    DATA_SIZE * DATA_SIZE
  );
  mapCtx.clearRect(0, 0, DATA_SIZE * CELL_SIZE, DATA_SIZE * CELL_SIZE);

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
    setTimeout(() => (isMapBeingSetup = false), 300);
  }
};

let player = new Player(ctx, PLAYER_SIZE);

gameMap.set_gravity(GRAVITY);

const render = () => {
  ctx.clearRect(0, 0, DATA_SIZE * CELL_SIZE, DATA_SIZE * CELL_SIZE);
  handleControls();
  player.x = gameMap.get_player_x();
  player.y = gameMap.get_player_y();
  // mapCtx.translate(player.x - 5, player.y - 5);
  gameMap.update_player();
  player.update();
  requestAnimationFrame(render);
};
let keyData = {};

const handleControls = () => {
  if (keyData.ArrowRight) {
    gameMap.translate_player(MOVE_SPEED, 0);
    gameMap.set_facing_right(true);
  } else if (keyData.ArrowLeft) {
    gameMap.translate_player(-MOVE_SPEED, 0);
    gameMap.set_facing_right(false);
  }
  if (keyData.ArrowUp) {
    gameMap.set_gravity(FLY_SPEED);
  } else {
    gameMap.set_gravity(GRAVITY);
  }
  if (keyData[" "]) {
    if (!isMapBeingSetup) {
      gameMap.remove_block();
      setupMap();
    }
  }
  if (keyData.Shift) {
    if (!isMapBeingSetup) {
      gameMap.add_block();
      setupMap();
    }
  }
};

render();

document.addEventListener("keydown", (e) => (keyData[e.key] = true));
document.addEventListener("keyup", (e) => (keyData[e.key] = false));
