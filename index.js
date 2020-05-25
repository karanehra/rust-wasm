import("./pkg/wasm_test").then((module) => {
  let uni = module.Universe.new();
  const pre = document.createElement("pre", {});

  let CELL_SIZE = 5;

  let width = uni.get_width();
  let height = uni.get_height();

  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById("game");
  canvas.height = (CELL_SIZE + 1) * (height + 1);
  canvas.width = (CELL_SIZE + 1) * (width + 1);

  const ctx = canvas.getContext("2d");

  pre.style.lineHeight = "0.9";
  pre.id = "prepre";
  document.body.appendChild(pre);
  const renderLoop = () => {
    pre.textContent = uni.render();
    uni.tick();
    console.log(uni.cells());
  };
  setInterval(renderLoop, 3000);
});
