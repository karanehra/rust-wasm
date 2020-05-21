import("./bindings/wasm_test").then((module) => {
  console.log(module.hello_world());
});
