
import { enviarMensaje, recibirMensaje } from "./bus.js";

class BarraDeBotones extends HTMLElement {

  connectedCallback() {
    this.createHTML();
    this.connectEvents();
  }

  createHTML() {
    this.innerHTML = `
      <div id="retro-barra-de-botones" class="barra-de-botones">
        <retro-run-button></retro-run-button>
        <retro-boton-exportar></retro-boton-exportar>

        <retro-ejemplos></retro-ejemplos>
        <retro-settings></retro-settings>
    `;
  }

  connectEvents() {
  }

  disconnectedCallback() {
  }
}

export default BarraDeBotones;


