// use math::round::ceil;
use rand::prelude::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct DiaSquare {
  size: u32,
  data: Vec<u32>,
}

#[wasm_bindgen]
impl DiaSquare {
  pub fn test() -> String {
    "Hello".to_string()
  }
  pub fn new(size: u32) -> DiaSquare {
    let data_size: u32;
    let mut data = Vec::new();
    if size % 2 == 0 {
      data_size = size + 1;
    } else {
      data_size = size;
    }

    for _ in 0..data_size * data_size {
      data.push(1);
    }

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

  pub fn init(&mut self) {
    let top_left = randomizer();
    let top_right = randomizer();
    let bottom_left = randomizer();
    let bottom_right = randomizer();
    let center: u64 = ((top_left + top_right) / 2) as u64;
    let size = self.size;

    /*
     * Setting corners
     */
    self.set_cell(0, 0, top_left);
    self.set_cell(0, size, bottom_left);
    self.set_cell(size, 0, top_right);
    self.set_cell(size, size, bottom_right);

    // /*
    //  * Setting center
    //  */
    self.set_cell(size / 2, size / 2, 0);
  }

  pub fn get_data(&self) -> *const u32 {
    self.data.as_ptr()
  }

  fn recurse(&mut self, x: u32, y: u32, size: u32) {
    if size > 1 {
      /*
       * Get corner values
       */
      let top_left = self.get_cell(x, y);
      let top_right = self.get_cell(x, y + size);
      let bottom_left = self.get_cell(x + size, y);
      let bottom_right = self.get_cell(x + size, y + size);

      let new_center = ((top_left + top_right + bottom_right + bottom_left) / 4) as u32;

      self.set_cell(size / 2, size / 2, new_center);

      self.set_cell(
        x,
        y + (size / 2),
        (top_left + top_right + new_center) / 3 + randomizer(),
      )

      // self.set_cell(x + (size/2), y, v: u32)
    }
  }
}
fn randomizer() -> u32 {
  let a: u32 = random::<u32>();
  return a;
}
