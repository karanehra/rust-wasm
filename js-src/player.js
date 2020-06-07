export default class Player {
  /**
   *Creates an instance of Player.
   * @param {CanvasRenderingContext2D} ctx
   * @memberof Player
   */
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.PLAYER_SIZE = 10;
  }

  update() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.x, this.y, this.PLAYER_SIZE, this.PLAYER_SIZE);
    this.ctx.closePath();
  }

  translate(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
}
