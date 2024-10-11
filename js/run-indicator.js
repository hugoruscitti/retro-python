import { sendMessage, getMessage } from "./bus.js";

class RunIndicator extends HTMLElement {

  connectedCallback() {
    this.createHTML();
    this.connectEvents();
  }

  createHTML() {
    this.innerHTML = `
      <div id="run-indicator" class="dib">Detenido</div>
    `;
  }

  connectEvents() {
    const indicator = this.querySelector("#run-indicator");

    getMessage(this, "señal-detener-la-ejecución", () => {
      indicator.innerText = "Detenido";
    });

    getMessage(this, "señal-comenzar-a-ejecutar", () => {
      indicator.innerText = "Ejecutando";
    });

  }
}

export default RunIndicator;
