// VER: https://newdocs.phaser.io/docs/3.55.1/Phaser.GameObjects.Graphics
import { canvasHeight, canvasWidth } from "./constants.js";

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
    this.graphics = this.add.graphics(canvasHeight, canvasWidth);
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

  drawCircle(x, y, radius, color) {
    let graphics = this.graphics;
    graphics.fillStyle(this.getColor(color));
    graphics.fillCircle(canvasHeight / 2, canvasWidth / 2, radius);
  }

  clear() {
    let graphics = this.graphics;
    graphics.clear();
  }
}

export default Scene;
