import { enviarMensaje } from "./bus.js";

class ShareButton extends HTMLElement {

  connectedCallback() {
    this.createHTML();
    this.connectEvents();
  }

  createHTML() {
    this.innerHTML = `
      <button class="btn-icon btn-icon-share" id="share">
        <div class="icono">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
          </svg>
        </div>

        Publicar
      </button>

      <dialog id="dialogo-publicar">
        <p>¡Tu creación ya se puede compatir!</p>

        <img id="imagen-del-juego-publicado" src="">

        <div id="qrcode"></div>

        <span id="tooltip" class="tooltip pixelart">URL saved to clipboard</span>

        <form method="dialog">
          <button>Volver</button>
        </form>
      <dialog>

    `;
  }

  connectEvents() {
    const shareButton = document.querySelector("#share");
    const dialogo = document.querySelector("#dialogo-publicar");
    const imagen = document.querySelector("#imagen-del-juego-publicado");
    const qr = document.querySelector("#qrcode")
    const qrcode = new QRCode(qr, "https://retro-python.com.ar");

    shareButton.addEventListener("click", () => {
      dialogo.showModal();

      game.renderer.snapshot(function(img) {
        imagen.src = img.src;
      });
      qrcode.clear();
      qrcode.makeCode("https://pilas-engine.com.ar");

      const data = {
        callback: (data) => {
          this.saveProjectInURL(data.code);
          this.initShareButtonAnimationFeedback();
        }
      }

      enviarMensaje(this, "signal-get-code", data);
    });

  }

  initShareButtonAnimationFeedback() {
    const shareButton = document.querySelector("#share");
    tooltip.classList.add("show-tooltip");
    shareButton.setAttribute("disabled", "disabled");

    setTimeout(() => {
      tooltip.classList.remove("show-tooltip");
      shareButton.removeAttribute("disabled");
    }, 1000);
  }

  saveProjectInURL(code) {
    const project = {
      code: code
    }

    const base64Encoded = btoa(JSON.stringify(project));
    var url = new URL(window.location.origin);
    url.searchParams.append('code', base64Encoded);

    const newURL = url.toString();

    navigator.clipboard.writeText(newURL);
    window.history.replaceState({}, window.title, newURL)
  }
}

export default ShareButton;
