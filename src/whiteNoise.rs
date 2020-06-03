use wasm_bindgen::prelude::*;

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
    for i in 0..self.size {
      for j in 0..self.size {
        let idx = self.get_idx(i, j);
        self.pixels[idx] = randomizer(i + self.offset_x, j + self.offset_y);
      }
    }
  }

  fn set_cell(&mut self, x: u32, y: u32, v: u32) {
    let idx = self.get_idx(x, y);
    self.pixels[idx] = v;
  }

  fn get_idx(&self, x: u32, y: u32) -> usize {
    (x + self.size * y) as usize
  }

  fn get_cell(&self, x: u32, y: u32) -> u32 {
    self.pixels[self.get_idx(x, y)]
  }

  pub fn octavize(&mut self) {
    for i in 0..self.size - 1 {
      for j in 0..self.size - 1 {
        let v1 = self.pixels[self.get_idx(i, j)];
        let v2 = self.pixels[self.get_idx(i + 1, j)];
        let v3 = self.pixels[self.get_idx(i, j + 1)];
        let v4 = self.pixels[self.get_idx(i + 1, j + 1)];
        let idx = self.get_idx(i, j);
        self.pixels[idx] = turn_to_bw((v1 + v2 + v3 + v4) / 4 | 0xFF000000);
      }
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
  if a > (0xa0) {
    return 0xFFFFFFFF;
  }
  return 0xFF000000;
}

fn randomizer(x: u32, y: u32) -> u32 {
  let mut a: f64 = x as f64;
  let mut b: f64 = y as f64;
  // a = a * 223.022f64;
  // b = b * 1004.123f64;
  // let c: f64 = a + b;
  // let d: f64 = a * b;
  let random_value = a.sin().abs() * b.cos().abs();
  return turn_to_bw((random_value * (0xFFFFFFE as f64)) as u32);
  // return (random_value * (0xFFFFFFE as f64)) as u32 | 0xFF000000;
}
