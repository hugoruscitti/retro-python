
import { enviarMensaje, recibirMensaje } from "./bus.js";

class PixelartColores extends HTMLElement {

  connectedCallback() {
    this.cargarColores();
    this.crearHTML();
    this.conectarEventos();
  }

  cargarColores() {
    this.colores = [
      "#000000", "#1D2B53", "#7E2553", "#008751",
      "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8",
      "#FF004D", "#FFA300", "#FFEC27", "#00E436",
      "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA",
    ]
  }

  crearHTML() {
    const elementosColores = this.colores.map((color, indice) => {
      return `<div class="color" data-indice="${indice}" style="background-color: ${color};">
        ${indice}
      </div>`;
    });

    this.innerHTML = `
      <div id="retro-pixelart-colores">
        ${elementosColores.join("\n")}
      </div>
    `;
  }

  conectarEventos() {
    const contenedor = this.querySelector("#retro-pixelart-colores");

    contenedor.addEventListener("click", function(event) {
      const el = event.target;

      if (el.classList.contains("color")) {
        const colorSeleccionado = +el.getAttribute("data-indice");
      }
    });
  }

  disconnectedCallback() {
  }
}

export default PixelartColores;


