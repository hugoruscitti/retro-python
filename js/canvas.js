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

    this.variables = {
      mouse_x: 0,
      mouse_y: 0,
      click: false,
      espacio: false,
      izquierda: false,
      derecha: false,
      arriba: false,
      abajo: false,
    };

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

    // Estos 3 objetos son importantes:
    //
    // - graphics se utiliza como buffer para dibujar lineas, círculos y
    // rectángulos. Este objeto asegura que se dibuje usando píxeles y sin
    // ningún tipo de difuminado.
    //
    // - buffer es donde se integrarán todos los dibujados antes de llevarlos a
    // la pantalla
    //
    // - textura es lo que el usuario verá, tener en cuenta que nunca se dibuja
    // directamente acá, sino que la única parte en donde se modifica esta
    // textura es en la función "flip", que se llamar aútomáticamente cuando se
    // invoca a la función "esperar", cuando termina el programa o cuando se
    // completa un ciclo de un bucle como "while".
    
    this.graphics = new Phaser.GameObjects.Graphics(this, WIDTH, HEIGHT);
    this.buffer = new Phaser.GameObjects.RenderTexture(this, 0, 0, WIDTH, HEIGHT).setOrigin(0, 0);
    this.textura = this.add.renderTexture(0, 0, WIDTH, HEIGHT).setOrigin(0, 0);

    this.cargarFuentes();
    this.conectarEventosDeTeclado();
  }

  cargarFuentes() {
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
  }

  conectarEventosDeTeclado() {
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

  // función interna para volcar los gráficos sobre la textura
  // principal que será visible por el usuario.
  flip() {
    this.textura.clear();
    this.textura.draw(this.buffer);
  }

  print(texto, color, x, y) {
    const indice = this.obtenerIndiceDeColor(color);
    this.objetosTexto[indice].text = texto
      
    if (x === undefined && y === undefined) {
      this.buffer.draw(this.objetosTexto[indice], 0, this.posicionUltimoPrint);
    } else {
      this.buffer.draw(this.objetosTexto[indice], x, y);
    }

    if (this.posicionUltimoPrint > 120) {
      this.posicionUltimoPrint = 0;
    } else {
      this.posicionUltimoPrint += 10
    }
  }

  linea(x, y, x2, y2, color) {
    this.graphics.lineStyle(1, this.obtenerColor(color));
    this.graphics.beginPath();
    this.graphics.moveTo(x, y);
    this.graphics.lineTo(x2, y2);
    this.graphics.strokePath();
    this.buffer.draw(this.graphics);
    this.graphics.clear();
  }

  pintar(color) {
    this.rectangulo(0, 0, 128, 128, color, true);
  }

  circulo(x, y, radio, color, relleno) {
    this.graphics.fillStyle(this.obtenerColor(color));
    this.graphics.lineStyle(1, this.obtenerColor(color));

    if (relleno) {
      this.graphics.fillCircle(x, y, radio);
    } else {
      this.graphics.strokeCircle(x, y, radio);
    }
    this.buffer.draw(this.graphics);
    this.graphics.clear();
  }

  dibujar(indice, x, y) {
    indice = Math.floor(Math.abs(indice || 0)) % (16*5);

    this.buffer.drawFrame("sprites", indice, x-4, y-4);
  }

  rectangulo(x, y, width, height, color, relleno) {
    this.graphics.lineStyle(1, this.obtenerColor(color));
    this.graphics.fillStyle(this.obtenerColor(color));

    if (relleno) {
      this.graphics.fillRect(x, y, width, height);
    } else {
      this.graphics.strokeRect(x, y, width, height);
    }

    this.buffer.draw(this.graphics);
    this.graphics.clear();
  }

  borrar() {
    this.buffer.clear();
    this.graphics.clear();
    this.textura.clear();
    this.posicionUltimoPrint=0
  }

  azar(a, b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
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
    this.graphics.fillStyle(this.obtenerColor(color));
    this.graphics.fillRect(x, y, 1, 1);
    this.buffer.draw(this.graphics);
    this.graphics.clear();
  }

  update() {
    const p = this.input.mousePointer;

    this.variables = {
      mouse_y: parseInt(p.worldY, 10),
      mouse_x: parseInt(p.worldX, 10),
      click: p.leftButtonDown(),
      espacio: this.keys['space'],
      izquierda: this.keys['left'],
      derecha: this.keys['right'],
      arriba: this.keys['up'],
      abajo: this.keys['down'],
    }

  }

  sonido(indice) {
    let tipo = "random";
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
      indice = Math.floor(Math.abs(indice)) % tiposDeSonidos.length;
      tipo = tiposDeSonidos[indice];
    }

    const sonido = sfxr.generate(tipo);
    sfxr.play(sonido);
  }

  distancia(x1, y1, x2, y2) {
    const a = x1 - x2;
    const b = y1 - y2;
    return parseInt(Math.sqrt(a*a + b*b), 10);
  }
}

export default Canvas;
