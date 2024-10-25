
import { enviarMensaje, recibirMensaje } from "./bus.js";

class BarraDeBotones extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `
      <div id="retro-barra-de-botones" class="barra-de-botones">
        <retro-run-button></retro-run-button>
        <retro-boton-publicar></retro-boton-publicar>
        <retro-configuracion></retro-configuracion>
    `;
  }

  conectarEventos() {
  }

  disconnectedCallback() {
  }
}

export default BarraDeBotones;


