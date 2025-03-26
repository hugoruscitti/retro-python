import { enviarMensaje, recibirMensaje } from "./bus.js";
import { HOST } from "./configuracion.js";
import { cargarProyecto } from "./utils.js";


class RetroEjemplos extends HTMLElement {

  connectedCallback() {
    this.ejemplosCargados = false;
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `

      <button id="abrir-ejemplos">
        <div class="icono">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
          </svg>
        </div>

        <span class="ocultar-en-mobile">Ver ejemplos</span>
      </button>

      <dialog>
        <div class="contenedor-de-ejemplos">
          <div id="contenido-de-ejemplos"></div>
          <retro-boton-volver/>
        </div>
      </dialog>

    `;

    this.HTMLCargando = `

          <div class="dialogo-publicar-contenido-cargando">
            <div>
                <svg width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <style>.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}@keyframes spinner_AtaB{100%{transform:rotate(360deg)}}</style>
                  <path fill="black" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
                  <path fill="black" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_ajPY"/>
                </svg>
            </div>

            <div class="pa">
              Cargando ...
            </div>
          </div>
`
  }

  conectarEventos() {
    const boton = this.querySelector("#abrir-ejemplos");
    const dialogo = this.querySelector("dialog");
    const contenedor = this.querySelector("#contenido-de-ejemplos");

    boton.addEventListener("click", () => {
      dialogo.showModal();
      enviarMensaje(this, "señal-detener-la-ejecución");

      if (!this.ejemplosCargados) {
        this.cargarEjemplos();
      }
    });

    dialogo.addEventListener("click", (evento) => {
      if (evento.target.tagName  === "DIALOG") {
        dialogo.close();
      }
    });

    contenedor.addEventListener("click", async (evento) => {
      if (evento.target.tagName == "IMG") {
        const hash = evento.target.parentNode.dataset.hash;
        const data = await cargarProyecto(hash);
        enviarMensaje(this, "señal-detener-la-ejecución");
        enviarMensaje(this, "señal-cargar-proyecto", data);
        dialogo.close();
        enviarMensaje(this, "señal-comenzar-a-ejecutar");
        const url = `${window.location.origin}${window.location.pathname}?proyecto=${data.hash}`;
        window.history.replaceState({}, "retro-python", url);
      }
    });
  }


  async cargarEjemplos() {
    const contenido = this.querySelector("#contenido-de-ejemplos");
    contenido.innerHTML = this.HTMLCargando;

    const respuesta = await this.solicitarListaDeEjemplosAlServidor();

    const ejemplosComoHTML = respuesta.ejemplos.map((e) => {
      return `
        <div>
          <a href="#" data-hash="${e.hash}">
            <img class="bg-light-gray" src="${e.screenshot}">
          </a>
        </div>
      `;
    });

    contenido.innerHTML = "<div class='contenedor-de-grilla-de-ejemplos'>" + ejemplosComoHTML.join("\n") + "</div>";
  }

  solicitarListaDeEjemplosAlServidor() {
    return new Promise((success, error) => {
      const url = `${HOST}/ejemplos`;
      fetch(url)
        .then(resolve => resolve.json())
        .then(data => {
          success(data);
        })
        .catch((err) => {
          error(err);
        });
    });
  }


  disconnectedCallback() {
  }
}

export default RetroEjemplos;


