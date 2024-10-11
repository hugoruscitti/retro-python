// VER: https://newdocs.phaser.io/docs/3.55.1/Phaser.GameObjects.Graphics
class Pixelart extends Phaser.Scene {
  constructor() {
    super({ key: "Pixelart" });
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
  }

  obtenerColor(key, defaultValue = 0x000000) {
    const indice = Math.abs(key) % 16;
    const colorFinal = this.colores[indice] || defaultValue;
    return colorFinal;
  }

  preload() {
    this.graphics = this.add.graphics();
  }

  create() {
    //window.canvas = this;
    //window.dispatchEvent(new CustomEvent("onload-phaserjs", { detail: { } }));
  
    // desactiva el menú para permitir dibujar con los dos
    // botones de mouse.
    this.input.mouse.disableContextMenu();

    this.input.on("pointerdown", (pointer) => {
      const x = pointer.x;
      const y = pointer.y;

      if (pointer.rightButtonDown()) {
        //this.pixel(x, y, 2);
        this.limpiar(x, y);
      } else {
        this.pixel(x, y, 1);
      }

    });

    this.input.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        const x = pointer.x;
        const y = pointer.y;

        if (pointer.rightButtonDown()) {
          this.pixel(x, y, 2);
        } else {
          this.pixel(x, y, 1);
        }
      }
    });
  }

  pixel(x, y, color) {
    let graphics = this.graphics;
    graphics.lineStyle(1, this.obtenerColor(color));
    graphics.strokeRect(x, y, 0, 0);
  }

  limpiar(x, y) {
    this.graphics.clear(x, y, 1, 1, false);
  }

}


export default Pixelart;
