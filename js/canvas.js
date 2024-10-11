// VER: https://newdocs.phaser.io/docs/3.55.1/Phaser.GameObjects.Graphics
const WIDTH = 256;
const HEIGHT = 256;

class Canvas extends Phaser.Scene {
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
    const indice = Math.abs(key) % 16;
    const colorFinal = this.bitColors[indice] || defaultValue;
    return colorFinal;
  }

  setKeymap(keyCode, name, attribute, value) {
    if (keyCode === name) {
      this.keys[attribute] = value;
    }
  }

  preload() {
    this.graphics = new Phaser.GameObjects.Graphics(this, WIDTH, HEIGHT);
    this.renderTexture = this.add.renderTexture(0, 0, WIDTH, HEIGHT).setOrigin(0, 0);

    this.keys = {
      space: false,
      up: false,
      down: false,
      left: false,
      right: false,
    }

    this.input.keyboard.on('keydown', event => {
      this.setKeymap(event.code, "Space", "space", true);
      this.setKeymap(event.code, "ArrowUp", "up", true);
      this.setKeymap(event.code, "ArrowDown", "down", true);
      this.setKeymap(event.code, "ArrowLeft", "left", true);
      this.setKeymap(event.code, "ArrowRight", "right", true);
    });
    
    this.input.keyboard.on('keyup', event => {
      this.setKeymap(event.code, "Space", "space", false);
      this.setKeymap(event.code, "ArrowUp", "up", false);
      this.setKeymap(event.code, "ArrowDown", "down", false);
      this.setKeymap(event.code, "ArrowLeft", "left", false);
      this.setKeymap(event.code, "ArrowRight", "right", false);
    });

    console.warn("Desactivando la carga de imágenes");
    /*
    for (let i=0; i<this.spriteCount; i++) {
      this.load.image(`sprite-${i}`, `./static/sprites/sprite-${i}.png`);
    }

    for (let i=0; i<this.soundCount; i++) {
      this.load.audio(`sound-${i}`, `./static/sounds/sound-${i}.wav`);
    }
    */

  }

  create() {
    window.canvas = this;
    window.dispatchEvent(new CustomEvent("onload-phaserjs", { detail: { } }));
  }

  // función interna para volcar los gráficos sobre
  // el buffer principal.
  flip() {
    this.renderTexture.draw(this.graphics);
  }

  // convierte una coordenada cartesiana en una coordenada de pantalla
  convertirCoordenada(x, y) {
    return {x: x+64, y: 64-y}
  }

  linea(x, y, x2, y2, color) {
    let graphics = this.graphics;
    graphics.lineStyle(1, this._getColor(color));
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x2, y2);
    graphics.strokePath();

    this.flip();
  }

  pintar(color, opacity) {
    opacity = opacity || 1;
    let graphics = this.graphics;

    graphics.fillStyle(this._getColor(color), opacity);
    graphics.fillRect(0, 0, WIDTH, HEIGHT)
    graphics.strokePath();

    this.flip();
  }

  circulo(x, y, radio, color, relleno) {
    let graphics = this.graphics;
    graphics.fillStyle(this._getColor(color));
    graphics.lineStyle(1, this._getColor(color));

    if (relleno) {
      graphics.fillCircle(x, y, radio);
    } else {
      graphics.strokeCircle(x, y, radio);
    }

    this.flip();
  }

  dibujar(x, y, index) {
    index = index % this.spriteCount || 0;
    index = parseInt(index, 10);
    let renderTexture = this.renderTexture;
    renderTexture.draw(`sprite-${index}`, x, y);
  }

  rectangulo(x, y, width, height, color, relleno) {
    let graphics = this.graphics;
    graphics.lineStyle(1, this._getColor(color));
    graphics.fillStyle(this._getColor(color));

    if (relleno) {
      graphics.fillRect(x, y, width, height);
    } else {
      graphics.strokeRect(x, y, width, height);
    }

    this.flip();
  }

  borrar() {
    let graphics = this.graphics;
    let renderTexture = this.renderTexture;
    graphics.clear();
    renderTexture.clear();
  }

  azar(a, b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
  }

  random() {
    return Math.random();
  }

  seno(r) {
    return Math.sin(r);
  }

  coseno(r) {
    return Math.cos(r);
  }

  tangente(r) {
    return Math.tan(r);
  }

  arcotangente(r) {
    return Math.atan(r);
  }

  arcotangente2(r) {
    return Math.atan2(r);
  }

  pixel(x, y, color) {
    let graphics = this.graphics;
    graphics.fillStyle(this._getColor(color));
    graphics.fillRect(x, y, 2, 2);
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
      space: this.keys['space'],
      up: this.keys['up'],
      down: this.keys['down'],
      left: this.keys['left'],
      right: this.keys['right'],
    }
  }

  play_sound(index) {
    index = index % this.soundCount || 0;
    index = parseInt(index, 10);
    this.sound.play(`sound-${index}`);
  }

}


export default Canvas;
