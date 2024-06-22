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

    this.spriteCount = 31 + 1;
  }

  _getColor(key, defaultValue = 0x000000) {
    return this.bitColors[key % 16] || defaultValue;
  }

  preload() {
    this.graphics = this.add.graphics(canvasHeight, canvasWidth);
    this.graphics.x = 2000;
    this.renderTexture = this.add.renderTexture(0, 0, canvasHeight, canvasWidth).setOrigin(0, 0);


    for (let i=0; i<this.spriteCount; i++) {
      this.load.image(`sprite-${i}`, `../static/sprites/sprite-${i}.png`);
    }
  }

  create() {
    window.canvas = this;
  }


  flip() {
    this.graphics.x = 0;
    this.renderTexture.draw(this.graphics);
    this.graphics.x = 2000;
  }

  drawLine(x, y, x2, y2, color) {
    let graphics = this.graphics;
    graphics.lineStyle(1, this._getColor(color));
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x2, y2);
    graphics.strokePath();

    this.flip();
  }

  fill(color, opacity=1) {
    let graphics = this.graphics;
    graphics.fillStyle(this.getColor(color), opacity);
    graphics.fillRect(0, 0, canvasHeight, canvasWidth)
    graphics.strokePath();

    this.flip();
  }

  drawCircle(x, y, radius, color) {
    let graphics = this.graphics;
    graphics.fillStyle(this._getColor(color));
    graphics.fillCircle(canvasHeight / 2, canvasWidth / 2, radius);

    this.flip();
  }

  drawSprite(x, y, index) {
    index = index % this.spriteCount || 0;
    let renderTexture = this.renderTexture;
    renderTexture.draw(`sprite-${index}`, x, y);
  }

  clear() {
    let graphics = this.graphics;
    let renderTexture = this.renderTexture;
    graphics.clear();
    renderTexture.clear();
  }
}

export default Scene;
