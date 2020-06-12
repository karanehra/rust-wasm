use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Map {
  size: u32,
  data: Vec<u8>,
  player_size: u32,
  cell_size: u32,
  player_x: f32,
  player_y: f32,
}

#[wasm_bindgen]
impl Map {
  pub fn create(size: u32, player_size: u32, cell_size: u32) -> Map {
    let mut data = Vec::new();
    for _ in 0..size * size {
      data.push(0);
    }

    Map {
      size,
      data,
      player_size,
      cell_size,
      player_x: 5.0,
      player_y: 5.0,
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
    let x = x / self.cell_size;
    let y = y / self.cell_size;
    let mut collision_data = Vec::new();
    collision_data.push(self.is_top_colliding(x, y) as u8);
    collision_data.push(self.is_bottom_colliding(x, y) as u8);
    collision_data.push(self.is_left_colliding(x, y) as u8);
    return collision_data;
  }

  pub fn get_player_x(&self) -> f32 {
    self.player_x
  }

  pub fn get_player_y(&self) -> f32 {
    self.player_y
  }

  fn is_top_colliding(&self, x: u32, y: u32) -> bool {
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

  fn is_bottom_colliding(&self, x: u32, y: u32) -> bool {
    let bottom_left_x = x;
    let mut bottom_left_y = y + self.player_size;

    if bottom_left_y == self.size {
      return true;
    }

    bottom_left_y += 1;

    let bottom_right_x = x + self.player_size;
    let bottom_right_y = bottom_left_y;

    if self.get_data_at_position(bottom_left_x, bottom_left_y) == 0
      && self.get_data_at_position(bottom_right_x, bottom_right_y) == 0
    {
      return false;
    }
    return true;
  }

  fn is_left_colliding(&self, x: u32, y: u32) -> bool {
    let mut top_left_x = x;
    let top_left_y = y;

    if top_left_x == 0 {
      return false;
    }

    top_left_x -= 1;

    let bottom_left_x = x;
    let bottom_left_y = y + self.player_size;

    if self.get_data_at_position(bottom_left_x, bottom_left_y) == 0
      && self.get_data_at_position(top_left_x, top_left_y) == 0
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
