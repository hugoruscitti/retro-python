import Scene from "./scene.js";
import { canvasHeight, canvasWidth, backgroundColor } from "./constants.js";

class Canvas extends HTMLElement {

  connectedCallback() {
    this.innerHTML = "<div id='canvas'></div>";
    const config = {
      type: Phaser.AUTO,
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: backgroundColor,
      pixelArt: true,
      parent: 'canvas',
      scene: Scene
    };

    window.game = new Phaser.Game(config);
  }

  disconnectedCallback() {
  }

}

export default Canvas;
