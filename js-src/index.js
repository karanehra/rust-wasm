import { setupWebGL, drawRectangle } from "./utils/index";
import { Map } from "wasm-test";
import { memory } from "wasm-test/wasm_test_bg";
import Player from "./player";

const CELL_SIZE = 20;
const PLAYER_SIZE = 10;
const GRAVITY = 1;
const MOVE_SPEED = 0.9;
const FLY_SPEED = -1.2;

const glObject = setupWebGL();

/////////// Render map ///////////
let map = document.getElementById("map");
let size = Math.floor(Math.max(map.width, map.height) / 20);

let gameMap = Map.create(size, 10, CELL_SIZE);
gameMap.populate();
let data = new Uint8Array(memory.buffer, gameMap.render(), size * size);
data[0] = 0;
const setupMap = () => {
  for (let i = 0; i < size ** 2; i++) {
    let yCoordinate = Math.floor(i / size);
    let xCoordinate = i - yCoordinate * size;
    data[0] = 0;
    if (data[i]) {
      glObject.drawSquare(
        xCoordinate * CELL_SIZE,
        yCoordinate * CELL_SIZE,
        CELL_SIZE
      );
    }
  }
  setTimeout(() => (isMapBeingSetup = false), 300);
};

setupMap();
/////////// Render map ///////////

/**
 * @type {HTMLCanvasElement}
 */
let main = document.getElementById("main");
let ctx = main.getContext("2d");
let player = new Player(ctx, PLAYER_SIZE);
let isMapBeingSetup = false;

const width = main.clientWidth;
const height = main.clientHeight;
if (main.width !== width || main.height !== height) {
  main.width = width;
  main.height = height;
}

gameMap.set_gravity(GRAVITY);

const render = () => {
  ctx.clearRect(0, 0, main.width, main.height);
  handleControls();
  player.x = gameMap.get_player_x();
  player.y = gameMap.get_player_y();
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
