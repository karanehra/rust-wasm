import("./bindings/wasm_test").then((module) => {
  let uni = new module.Universe();
  console.log(uni);
});
