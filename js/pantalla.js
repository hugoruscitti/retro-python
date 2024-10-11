import Canvas from "./canvas.js";
import { backgroundColor } from "./constants.js";

const WIDTH = 128;
const HEIGHT = 128;

class Pantalla extends HTMLElement {

  connectedCallback() {
    this.innerHTML = `
      <div id='canvas'></div>
    `;

    this.createPhaserInstance();
    this.connectEvents();
  }

  createPhaserInstance() {
    const config = {
      type: Phaser.AUTO,
      width: WIDTH,
      height: HEIGHT,
      backgroundColor: backgroundColor,
      pixelArt: true,
      parent: 'canvas',
      scene: Canvas
    };

    window.game = new Phaser.Game(config);
  }

  connectEvents() {
  }
}

export default Pantalla;
