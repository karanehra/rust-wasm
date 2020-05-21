use wasm_bindgen::prelude::*;

#[no_mangle]
fn add(x: i32, y: i32) -> i32 {
  x + y
}

#[wasm_bindgen]
pub fn hello_world() -> String {
  "Hello World".to_string()
}
