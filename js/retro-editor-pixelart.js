import { enviarMensaje, recibirMensaje } from "./bus.js";

class EditorPixelart extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `
      <button id="abrir-editor">
        <div class="icono">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </div>

        Abrir el editor pixelart
      </button>

      <dialog open>

        <div class="contenedor-editor-pixelart">
          <div>
            <retro-pixelart-canvas></retro-pixelart-canvas>
          </div>
          <div>
            <retro-pixelart-colores></retro-pixelart-colores>
          </div>
        </div>

        <div>
          1 2 3 4
        </div>

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
      </dialog>
    `;
  }

  conectarEventos() {
    const boton = this.querySelector("#abrir-editor");
    const dialogo = this.querySelector("dialog");
    
    boton.addEventListener("click", function() {
      dialogo.showModal();
    });

  }

  disconnectedCallback() {
  }
}

export default EditorPixelart;


