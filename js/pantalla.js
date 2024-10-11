import Canvas from "./canvas.js";

class Pantalla extends HTMLElement {

  connectedCallback() {
    this.innerHTML = `
      <div id='canvas'></div>
    `;

    this.crearCanvasDePhaser();
    this.conectarEventos();
  }

  crearCanvasDePhaser() {
    const config = {
      type: Phaser.AUTO,
      width: 128,
      height: 128,
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
