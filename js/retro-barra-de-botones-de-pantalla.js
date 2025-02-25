
import { enviarMensaje, recibirMensaje } from "./bus.js";

class BarraDeBotonesDePantalla extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `
      <div id="retro-barra-de-botones-de-pantalla" class=" tr barra-de-botones">
        <retro-boton-pantalla-completa></retro-boton-pantalla-completa>
    `;
  }

  conectarEventos() {
  }

  disconnectedCallback() {
  }
}

export default BarraDeBotonesDePantalla;


