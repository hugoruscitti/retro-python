import Scene from "./scene.js";

class Canvas extends HTMLElement {
  connectedCallback() {
    const config = {
      type: Phaser.AUTO,
      width: 128,
      height: 128,
      backgroundColor: '#777777',
      pixelArt: true,
      scene: Scene
    };

    window.game = new Phaser.Game(config);
  }

  disconnectedCallback() {
  }

}

export default Canvas;
