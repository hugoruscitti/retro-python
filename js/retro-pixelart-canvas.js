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
      zoom: 32,
      parent: 'canvas-pixelart',
      scene: Pixelart
    };

    this.pixelart = new Phaser.Game(config);
  }

  conectarEventos() {
    recibirMensaje(this, "señal-selecciona-sprite-en-canvas-textura", (datos) => {
      const escena = this.pixelart.scene.scenes[0];
      escena.pintarCuadro(datos);
    });

    recibirMensaje(this, "señal-alternar-fondo-transparente", (datos) => {
      const fondo = this.querySelector("#canvas-pixelart");
      const colorClaro =  "rgb(187, 187, 187)";
      const colorOscuro =  "rgb(0, 0, 0)";

      if (fondo.style.backgroundColor === colorClaro || !fondo.style.backgroundColor) {
        fondo.style.backgroundColor = colorOscuro;
      } else {
        fondo.style.backgroundColor = colorClaro;
      }
    });
  }

  disconnectedCallback() {
  }
}

export default PixelartCanvas;


