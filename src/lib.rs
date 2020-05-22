mod utils;

use wasm_bindgen::prelude::*;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
  fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
  alert("Hello, wasm-game-of-life!");
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Debug, Copy, PartialEq, Eq)]
pub enum Cell {
  Dead = 0,
  Alive = 1,
}

#[wasm_bindgen]
pub struct Universe {
  width: u32,
  height: u32,
  cells: Vec<Cell>,
}

impl Universe {
  fn get_index(&self, row: u32, column: u32) -> usize {
    (row * self.width + column) as usize
  }

  fn live_neighbour_count(&self, row: u32, column: u32) -> u8 {
    let mut count = 0;

    for curr_row in [self.height, 0, 1].iter().cloned() {
      for curr_col in [self.width, 0, 1].iter().cloned() {
        if curr_row == 0 && curr_col == 0 {
          continue;
        }
        let neighbour_row = (row + curr_row) % self.height;
        let neighbour_col = (column + curr_col) % self.width;

        let idx = self.get_index(neighbour_row, neighbour_col);
        count += self.cells[idx] as u8
      }
    }
    count
  }
}
