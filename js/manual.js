import { enviarMensaje } from "./bus.js";

class Manual extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    let iframe = document.createElement('iframe');
    iframe.src = new URL('/manual.html', import.meta.url);
    this.appendChild(iframe);
  }

  conectarEventos() {
    const iframe = this.querySelector("iframe");


    iframe.addEventListener("load", () => {
      const contenido = iframe.contentDocument.querySelector(".retro-manual").innerHTML;

      enviarMensaje(this, "señal-manual-cargado", {contenido});
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

export default Manual;
