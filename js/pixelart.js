// VER: https://newdocs.phaser.io/docs/3.55.1/Phaser.GameObjects.Graphics
import { enviarMensaje, recibirMensaje } from "./bus.js";

class Pixelart extends Phaser.Scene {
  constructor() {
    super({ key: "Pixelart" });
    this.colores = {
      0: "#000000",
      1: "#1D2B53",
      2: "#7E2553",
      3: "#008751",
      4: "#AB5236",
      5: "#5F574F",
      6: "#C2C3C7",
      7: "#FFF1E8",
      8: "#FF004D",
      9: "#FFA300",
      10: "#FFEC27",
      11: "#00E436",
      12: "#29ADFF",
      13: "#83769C",
      14: "#FF77A8",
      15: "#FFCCAA"
    }
  }

  obtenerColor(key, defaultValue = 0x000000) {
    const indice = Math.abs(key) % 16;
    return this.colores[indice];
  }

  preload() {
    //this.graphics = this.add.graphics();

    this.canvas = this.textures.createCanvas('canvas', 128, 128);
    this.c = this.canvas.context;

    // este sprite es el que verá el usuario, y tiene el canvas
    // como textura.
    this.add.image(0, 0, 'canvas').setOrigin(0, 0);
  }

  create() {
    let color = 0;

    // desactiva el menú para permitir dibujar con los dos
    // botones de mouse.
    this.input.mouse.disableContextMenu();

    recibirMensaje(this, "señal-en-el-editor-de-pixelart-se-elige-un-color", (data) => {
      color = data.color;
    });

    this.input.on("pointerdown", (pointer) => {
      const x = pointer.x;
      const y = pointer.y;

      if (pointer.rightButtonDown()) {
        this.borrarPixel(x, y);
      } else {
        this.pixel(x, y, color);
      }

    });


    this.input.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        const x = pointer.x;
        const y = pointer.y;

        if (pointer.rightButtonDown()) {
          this.borrarPixel(x, y);
        } else {
          this.pixel(x, y, color);
        }
      }
    });
  }

  pixel(x, y, color) {
    x = Math.floor(x);
    y = Math.floor(y);

    this.c.fillStyle = this.obtenerColor(color);
    this.c.fillRect(x, y, 1, 1);
    this.canvas.refresh();
  }

  borrarPixel(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    this.c.clearRect(x, y, 1, 1);
    this.canvas.refresh();
  }

}


export default Pixelart;
