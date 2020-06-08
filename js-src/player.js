export default class Player {
  /**
   *Creates an instance of Player.
   * @param {CanvasRenderingContext2D} ctx
   * @memberof Player
   */
  constructor(ctx, size) {
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.PLAYER_SIZE = size;
    this.GRAVITY = 1;
    this.JETPACK = -1;
    this.JETPACK_ACTIVE = false;
    this.collideRight = false;
    this.collideLeft = false;
    this.collideTop = false;
    this.collideBottom = false;
  }

  update() {
    if (!this.collideBottom && !this.JETPACK_ACTIVE) this.y += this.GRAVITY;
    this.ctx.beginPath();
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.x, this.y, this.PLAYER_SIZE, this.PLAYER_SIZE);
    this.ctx.closePath();
  }

  jump() {
    this.JETPACK_ACTIVE = true;
    if (!this.collideTop) this.y += this.JETPACK;
  }

  translate(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
}
