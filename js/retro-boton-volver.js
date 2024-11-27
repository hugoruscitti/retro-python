
import { enviarMensaje, recibirMensaje } from "./bus.js";

class RetroBotonVolver extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `

        <form method="dialog">
          <button>

            <div class="icono">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
              </svg>
            </div>

            Volver al proyecto
          </button>
        </form>
    `;
  }

  conectarEventos() {
  }

  disconnectedCallback() {
  }
}

export default RetroBotonVolver;

