import { WhiteNoise, DiaSquare } from "wasm-test";
import { memory } from "wasm-test/wasm_test_bg";

let DATA_SIZE = 32;
let SCALE_FACTOR = 30;

let whiteNoise = WhiteNoise.new(DATA_SIZE);

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
  transform: scale(${SCALE_FACTOR})
`;

const render = () => {
  whiteNoise.render();
  whiteNoise.octavize();
  let datum = new Uint32Array(
    memory.buffer,
    whiteNoise.get_pixeldata_ptr(),
    DATA_SIZE * DATA_SIZE
  );
  let ctx = canvas.getContext("2d");

  let newImageData = ctx.createImageData(DATA_SIZE, DATA_SIZE);
  let newImageDataBuffer = new Uint32Array(newImageData.data.buffer);

  newImageDataBuffer.set(datum);
  ctx.putImageData(newImageData, 0, 0);
};

const handleKeypress = (event) => {
  console.log(event, event.key);
  switch (event.key) {
    case "ArrowUp":
      whiteNoise.offset(0, 1);
      render();
      break;
    case "ArrowDown":
      whiteNoise.offset(0, -1);
      render();
      break;
    case "ArrowRight":
      whiteNoise.offset(1, 0);
      render();
      break;
    case "ArrowLeft":
      whiteNoise.offset(-1, 0);
      render();
      break;
  }
};

document.addEventListener("keydown", handleKeypress);

render();
