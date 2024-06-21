// VER: https://newdocs.phaser.io/docs/3.55.1/Phaser.GameObjects.Graphics
import { canvasHeight, canvasWidth } from "./constants.js";

class Scene extends Phaser.Scene {
  constructor() {
    super({ key: "Scene" });
    this.bitColors = {
      0: "0x000000",
      1: "0x1D2B53",
      2: "0x7E2553",
      3: "0x008751",
      4: "0xAB5236",
      5: "0x5F574F",
      6: "0xC2C3C7",
      7: "0xFFF1E8",
      8: "0xFF004D",
      9: "0xFFA300",
      10: "0xFFEC27",
      11: "0x00E436",
      12: "0x29ADFF",
      13: "0x83769C",
      14: "0xFF77A8",
      15: "0xFFCCAA"
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

  fill(color, opacity=1) {
    let graphics = this.graphics;
    graphics.fillStyle(this.getColor(color), opacity);
    graphics.fillRect(0, 0, canvasHeight, canvasWidth)
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
