import { Colors, DiaSquare } from "wasm-test";
import { memory } from "wasm-test/wasm_test_bg";

let a = Colors.new();
let colors = new Uint32Array(memory.buffer, a.get_set_ptr(), 4);

/**
 * @type {HTMLCanvasElement}
 */

let canvas = document.getElementById("main");
canvas.width = 64;
canvas.height = 64;
let ctx = canvas.getContext("2d");

let newImageData = ctx.createImageData(64, 64);
let newImageDataBuffer = new Uint32Array(newImageData.data.buffer);

a = "12";

newImageDataBuffer.set(colors);
ctx.putImageData(newImageData, 0, 0);

let b = DiaSquare.new(4);
b.init();
let datum = new Uint32Array(memory.buffer, b.get_data(), 25);
console.log(datum);
