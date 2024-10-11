
import { sendMessage, getMessage } from "./bus.js";

class BarraDeBotones extends HTMLElement {

  connectedCallback() {
    this.createHTML();
    this.connectEvents();
  }

  createHTML() {
    this.innerHTML = `
      <div id="retro-barra-de-botones">
      </div>
    `;
  }

  connectEvents() {
  }

  disconnectedCallback() {
  }
}

export default BarraDeBotones;


