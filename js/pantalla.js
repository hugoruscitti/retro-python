import Canvas from "./canvas.js";
import CanvasNuevo from "./canvas-nuevo.js";

class Pantalla extends HTMLElement {

  connectedCallback() {
    this.innerHTML = `
      <div class="canvas-container">
        <canvas id="gameCanvas" width="128" height="128"></canvas>
      </div>
    `;

    this.crearCanvas();
    //this.__deprecated__crearCanvasDePhaser();
    this.conectarEventos();
  }

  crearCanvas() {
    const canvas = document.getElementById("gameCanvas");
    const contenedor = document.querySelector("retro-pantalla");

    window.canvas = new CanvasNuevo(canvas, contenedor);
  }

  __deprecated__crearCanvasDePhaser() {
    const config = {
      type: Phaser.AUTO,
      width: 128,
      height: 128,
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      backgroundColor: "#777777",
      pixelArt: true,
      parent: 'canvas',
      scene: Canvas
    };

    window.game = new Phaser.Game(config);
  }

  conectarEventos() {
  }
}

export default Pantalla;
