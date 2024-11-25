import { enviarMensaje, recibirMensaje } from "./bus.js";
import { proyecto } from "./proyecto.js";

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

        <span class="ocultar-en-mobile">Abrir el editor pixelart</span>
      </button>

      <dialog>

        <div class="contenedor-editor-pixelart">
          <div>
            <retro-pixelart-canvas></retro-pixelart-canvas>
          </div>
          <div>
            <retro-pixelart-colores></retro-pixelart-colores>
          </div>
        </div>

        <div class="contenedor-canvas-textura">
          <retro-cuadros-de-textura-pixelart></retro-cuadros-de-textura-pixelart>
        </div>

        <retro-boton-volver/>

      </dialog>
    `;
  }

  conectarEventos() {
    const boton = this.querySelector("#abrir-editor");
    const dialogo = this.querySelector("dialog");
    
    boton.addEventListener("click", () => {
      dialogo.showModal();
    });

  }

}

export default EditorPixelart;
