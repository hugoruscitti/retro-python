import { enviarMensaje, recibirMensaje } from "./bus.js";
import { HOST } from "./configuracion.js";


class RetroComentarios extends HTMLElement {

  connectedCallback() {
    this.ejemplosCargados = false;
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `

      <button id="abrir-comentarios">
        <div class="icono">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
        </div>

        <span class="ocultar-en-mobile">Comentario</span>
      </button>

      <dialog>

        <div class="contenedor-de-comentarios">

          <div id='iframe'></div>

          <retro-boton-volver/>

        </div>

      </dialog>

    `;

    this.codigoIframe = `
        <iframe 
           src="https://docs.google.com/forms/d/e/1FAIpQLSfxuF2nR8hRCN_SwgC1xXiYtOVnly0uuYlUa0z0Q3kGhmZ5kQ/viewform?embedded=true&hl=es"
           width="900"
           height="400"
           frameborder="1"
           marginheight="0"
           marginwidth="0">Cargando ...</iframe>
    `;
  }

  conectarEventos() {
    const boton = this.querySelector("#abrir-comentarios");
    const dialogo = this.querySelector("dialog");

    boton.addEventListener("click", () => {
      const contenedorIframe = this.querySelector("#iframe");
      dialogo.showModal();
      contenedorIframe.innerHTML = this.codigoIframe;
    });

    dialogo.addEventListener("click", (evento) => {
      if (evento.target.tagName  === "DIALOG") {
        dialogo.close();
      }
    });
  }

}

export default RetroComentarios;


