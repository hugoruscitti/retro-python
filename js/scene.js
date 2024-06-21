// VER: https://newdocs.phaser.io/docs/3.55.1/Phaser.GameObjects.Graphics

class Scene extends Phaser.Scene {
  constructor() {
    super({ key: "Scene" });
    this.bitColors = {
      black: 0x000000,
      blue: 0x0000ff,
      green: 0x00ff00,
      red: 0xff0000,
      white: 0xffffff,
    }
  }
  preload() {
    this.graphics = this.add.graphics(200, 200);
  }

  create() {
    window.canvas = this;
  }

  getColor(key, defaultValue = 0x000000) {
    return this.bitColors[key] || defaultValue;
  }

  drawLine(x, y, x2, y2, color) {
    let graphics = this.graphics;
    graphics.lineStyle(1, this.getColor(color));
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x2, y2);
    graphics.strokePath();
  }

  fill(color, opacity) {
    let graphics = this.graphics;
    graphics.fillStyle(this.getColor(color), opacity);
    graphics.fillRect(0, 0, 128, 128)
    graphics.strokePath();
  }

  clear() {
    let graphics = this.graphics;
    graphics.clear();
  }
}

export default Scene;
