import { enviarMensaje } from "./bus.js";
import { proyecto } from "./proyecto.js";
const HOST = "http://127.0.0.1:8000/";

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

        Publicar
      </button>

      <dialog id="dialogo-publicar" open>

        <div id="cargador" class="pa dialogo-publicar-contenido">
          <div>Publicando...</div>
        </div>

        <div id="resultado" class="dn dialogo-publicar-contenido pa"> 

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
            También podés <a href="#" id="link-copiar" class="link-copiar">copiar el link
              <span id="tooltip" class="tooltip pixelart">Copiado</span>
            </a> para compartirlo.
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
    const imagen = document.querySelector("#imagen-del-juego-publicado");
    const linkCopiar = document.querySelector("#link-copiar");
    const qr = document.querySelector("#qrcode");

    this.qrcode = new QRCode(qr, {
      width: 128,
      height: 128,
      text: "https://retro-python.com.ar"
    });

    linkCopiar.addEventListener("click", (evento) => {
      evento.preventDefault();
      this.mostrarRespuestaDeCopiado();
    });

    publicar.addEventListener("click", () => {
      this.publicar();
      dialogo.showModal();

      game.renderer.snapshot(function(img) {
        imagen.src = img.src;
      });


      const data = {
        callback: (data) => {
          this.saveProjectInURL(data.code);
          this.mostrarRespuestaDeCopiado();
        }

      }

      enviarMensaje(this, "signal-get-code", data);
    });

  }

  async publicar() {
    const data = proyecto.obtenerProyectoCompleto();
    const { hash } = await this.subirProyecto(data);
    this.mostrarResultado(hash);
  }

  mostrarResultado(hash) {
    const cargador = document.querySelector("#cargador");
    const resultado = document.querySelector("#resultado");

    this.qrcode.clear();
    this.qrcode.makeCode(`${window.location.origin}/editor.html?proyecto={hash}`);

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

  mostrarRespuestaDeCopiado() {
    const publicar = document.querySelector("#publicar");
    tooltip.classList.add("show-tooltip");
    publicar.setAttribute("disabled", "disabled");

    setTimeout(() => {
      tooltip.classList.remove("show-tooltip");
      publicar.removeAttribute("disabled");
    }, 1000);
  }

  saveProjectInURL(code) {
    const project = {
      code: code
    }

    const base64Encoded = btoa(JSON.stringify(project));
    var url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.append('code', base64Encoded);

    const newURL = url.toString();

    navigator.clipboard.writeText(newURL);
    window.history.replaceState({}, window.title, newURL)
  }
}

export default BotonPublicar;
