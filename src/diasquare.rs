use math::round::ceil;
use rand::prelude::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct DiaSquare {
  size: u32,
  data: Vec<u32>,
}

#[wasm_bindgen]
impl DiaSquare {
  pub fn new(&mut self, size: u32) -> DiaSquare {
    let finalSize: u32;
    if size % 2 == 0 {
      finalSize = size + 1;
    } else {
      finalSize = size;
    }

    let mut data = Vec::new();

    for _ in 0..size * size {
      data.push(0);
    }

    let top_left = randomizer();
    let top_right = randomizer();
    let bottom_left = randomizer();
    let bottom_right = randomizer();

    /*
     * Setting corners
     */
    self.set_cell(0, 0, top_left);
    self.set_cell(0, size, bottom_left);
    self.set_cell(size, 0, top_right);
    self.set_cell(size, size, bottom_right);

    let center = (top_left + top_right + bottom_left + bottom_right) / 4;

    /*
     * Setting center
     */
    self.set_cell(size / 2, size / 2, center);

    DiaSquare {
      size: finalSize,
      data,
    }
  }

  fn get_idx(&self, x: u32, y: u32) -> usize {
    (x + self.size * y) as usize
  }

  fn set_cell(&mut self, x: u32, y: u32, v: u32) {
    let idx = self.get_idx(x, y);
    self.data[idx] = v;
  }

  fn get_cell(&self, x: u32, y: u32) -> u32 {
    self.data[self.get_idx(x, y)]
  }

  fn recurse(x: u32, y: u32, size: u32) {
    if (size > 1) {}
  }
}

fn randomizer() -> u32 {
  let a: u32 = random::<u32>() * 0xFFFFFFFF;
  return a;
}
