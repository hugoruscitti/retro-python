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

    //window.asd_imagen = 'data:image/png;base64,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';
    //this.load.image("sprites", window.asd_imagen);
    
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

  dibujar(indice, x, y) {
    let renderTexture = this.renderTexture;
    renderTexture.drawFrame("sprites", indice, x-4, y-4);
    this.flip();
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

  cargar_imagenes(imagenBase64) {
    this.load.image("sprites", imagenBase64);
    this.load.start();
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
