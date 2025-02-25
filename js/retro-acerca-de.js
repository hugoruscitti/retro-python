
import { enviarMensaje, recibirMensaje } from "./bus.js";

class AcercaDe extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `
    <button id="retro-acerca-de">

      <div class="icono">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      </div>


      <span class="ocultar-en-mobile">Acerca de...</span>
    </button>

      <dialog id="dialogo-acerca-de" class="texto pa3">
        <p>retro-python es una aplicación para fomentar
        la creatividad. Te permite crear dibujos, animaciones
        y videojuegos utilizando código en un lenguaje
        de programación hermoso llamado python.
        </p>

        <p>La herramienta está siendo desarrollada
        por mí, Hugo Ruscitti, que escribo sobre este
        proyecto y otros
        (como <a href="https://pilas-engine.com.ar" target="_blank">pilas-engine</a>)
        en mi
        <a href="https://examplelab.com.ar" target="_blank">blog</a>.
        </p>

        <p>

            <div>
              <a class="repository-link" href="https://github.com/hugoruscitti/retro-python" target="_black">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m0 0h24v24h-24z" fill="#fff" opacity="0"/>
                  <path d="m16.24 22a1 1 0 0 1 -1-1v-2.6a2.15 2.15 0 0 0 -.54-1.66 1 1 0 0 1 .61-1.67c2.44-.29 4.69-1.07 4.69-5.3a4 4 0 0 0 -.67-2.22 2.75 2.75 0 0 1 -.41-2.06 3.71 3.71 0 0 0 0-1.41 7.65 7.65 0 0 0 -2.09 1.09 1 1 0 0 1 -.84.15 10.15 10.15 0 0 0 -5.52 0 1 1 0 0 1 -.84-.15 7.4 7.4 0 0 0 -2.11-1.09 3.52 3.52 0 0 0 0 1.41 2.84 2.84 0 0 1 -.43 2.08 4.07 4.07 0 0 0 -.67 2.23c0 3.89 1.88 4.93 4.7 5.29a1 1 0 0 1 .82.66 1 1 0 0 1 -.21 1 2.06 2.06 0 0 0 -.55 1.56v2.69a1 1 0 0 1 -2 0v-.57a6 6 0 0 1 -5.27-2.09 3.9 3.9 0 0 0 -1.16-.88 1 1 0 1 1 .5-1.94 4.93 4.93 0 0 1 2 1.36c1 1 2 1.88 3.9 1.52a3.89 3.89 0 0 1 .23-1.58c-2.06-.52-5-2-5-7a6 6 0 0 1 1-3.33.85.85 0 0 0 .13-.62 5.69 5.69 0 0 1 .33-3.21 1 1 0 0 1 .63-.57c.34-.1 1.56-.3 3.87 1.2a12.16 12.16 0 0 1 5.69 0c2.31-1.5 3.53-1.31 3.86-1.2a1 1 0 0 1 .63.57 5.71 5.71 0 0 1 .33 3.22.75.75 0 0 0 .11.57 6 6 0 0 1 1 3.34c0 5.07-2.92 6.54-5 7a4.28 4.28 0 0 1 .22 1.67v2.54a1 1 0 0 1 -.94 1z" fill="color"/>
                </svg>
              </a>
      </div>
        </p>

        <form method="dialog">
          <button>
            <div class="icono">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
              </svg>
            </div>
            Volver
          </button>
        </form>
      </dialog>
    `;
  }

  conectarEventos() {
    const boton = this.querySelector("#retro-acerca-de");
    const dialogo = this.querySelector("#dialogo-acerca-de");

    boton.addEventListener("click", function() {
      dialogo.showModal();
    });

    // permite cerrar el diálogo si hacen click fuera del area principal.
    dialogo.addEventListener("click", (evento) => {
      if (evento.target.tagName  === "DIALOG") {
        dialogo.close();
      }
    });
  }

  disconnectedCallback() {
  }
}

export default AcercaDe;


