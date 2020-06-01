import { WhiteNoise, DiaSquare } from "wasm-test";
import { memory } from "wasm-test/wasm_test_bg";

let DATA_SIZE = 512;

let whiteNoise = WhiteNoise.new(DATA_SIZE);

let datum = new Uint32Array(
  memory.buffer,
  whiteNoise.get_pixeldata_ptr(),
  DATA_SIZE * DATA_SIZE
);

/**
 * @type {HTMLCanvasElement}
 */

let canvas = document.getElementById("main");
canvas.width = DATA_SIZE;
canvas.height = DATA_SIZE;
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

let newImageData = ctx.createImageData(DATA_SIZE, DATA_SIZE);
let newImageDataBuffer = new Uint32Array(newImageData.data.buffer);

newImageDataBuffer.set(datum);
canvas.style.transform = "scale(2)";
ctx.putImageData(newImageData, 0, 0);
