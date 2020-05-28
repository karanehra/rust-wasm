use rand::prelude::*;

struct DiaSquare {
  width: u32,
  height: u32,
  data: Vec<u32>,
}

impl DiaSquare {
  pub fn new(&self, size: u32) -> DiaSquare {
    let mut data = Vec::new();

    for _ in 0..size * size {
      data.push(0);
    }

    let top_left = randomizer();
    let top_right = randomizer();
    let bottom_left = randomizer();
    let bottom_right = randomizer();

    self.set_cell(0, 0, top_left);

    DiaSquare {
      width: size,
      height: size,
      data,
    }
  }

  fn get_idx(&self, x: u32, y: u32) -> usize {
    (x + self.width * y) as usize
  }

  fn set_cell(&self, x: u32, y: u32, v: u32) {
    let mut data = self.data.to_vec();
    data[self.get_idx(x, y)] = v;
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
