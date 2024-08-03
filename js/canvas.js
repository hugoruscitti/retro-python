import Scene from "./scene.js";
import { backgroundColor } from "./constants.js";

const WIDTH = 256;
const HEIGHT = 256;

class Canvas extends HTMLElement {

  connectedCallback() {
    this.innerHTML = "<div id='canvas'></div><div><button id='scale-1'>1:1</button><button id='scale-2'>2:1</button></div>";
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
      scene: Scene
    };

    window.game = new Phaser.Game(config);
  }

  connectEvents() {
    this.querySelector("#scale-1").addEventListener("click", () => {
      this.changeScale(1);
    });

    this.querySelector("#scale-2").addEventListener("click", () => {
      this.changeScale(2);
    });
  }

  changeScale(scale) {
    const panel = document.querySelector("#result-panel");

    if (scale == 1) {
      panel.style.width = 256;
    }

    if (scale == 2) {
      panel.style.width = 512;
    }
  }


}

export default Canvas;
