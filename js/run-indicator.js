import { enviarMensaje, recibirMensaje } from "./bus.js";

class RunIndicator extends HTMLElement {

  connectedCallback() {
    this.createHTML();
    this.connectEvents();
  }

  createHTML() {
    this.innerHTML = `
      <div id="run-indicator" class="barra-cabecera-del-canvas">Detenido</div>
    `;
  }

  connectEvents() {
    const indicator = this.querySelector("#run-indicator");

    recibirMensaje(this, "señal-detener-la-ejecución", () => {
      indicator.innerText = "Detenido";
    });

    recibirMensaje(this, "señal-comenzar-a-ejecutar", () => {
      indicator.innerText = "Ejecutando";
    });

  }
}

export default RunIndicator;
