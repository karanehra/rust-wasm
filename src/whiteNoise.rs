use rand::prelude::*;
use wasm_bindgen::prelude::*;
// use std::prelude:

#[wasm_bindgen]
pub struct WhiteNoise {
  size: u32,
  pixels: Vec<u32>,
  offset_x: u32,
  offset_y: u32,
}

#[wasm_bindgen]
impl WhiteNoise {
  pub fn new(size: u32) -> WhiteNoise {
    let mut pixels = Vec::new();
    for _ in 0..size * size {
      pixels.push(0);
    }
    WhiteNoise {
      size,
      pixels,
      offset_x: 0,
      offset_y: 0,
    }
  }

  pub fn render(&mut self) {
    for i in 0..self.size * self.size {
      let y = i / self.size;
      let x = i - (y * self.size);
      self.pixels[i as usize] = randomizer(x + self.offset_x, y + self.offset_y);
    }
  }

  pub fn get_pixeldata_ptr(&self) -> *const u32 {
    self.pixels.as_ptr()
  }

  pub fn offset(&mut self, x: u32, y: u32) {
    self.offset_x = self.offset_x + x;
    self.offset_y = self.offset_y + y;
  }
}

fn turn_to_bw(val: u32) -> u32 {
  let mut a: u32 = val;
  let b = a & 0xFF;
  let g = (a >> 8) & 0xFF;
  let r = (a >> 16) & 0xFF;
  a = (b + g + r) / 3 & 0xFF;
  if a > (0xFF / 2) {
    return 0xFFFFFFFF;
  }
  return 0xFF000000;
}

fn randomizer(x: u32, y: u32) -> u32 {
  let mut a: f64 = x as f64 * 3443f64;
  let mut b: f64 = y as f64 * 122f64;
  return turn_to_bw((a.sin().abs() * b.cos().abs() * (0xFFFFFFE as f64)) as u32 | 0xFF000000);
}
