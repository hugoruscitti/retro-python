import { enviarMensaje, recibirMensaje } from "./bus.js";

class RunIndicator extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `
      <div id="run-indicator" class="barra-cabecera-del-canvas">Detenido</div>
    `;
  }

  conectarEventos() {
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
