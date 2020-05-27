struct DiaSquare {
  width: u32,
  height: u32,
  data: Vec<u32>,
}

impl DiaSquare {
  pub fn new(width: u32, height: u32) -> DiaSquare {
    let data = Vec::new();

    DiaSquare {
      width,
      height,
      data,
    }
  }
}
