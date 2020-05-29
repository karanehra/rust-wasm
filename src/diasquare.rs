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
    let data_size: u32;
    if size % 2 == 0 {
      data_size = size + 1;
    } else {
      data_size = size;
    }

    let mut data = Vec::new();

    for _ in 0..data_size * data_size {
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

    let center: u32 = ((top_left + top_right + bottom_left + bottom_right) / 4) as u32;

    /*
     * Setting center
     */
    self.set_cell(size / 2 as u32, size / 2 as u32, center);

    DiaSquare { size, data }
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

  fn recurse(&mut self, x: u32, y: u32, size: u32) {
    if (size > 1) {
      /*
       * Get corner values
       */
      let top_left = self.get_cell(x, y);
      let top_right = self.get_cell(x, y + size);
      let bottom_left = self.get_cell(x + size, y);
      let bottom_right = self.get_cell(x + size, y + size);

      let new_center = ((top_left + top_right + bottom_right + bottom_left) / 4) as u32;

      self.set_cell(size / 2 as u32, size / 2 as u32, new_center);
    }
  }
}

fn randomizer() -> u32 {
  let a: u32 = random::<u32>() * 0xFFFFFFFF;
  return a;
}
