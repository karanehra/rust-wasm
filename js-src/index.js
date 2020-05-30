import { Colors, DiaSquare } from "wasm-test";
import { memory } from "wasm-test/wasm_test_bg";

let DATA_SIZE = 512;

let a = Colors.new();
let colors = new Uint32Array(memory.buffer, a.get_set_ptr(), 4);

let b = DiaSquare.new(DATA_SIZE);
b.init();
let datum = new Uint32Array(memory.buffer, b.get_data(), DATA_SIZE * DATA_SIZE);
console.log(datum);

/**
 * @type {HTMLCanvasElement}
 */

let canvas = document.getElementById("main");
canvas.width = DATA_SIZE;
canvas.height = DATA_SIZE;
let ctx = canvas.getContext("2d");

let newImageData = ctx.createImageData(DATA_SIZE, DATA_SIZE);
let newImageDataBuffer = new Uint32Array(newImageData.data.buffer);

a = "12";

newImageDataBuffer.set(datum);
ctx.putImageData(newImageData, 0, 0);
