import("./bindings/wasm_test").then((module) => {
  let uni = module.Universe.new();
  const pre = document.createElement("pre", {});

  pre.style.lineHeight = "0.9";
  pre.id = "prepre";
  document.body.appendChild(pre);
  const renderLoop = () => {
    pre.textContent = uni.render();
    uni.tick();
    requestAnimationFrame(renderLoop);
  };
  renderLoop();
});
