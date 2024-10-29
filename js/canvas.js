// VER: https://newdocs.phaser.io/docs/3.55.1/Phaser.GameObjects.Graphics
const WIDTH = 128;
const HEIGHT = 128;

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

    this.posicionUltimoPrint = 0
  }

  obtenerColor(key, defaultValue = 0x000000) {
    const indice = this.obtenerIndiceDeColor(key)
    const colorFinal = this.colores[indice] || defaultValue;
    return colorFinal;
  }

  obtenerIndiceDeColor(numero) {
    return Math.floor(Math.abs(numero || 0)) % 16;
  }

  setKeymap(keyCode, name, attribute, value) {
    if (keyCode === name) {
      this.keys[attribute] = value;
    }
  }

  preload() {
    this.graphics = new Phaser.GameObjects.Graphics(this, WIDTH, HEIGHT);
    this.renderTexture = this.add.renderTexture(0, 0, WIDTH, HEIGHT).setOrigin(0, 0);

    const xml = "/static/recursos/fuente.jpg";

    this.load.bitmapFont("fuente-0", "/static/recursos/fuente-0.png", xml);
    this.load.bitmapFont("fuente-1", "/static/recursos/fuente-1.png", xml);
    this.load.bitmapFont("fuente-2", "/static/recursos/fuente-2.png", xml);
    this.load.bitmapFont("fuente-3", "/static/recursos/fuente-3.png", xml);
    this.load.bitmapFont("fuente-4", "/static/recursos/fuente-4.png", xml);
    this.load.bitmapFont("fuente-5", "/static/recursos/fuente-5.png", xml);
    this.load.bitmapFont("fuente-6", "/static/recursos/fuente-6.png", xml);
    this.load.bitmapFont("fuente-7", "/static/recursos/fuente-7.png", xml);
    this.load.bitmapFont("fuente-8", "/static/recursos/fuente-8.png", xml);
    this.load.bitmapFont("fuente-9", "/static/recursos/fuente-9.png", xml);
    this.load.bitmapFont("fuente-10", "/static/recursos/fuente-10.png", xml);
    this.load.bitmapFont("fuente-11", "/static/recursos/fuente-11.png", xml);
    this.load.bitmapFont("fuente-12", "/static/recursos/fuente-12.png", xml);
    this.load.bitmapFont("fuente-13", "/static/recursos/fuente-13.png", xml);
    this.load.bitmapFont("fuente-14", "/static/recursos/fuente-14.png", xml);
    this.load.bitmapFont("fuente-15", "/static/recursos/fuente-15.png", xml);


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
    this.objetosTexto = {
      0: this.add.bitmapText(-1000, 0, "fuente-0",  ""),
      1: this.add.bitmapText(-1000, 0, "fuente-1",  ""),
      2: this.add.bitmapText(-1000, 0, "fuente-2",  ""),
      3: this.add.bitmapText(-1000, 0, "fuente-3",  ""),
      4: this.add.bitmapText(-1000, 0, "fuente-4",  ""),
      5: this.add.bitmapText(-1000, 0, "fuente-5",  ""),
      6: this.add.bitmapText(-1000, 0, "fuente-6",  ""),
      7: this.add.bitmapText(-1000, 0, "fuente-7",  ""),
      8: this.add.bitmapText(-1000, 0, "fuente-8",  ""),
      9: this.add.bitmapText(-1000, 0, "fuente-9",  ""),
      10: this.add.bitmapText(-1000, 0, "fuente-10",  ""),
      11: this.add.bitmapText(-1000, 0, "fuente-11",  ""),
      12: this.add.bitmapText(-1000, 0, "fuente-12",  ""),
      13: this.add.bitmapText(-1000, 0, "fuente-13",  ""),
      14: this.add.bitmapText(-1000, 0, "fuente-14",  ""),
      15: this.add.bitmapText(-1000, 0, "fuente-15",  ""),
    }
  }

  // función interna para volcar los gráficos sobre
  // el buffer principal.
  flip() {
    this.renderTexture.draw(this.graphics);
  }

  print(texto, color, x, y) {
    const indice = this.obtenerIndiceDeColor(color);
    this.objetosTexto[indice].text = texto
      
    if (x === undefined && y === undefined) {
      this.renderTexture.draw(this.objetosTexto[indice], 0, this.posicionUltimoPrint);
    } else {
      this.renderTexture.draw(this.objetosTexto[indice], x, y);
    }

    if (this.posicionUltimoPrint > 120) {
      this.posicionUltimoPrint = 0;
      //this.renderTexture.draw(this.renderTexture, 0, -10);
    } else {
      this.posicionUltimoPrint += 10
    }
  }

  linea(x, y, x2, y2, color) {
    let graphics = this.graphics;

    graphics.lineStyle(1, this.obtenerColor(color));
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x2, y2);
    graphics.strokePath();


    this.flip();
    graphics.clear();
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
    // si encuentra que en lugar de un índice numérico se
    // envía una lista, entonces permite hacer una animación
    // usando como variable auxiliar el 'cuadro' o contador
    // del bucle principal.
    if (indice._type && indice._type == "list") {
      const i = window.cuadro % indice.length;
      indice = indice[i];
    }
    
    indice = Math.floor(Math.abs(indice || 0)) % (16*5);

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
    this.posicionUltimoPrint=0
  }

  azar(a, b) {
    a = a || 0;
    b = b || 128;

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
    graphics.fillStyle(this.obtenerColor(color));
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

  sonido() {
    // todo
  }

  update() {
    const p = this.input.mousePointer;

    window.espacio = this.keys['space'];
    window.izquierda = this.keys['left'];
    window.derecha = this.keys['right'];
    window.arriba = this.keys['up'];
    window.abajo = this.keys['down'];

    window.mouse_x = parseInt(p.worldX, 10);
    window.mouse_y = parseInt(p.worldY, 10);

    window.click = p.leftButtonDown();
  }

  sonido(indice) {
    let configuracion = "random";

    const tiposDeSonidos = [
      "pickupCoin",
      "laserShoot",
      "explosion",
      "powerUp",
      "hitHurt",
      "jump",
      "blipSelect",
      "synth",
      "tone",
      "click",
    ]

    if (indice !== undefined) {
      indice = Math.floor(Math.abs(indice)) % 10;
    }

    const sonido = sfxr.generate(configuracion);
    sfxr.play(sonido);
  }
}

export default Canvas;
