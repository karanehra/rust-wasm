use rand::prelude::*;
use wasm_bindgen::prelude::*;
// use std::prelude:

#[wasm_bindgen]
pub struct WhiteNoise {
  size: u32,
  pixels: Vec<u32>,
  offsetX: u32,
  offsetY: u32,
}

#[wasm_bindgen]
impl WhiteNoise {
  pub fn new(size: u32) -> WhiteNoise {
    let mut pixels = Vec::new();
    for i in 0..size * size {
      let x = i - (i / size);
      let y = i / size;
      pixels.push(randomizer(x, y));
    }
    WhiteNoise {
      size,
      pixels,
      offsetX: 0,
      offsetY: 0,
    }
  }

  pub fn get_pixeldata_ptr(&self) -> *const u32 {
    self.pixels.as_ptr()
  }

  pub fn offset(&mut self, x: u32, y: u32) {
    self.offsetX = self.offsetX + x;
    self.offsetY = self.offsetY + y;
  }
}

// fn randomizer() -> u32 {
//   let mut a: u32 = random::<u32>();
//   let b = a & 0xFF;
//   let g = (a >> 8) & 0xFF;
//   let r = (a >> 16) & 0xFF;
//   a = (b + g + r) / 3 & 0xFF;
//   // a = ((a << 16) | (a << 8) | a) | 0xFF000000;
//   if a > 0x9f {
//     return 0xFFFFFFFF;
//   }
//   return 0xFF000000;
// }

fn randomizer(x: u32, y: u32) -> u32 {
  let mut a: f64 = x as f64;
  let mut b: f64 = y as f64;
  return (a.sin().abs() * b.cos().abs() * (0xFFFFFFE as f64)) as u32 | 0xFF000000;
}
