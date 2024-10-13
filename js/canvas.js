// VER: https://newdocs.phaser.io/docs/3.55.1/Phaser.GameObjects.Graphics
const WIDTH = 256;
const HEIGHT = 256;

class Canvas extends Phaser.Scene {
  constructor() {
    super({ key: "Scene" });
    this.colores = {
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

  obtenerColor(key, defaultValue = 0x000000) {
    const indice = Math.abs(key) % 16;
    const colorFinal = this.colores[indice] || defaultValue;
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

  linea(x, y, x2, y2, color) {
    let graphics = this.graphics;
    graphics.lineStyle(1, this.obtenerColor(color));
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x2, y2);
    graphics.strokePath();

    this.flip();
  }

  pintar(color) {
    this.borrar();
    this.rectangulo(0, 0, 128, 128, color, true);
    /*
    transparencia = transparencia || 0;
    let graphics = this.graphics;

    const opacidad = (transparencia%128)*-0.1 + 1;

    graphics.fillStyle(this.obtenerColor(color), opacidad);
    graphics.fillRect(0, 0, WIDTH, HEIGHT)

    this.flip();
    graphics.fillStyle(this.obtenerColor(color), 1);
    */
  }

  circulo(x, y, radio, color, relleno) {
    let graphics = this.graphics;
    graphics.fillStyle(this.obtenerColor(color));
    graphics.lineStyle(1, this.obtenerColor(color));

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
    graphics.lineStyle(1, this.obtenerColor(color));
    graphics.fillStyle(this.obtenerColor(color));

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
    a = a || 0;
    b = b || 128;

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
    graphics.fillStyle(this.obtenerColor(color));
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
