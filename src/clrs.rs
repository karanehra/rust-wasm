use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Colors {
  width: u32,
  height: u32,
  colors: Vec<Cltypes>,
}

#[wasm_bindgen]
impl Colors {
  pub fn get_width(&self) -> u32 {
    return self.width;
  }
  pub fn get_height(&self) -> u32 {
    return self.height;
  }
  pub fn new() -> Colors {
    let width = 64;
    let height = 64;
    let mut colors = Vec::new();
    colors.push(Cltypes::Black);
    colors.push(Cltypes::Green);
    return Colors {
      width,
      height,
      colors,
    };
  }

  pub fn get_set_ptr(&self) -> *const Cltypes {
    return self.colors.as_ptr();
  }
}

#[wasm_bindgen]
#[repr(u32)]
pub enum Cltypes {
  White = 0xFFFFFFFE,
  Black = 0xFF000000,
  Green = 0xFF00FF00,
}
