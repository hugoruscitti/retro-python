// VER: https://newdocs.phaser.io/docs/3.55.1/Phaser.GameObjects.Graphics

class Scene extends Phaser.Scene
{
  preload() {
    this.graphics = this.add.graphics(200, 200);
  }

  create() {
    window.canvas = this;
    window.dibujar = () => {this.dibujar();};
  }

  dibujar(x, y, x2, y2) {
    let graphics = this.graphics;

    graphics.lineStyle(1, 0x00ff00);
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x2, y2);
    graphics.strokePath();
  }

  clear() {
    let graphics = this.graphics;
    graphics.clear();
  }
}

export default Scene;
