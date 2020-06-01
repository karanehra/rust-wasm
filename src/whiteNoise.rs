use rand::prelude::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WhiteNoise {
  size: u32,
  pixels: Vec<u32>,
}

#[wasm_bindgen]
impl WhiteNoise {
  pub fn new(size: u32) -> WhiteNoise {
    let mut pixels = Vec::new();
    for _ in 0..size * size {
      pixels.push(randomizer());
    }
    WhiteNoise { size, pixels }
  }

  pub fn get_pixeldata_ptr(&self) -> *const u32 {
    self.pixels.as_ptr()
  }
}

fn randomizer() -> u32 {
  let mut a: u32 = random::<u32>();
  let b = a & 0xFF;
  let g = (a >> 8) & 0xFF;
  let r = (a >> 16) & 0xFF;
  a = (b + g + r) / 3 & 0xFF;
  return ((a << 16) | (a << 8) | a) | 0xFF000000;
}
