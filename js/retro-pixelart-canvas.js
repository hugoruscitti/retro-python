
import { enviarMensaje, recibirMensaje } from "./bus.js";

class PixelartCanvas extends HTMLElement {

  connectedCallback() {
    this.createHTML();
    this.connectEvents();
  }

  createHTML() {
    this.innerHTML = `
      canvas
    `;
  }

  connectEvents() {
  }

  disconnectedCallback() {
  }
}

export default PixelartCanvas;


