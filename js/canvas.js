import Scene from "./scene.js";

class Canvas extends HTMLElement {

  connectedCallback() {
    this.innerHTML = "<div id='canvas'></div>";
    const config = {
      type: Phaser.AUTO,
      width: 128,
      height: 128,
      backgroundColor: '#777777',
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
