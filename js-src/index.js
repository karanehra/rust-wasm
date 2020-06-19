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
let startX = gameMap.get_player_x();
let startY = gameMap.get_player_y();
gameMap.populate();

let mouseX, mouseY;

let data = new Uint8Array(memory.buffer, gameMap.render(), size * size);
data[0] = 0;
const setupMap = () => {
  for (let i = 0; i < size ** 2; i++) {
    let yCoordinate = Math.floor(i / size);
    let xCoordinate = i - yCoordinate * size;
    if (data[i]) {
      if (xCoordinate != mouseX || yCoordinate != mouseY) {
        glObject.drawSquare(
          xCoordinate * CELL_SIZE,
          yCoordinate * CELL_SIZE,
          CELL_SIZE
        );
      }
    }
  }
};

setupMap();
/////////// Render map ///////////

/**
 * @type {HTMLCanvasElement}
 */
let main = document.getElementById("main");
let ctx = main.getContext("2d");
let player = new Player(ctx, PLAYER_SIZE);
player.x = startX;
player.y = startY;

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
  glObject.translation = [
    -gameMap.get_player_x() + startX,
    -gameMap.get_player_y() + startY,
  ];
  gameMap.update_player();
  player.update();
  setupMap();
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
    gameMap.remove_block();
  }
  if (keyData.Shift) {
    gameMap.add_block();
  }
};

render();

const handleMapMouseClick = (event) => {
  console.log(
    Math.floor(event.clientX / CELL_SIZE),
    Math.floor(event.clientY / CELL_SIZE)
  );
};
const handleMapMouseHover = (event) => {
  mouseX = Math.floor(event.clientX / CELL_SIZE);
  mouseY = Math.floor(event.clientY / CELL_SIZE);
};
main.addEventListener("click", handleMapMouseClick);
main.addEventListener("mousemove", handleMapMouseHover);
document.addEventListener("keydown", (e) => (keyData[e.key] = true));
document.addEventListener("keyup", (e) => (keyData[e.key] = false));
