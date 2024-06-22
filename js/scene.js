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
    this.soundCount = 21 + 1;
  }

  _getColor(key, defaultValue = 0x000000) {
    return this.bitColors[key % 16] || defaultValue;
  }

  preload() {
    this.graphics = this.add.graphics(canvasHeight, canvasWidth);
    this.graphics.x = 2000;
    this.renderTexture = this.add.renderTexture(0, 0, canvasHeight, canvasWidth).setOrigin(0, 0);
    this.keys = this.input.keyboard.createCursorKeys();

    for (let i=0; i<this.spriteCount; i++) {
      this.load.image(`sprite-${i}`, `../static/sprites/sprite-${i}.png`);
    }

    for (let i=0; i<this.soundCount; i++) {
      this.load.audio(`sound-${i}`, `../static/sounds/sound-${i}.wav`);
    }
  }

  create() {
    window.canvas = this;
  }

  // función interna para volcar los gráficos sobre
  // el buffer principal.
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

  fill(color, opacity) {
    opacity = opacity || 1;
    let graphics = this.graphics;
    graphics.fillStyle(this._getColor(color), opacity);
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
    index = parseInt(index, 10);
    let renderTexture = this.renderTexture;
    renderTexture.draw(`sprite-${index}`, x, y);
  }

  clear() {
    let graphics = this.graphics;
    let renderTexture = this.renderTexture;
    graphics.clear();
    renderTexture.clear();
  }

  randint(a, b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
  }

  random() {
    return Math.random();
  }

  sin(r) {
    return Math.sin(r);
  }

  cos(r) {
    return Math.cos(r);
  }

  tan(r) {
    return Math.tan(r);
  }

  atan(r) {
    return Math.atan(r);
  }

  atan2(r) {
    return Math.atan2(r);
  }

  put_pixel(x, y, color) {
    let graphics = this.graphics;
    graphics.fillStyle(this._getColor(color));
    graphics.fillRect(x, y, 1, 1);

    this.flip();
  }

  get_mouse() {
    const p = this.input.mousePointer;
    return {
      x: parseInt(p.worldX, 10),
      y: parseInt(p.worldY, 10),
      left: p.leftButtonDown(),
      right: p.rightButtonDown(),
    }
  }

  get_keys() {
    return {
      up: this.keys.up.isDown,
      down: this.keys.down.isDown,
      left: this.keys.left.isDown,
      right: this.keys.left.isDown,
      space: this.keys.space.isDown,
    }
  }

  play_sound(index) {
    index = index % this.soundCount || 0;
    index = parseInt(index, 10);
    this.sound.play(`sound-${index}`);
  }

}


export default Scene;
