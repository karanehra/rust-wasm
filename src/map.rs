use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Map {
  size: u32,
  data: Vec<u8>,
  player_size: u32,
  cell_size: u32,
}

#[wasm_bindgen]
impl Map {
  pub fn create(size: u32, player_size: u32, cell_size: u32) -> Map {
    let mut data = Vec::new();
    for _ in 0..size {
      data.push(0);
    }

    Map {
      size,
      data,
      player_size,
      cell_size,
    }
  }

  pub fn populate(&mut self) {
    for i in 0..self.size {
      for j in 0..self.size {
        let idx = self.get_idx(i, j);
        self.data[idx] = randomizer();
      }
    }
  }

  pub fn render(&self) -> *const u8 {
    self.data.as_ptr()
  }

  pub fn check_collisions(&self, x: u32, y: u32) -> Vec<u8> {
    let mut collision_data = Vec::new();
    collision_data.push(self.check_collision_top(x, y) as u8);
    return collision_data;
  }

  fn check_collision_top(&self, x: u32, y: u32) -> bool {
    let top_left_x = x;
    let mut top_left_y = y;

    if top_left_y == 0 {
      return false;
    }

    top_left_y -= 1;

    let top_right_x = x + self.player_size;
    let top_right_y = top_left_y;

    if self.get_data_at_position(top_left_x, top_left_y) == 0
      && self.get_data_at_position(top_right_x, top_right_y) == 0
    {
      return false;
    }
    return true;
  }

  fn get_idx(&self, x: u32, y: u32) -> usize {
    (x + self.size * y) as usize
  }

  fn get_data_at_position(&self, x: u32, y: u32) -> u8 {
    self.data[self.get_idx(x, y)]
  }
}

fn randomizer() -> u8 {
  let random_val: u8 = rand::random();
  if random_val > 128 {
    return 1;
  }
  return 0;
}
