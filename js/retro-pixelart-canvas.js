import { enviarMensaje, recibirMensaje } from "./bus.js";
import Pixelart from "./pixelart.js";

class PixelartCanvas extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `
      <div id='canvas-pixelart'></div>
    `;
    this.crearCanvasDePhaser();
  }

  crearCanvasDePhaser() {
    const config = {
      type: Phaser.AUTO,
      width: 8,
      height: 8,
      pixelArt: true,
      transparent: true,
      parent: 'canvas-pixelart',
      scene: Pixelart
    };

    this.pixelart = new Phaser.Game(config);
  }

  conectarEventos() {
    recibirMensaje(this, "señal-selecciona-sprite-en-canvas-textura", (data) => {
      const escena = this.pixelart.scene.scenes[0];
      escena.cambiarSprite(data.indice);
    });
  }

  disconnectedCallback() {
  }
}

export default PixelartCanvas;


