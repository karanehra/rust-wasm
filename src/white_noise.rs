use rand;
use wasm_bindgen::prelude::*;

const PLAYER_SIZE: i32 = 10;
const CELL_SIZE: i32 = 20;

#[wasm_bindgen]
pub struct WhiteNoise {
  size: u32,
  pixels: Vec<u8>,
  offset_x: u32,
  offset_y: u32,
}

#[wasm_bindgen]
impl WhiteNoise {
  pub fn new(size: u32) -> WhiteNoise {
    let mut pixels = Vec::new();
    for _ in 0..size * size {
      pixels.push(1);
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

  fn set_pixel(&mut self, x: u32, y: u32, v: u8) {
    let idx = self.get_idx(x, y);
    self.pixels[idx] = v;
  }

  fn get_idx(&self, x: u32, y: u32) -> usize {
    (x + self.size * y) as usize
  }

  fn get_pixel(&self, x: u32, y: u32) -> u8 {
    self.pixels[self.get_idx(x, y)]
  }

  pub fn octavize(&mut self) {
    for i in 0..self.size - 1 {
      for j in 0..self.size - 1 {
        let v1 = self.get_pixel(i, j);
        let v2 = self.get_pixel(i + 1, j);
        let v3 = self.get_pixel(i, j + 1);
        let v4 = self.get_pixel(i + 1, j + 1);
        let avg: f64 = (v1 + v2 + v3 + v4) as f64 / 4.0;
        let fin: u8;
        if avg <= 0.5 {
          fin = 0;
        } else {
          fin = 1;
        }

        self.set_pixel(i, j, fin);
      }
    }
  }

  pub fn get_pixeldata_ptr(&self) -> *const u8 {
    self.pixels.as_ptr()
  }

  pub fn offset(&mut self, x: u32, y: u32) {
    self.offset_x = self.offset_x + x;
    self.offset_y = self.offset_y + y;
  }

  pub fn check_collisions(&self, x: i32, y: i32) -> Vec<u8> {
    let mut a = Vec::new();
    a.push(self.check_collision_top(x, y));
    a.push(self.check_collision_bottom(x, y));
    return a;
  }

  fn check_collision_top(&self, x: i32, y: i32) -> u8 {
    let top_left_x = x / CELL_SIZE;
    let top_left_y = (y - 1) / CELL_SIZE;

    if top_left_y < 0 {
      return 0;
    }

    let top_right_x = (x + PLAYER_SIZE) / CELL_SIZE;
    let top_right_y = top_left_y;
    if self.get_pixel(top_left_x as u32, top_right_x as u32) > 0
      || self.get_pixel(top_right_x as u32, top_right_y as u32) > 0
    {
      return 0;
    } else {
      return 1;
    }
  }

  fn check_collision_bottom(&self, x: i32, y: i32) -> u8 {
    let bottom_left_x = x / CELL_SIZE;
    let bottom_left_y = (y + PLAYER_SIZE + 1) / CELL_SIZE;

    let bottom_right_x = (bottom_left_x + PLAYER_SIZE) / CELL_SIZE;
    let bottom_right_y = bottom_left_y;
    if self.get_pixel(bottom_left_x as u32, bottom_left_y as u32) > 0
      || self.get_pixel(bottom_right_x as u32, bottom_right_y as u32) > 0
    {
      return 0;
    } else {
      return 1;
    }
  }
}

// fn turn_to_bw(val: u32) -> u32 {
//   let mut a: u32 = val;
//   let b = a & 0xFF;
//   let g = (a >> 8) & 0xFF;
//   let r = (a >> 16) & 0xFF;
//   a = (b + g + r) / 3 & 0xFF;
//   if a > (0xa0) {
//     return 0xFFFFFFFF;
//   }
//   return 0xFF000000;
// }

fn randomizer(x: u32, y: u32) -> u8 {
  let _a: f64 = x as f64;
  let _b: f64 = y as f64;
  // let c: f64 = a + b;
  // let d: f64 = a * b;
  let random_val: u8 = rand::random();
  if random_val > 128 {
    return 1;
  }
  return 0;
}
