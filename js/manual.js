import { enviarMensaje } from "./bus.js";

class Manual extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    let iframe = document.createElement('iframe');
    iframe.sandbox = "allow-forms allow-scripts allow-same-origin";
    iframe.src = new URL('../manual.html', import.meta.url);
    this.appendChild(iframe);
  }

  conectarEventos() {
    const iframe = this.querySelector("iframe");

    iframe.addEventListener("load", () => {
      const div = iframe.contentDocument.querySelector(".retro-manual");

      // se envía la señal indicando que se cargó el manual solo
      // si el usuario abrió la sección del manual. Este condicional
      // está acá porque este mismo iframe puede abrir otras secciones
      // que no son el manual, como la sección "ejemplos".
      if (div) {
        const contenido = div.innerHTML;
        enviarMensaje(this, "señal-manual-cargado", {contenido});
      }
    });

    // si llega un mensaje desde el iframe:
    window.addEventListener("message", function(evento) {
      if (evento.data.id == "mensaje-abrir-ejemplo") {
        enviarMensaje(this, "señal-abrir-ejemplo-local", {
          nombre: evento.data.nombre
        });
      }
    });

  }

}

export default Manual;
