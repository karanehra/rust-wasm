use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Map {
  size: u32,
  data: Vec<u8>,
  player_size: u32,
  cell_size: u32,
  player_x: f32,
  player_y: f32,
  gravity: f32,
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
      gravity: 0.0,
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

  pub fn get_player_x(&self) -> f32 {
    self.player_x
  }

  pub fn get_player_y(&self) -> f32 {
    self.player_y
  }

  pub fn translate_player(&mut self, dx: f32, dy: f32) {
    if dx > 0.0 && !self.is_right_colliding() {
      self.player_x += dx;
    }
    if dx < 0.0 && !self.is_left_colliding() {
      self.player_x += dx;
    }
    if dy > 0.0 && !self.is_bottom_colliding() {
      self.player_y += dy;
    }
    if dy < 0.0 && !self.is_top_colliding() {
      self.player_y += dy;
    }
  }

  pub fn check_player_collisions(&self) -> Vec<u8> {
    let mut collision_data = Vec::new();
    collision_data.push(self.is_top_colliding() as u8);
    collision_data.push(self.is_bottom_colliding() as u8);
    collision_data.push(self.is_left_colliding() as u8);
    collision_data.push(self.is_right_colliding() as u8);
    return collision_data;
  }

  pub fn set_gravity(&mut self, gravity: f32) {
    self.gravity = gravity;
  }

  pub fn update_player(&mut self) {
    if !self.is_bottom_colliding() {
      self.player_y += self.gravity;
    }
  }

  fn is_top_colliding(&self) -> bool {
    let top_left_x = self.player_x as u32;
    let mut top_left_y = self.player_y as u32;

    if top_left_y == 0 {
      return false;
    }

    top_left_y -= 1;

    let top_right_x = top_left_x + self.player_size;
    let top_right_y = top_left_y;

    if self.get_data_at_position(top_left_x, top_left_y) == 0
      && self.get_data_at_position(top_right_x, top_right_y) == 0
    {
      return false;
    }
    return true;
  }

  fn is_bottom_colliding(&self) -> bool {
    let bottom_left_x = self.player_x as u32;
    let mut bottom_left_y = self.player_y as u32 + self.player_size;

    if bottom_left_y == self.size {
      return false;
    }

    bottom_left_y += 1;

    let bottom_right_x = bottom_left_x + self.player_size;
    let bottom_right_y = bottom_left_y;

    if self.get_data_at_position(bottom_left_x, bottom_left_y) == 0
      && self.get_data_at_position(bottom_right_x, bottom_right_y) == 0
    {
      return false;
    }
    return true;
  }

  fn is_left_colliding(&self) -> bool {
    let mut top_left_x = self.player_x as u32;
    let top_left_y = self.player_y as u32;

    if top_left_x == 0 {
      return false;
    }

    top_left_x -= 1;

    let bottom_left_x = top_left_x;
    let bottom_left_y = top_left_y + self.player_size;

    if self.get_data_at_position(bottom_left_x, bottom_left_y) == 0
      && self.get_data_at_position(top_left_x, top_left_y) == 0
    {
      return false;
    }
    return true;
  }

  fn is_right_colliding(&self) -> bool {
    let mut top_right_x = self.player_x as u32 + self.player_size;
    let top_right_y = self.player_y as u32;

    if top_right_x == self.size {
      return false;
    }

    top_right_x += 1;

    let bottom_right_x = top_right_x;
    let bottom_right_y = top_right_y + self.player_size;

    if self.get_data_at_position(bottom_right_x, bottom_right_y) == 0
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
    let x = x / self.cell_size;
    let y = y / self.cell_size;
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
