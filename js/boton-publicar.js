import { enviarMensaje } from "./bus.js";
import { proyecto } from "./proyecto.js";
import { HOST } from "./configuracion.js";

class BotonPublicar extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `
      <button class="btn-icon btn-icon-share" id="publicar">
        <div class="icono">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
          </svg>
        </div>

        <span class="ocultar-en-mobile">Publicar</span>
      </button>

      <dialog id="dialogo-publicar">

        <div id="cargador" class="dialogo-publicar-contenido">
          <div class="dialogo-publicar-contenido-cargando">
            <div>
                <svg width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <style>.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}@keyframes spinner_AtaB{100%{transform:rotate(360deg)}}</style>
                  <path fill="black" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
                  <path fill="black" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_ajPY"/>
                </svg>
            </div>

            <div class="pa">
              Publicando ...
            </div>
          </div>
        </div>

        <div id="resultado" class="dn dialogo-publicar-contenido"> 

          <div>
            ¡Tu creación ya está lista para compartir!
          </div>

          <div class="pa">
            <img id="imagen-del-juego-publicado" src="">
          </div>

          <div class="pa">
            <div id="qrcode">
            </div>
          </div>

          <div>
            También podés <a href="#" target"_blank" id="link" class="link-copiar">publicar este link</a> para compartirlo.
          </div>

        </div>


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
      <dialog>

    `;
  }

  conectarEventos() {
    const publicar = document.querySelector("#publicar");
    const dialogo = document.querySelector("#dialogo-publicar");
    const qr = document.querySelector("#qrcode");

    this.qrcode = new QRCode(qr, {
      width: 128,
      height: 128,
      text: "https://retro-python.com.ar"
    });


    publicar.addEventListener("click", () => {
      this.publicar();
      dialogo.showModal();
    });

  }

  async publicar() {
    const data = proyecto.obtenerProyectoCompleto();
    const screenshot = await this.capturarPantalla();

    const imagen = document.querySelector("#imagen-del-juego-publicado");
    imagen.src = screenshot;
    data.screenshot = screenshot;

    const { hash } = await this.subirProyecto(data);
    this.mostrarResultado(hash);
  }

  async capturarPantalla() {
    const canvas = document.querySelector("#gameCanvas");
    return new Promise((success) => {
      const src = canvas.toDataURL();
      success(src);
    });
  }

  mostrarResultado(hash) {
    const cargador = document.querySelector("#cargador");
    const resultado = document.querySelector("#resultado");
    const link = document.querySelector("#link");

    const url = `${window.location.origin}/editor.html?proyecto=${hash}`;
    link.href = url;

    window.history.replaceState({} , "retro-python", url);

    this.qrcode.clear();
    this.qrcode.makeCode(url);

    cargador.classList.add("dn");
    resultado.classList.remove("dn");
  }

  subirProyecto(datos) {
    return new Promise((success, error) => {
      const url = `${HOST}/subir`;
      fetch(url, {
        method: "post",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos)
      })
        .then(resolve => resolve.json())
        .then(data => {
          success(data);
        })
        .catch((err) => {
          error(err);
        });
    });
  }

  // todo borrar;
  mostrarRespuestaDeCopiado() {
    const publicar = document.querySelector("#publicar");
    tooltip.classList.add("show-tooltip");
    publicar.setAttribute("disabled", "disabled");

    setTimeout(() => {
      tooltip.classList.remove("show-tooltip");
      publicar.removeAttribute("disabled");
    }, 1000);
  }

}

export default BotonPublicar;
