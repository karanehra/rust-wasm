// import { WhiteNoise, DiaSquare } from "wasm-test";
// import { memory } from "wasm-test/wasm_test_bg";

let DATA_SIZE = 32;
let CELL_SIZE = 20;

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

let data = [];

const fillData = () => {
  let totalCells = DATA_SIZE ** 2;
  for (let i = 0; i < totalCells; i++) {
    data[i] = Math.random() > 0.5 ? 1 : 0;
  }
};

const render = () => {
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, DATA_SIZE * CELL_SIZE, DATA_SIZE * CELL_SIZE);
  let totalCells = DATA_SIZE ** 2;
  for (let i = 0; i < totalCells; i++) {
    let yCoordinate = Math.floor(i / DATA_SIZE);
    let xCoordinate = i - yCoordinate * DATA_SIZE;
    if (data[i]) {
      ctx.beginPath();
      ctx.fillRect(
        xCoordinate * CELL_SIZE,
        yCoordinate * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
      ctx.closePath();
    }
  }
  console.log(data);
};
fillData();
render();

const move = () => {
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, DATA_SIZE * CELL_SIZE, DATA_SIZE * CELL_SIZE);
  ctx.translate(1, 1);
  render();
};

let btn = document.getElementById("btn");
btn.addEventListener("click", move);

// let whiteNoise = WhiteNoise.new(DATA_SIZE);

// const render = () => {
//   whiteNoise.render();
//   whiteNoise.octavize();
//   let datum = new Uint32Array(
//     memory.buffer,
//     whiteNoise.get_pixeldata_ptr(),
//     DATA_SIZE * DATA_SIZE
//   );
//   let ctx = canvas.getContext("2d");

//   let newImageData = ctx.createImageData(DATA_SIZE, DATA_SIZE);
//   let newImageDataBuffer = new Uint32Array(newImageData.data.buffer);

//   newImageDataBuffer.set(datum);
//   ctx.putImageData(newImageData, 0, 0);
// };

// const handleKeypress = (event) => {
//   console.log(event, event.key);
//   switch (event.key) {
//     case "ArrowUp":
//       whiteNoise.offset(0, 1);
//       render();
//       break;
//     case "ArrowDown":
//       whiteNoise.offset(0, -1);
//       render();
//       break;
//     case "ArrowRight":
//       whiteNoise.offset(1, 0);
//       render();
//       break;
//     case "ArrowLeft":
//       whiteNoise.offset(-1, 0);
//       render();
//       break;
//   }
// };

// document.addEventListener("keydown", handleKeypress);

// render();
