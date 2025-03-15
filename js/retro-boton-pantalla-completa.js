import { enviarMensaje, recibirMensaje } from "./bus.js";

class RetroBotonPantallaCompleta extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `
      <button id="boton-pantalla-completa">
        <div class="icono">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </div>
      </button>
    `;
  }

  conectarEventos() {
    const boton = this.querySelector("#boton-pantalla-completa");

    boton.addEventListener("click", function() {
      const el = document.querySelector('retro-pantalla');

      if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen();
      } else {
        el.mozRequestFullScreen();
      }

    });
  }

  disconnectedCallback() {
  }
}

export default RetroBotonPantallaCompleta;
