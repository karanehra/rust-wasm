import { setupWebGL, drawRectangle } from "./utils/index";
import { Map } from "wasm-test";
import { memory } from "wasm-test/wasm_test_bg";

const CELL_SIZE = 20;

const initializedContext = setupWebGL();

let map = document.getElementById("map");
let size = Math.floor(Math.max(map.width, map.height) / 20);

let mapData = Map.create(size, 10, CELL_SIZE);
mapData.populate();
let data = new Uint8Array(memory.buffer, mapData.render(), size * size);
data[0] = 0;

for (let i = 0; i < size; i++) {
  for (let j = 0; j < size; j++) {
    if (data[j + size * i]) {
      drawRectangle(
        initializedContext,
        i * CELL_SIZE,
        j * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }
}
