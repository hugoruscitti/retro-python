import { enviarMensaje } from "./bus.js";
import { proyecto } from "./proyecto.js";

class BotonGuardar extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `
      <button id="guardar">
        <div class="icono">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </div>

        <span class="ocultar-en-mobile">Guardar</span>
      </button>

    `;
  }

  conectarEventos() {
    const guardar = document.querySelector("#guardar");


    guardar.addEventListener("click", async () => {
      let nombre =  "mi-programa";

      if (navigator.userAgent.indexOf('Electron') == -1) {
        nombre = prompt("¿Cómo se llama este programa?", "mi-programa");
      }

      if (nombre === null || nombre.length === 0) {
        return;
      }

      var zip = new JSZip();

      const captura = await this.capturarPantalla();
      const contenido = await proyecto.obtenerProyectoCompleto();

      zip.file("proyecto.json", JSON.stringify(contenido));
      zip.file("captura.png", captura.split(";base64,")[1], {base64: true});

      zip.generateAsync({type:"blob"})
        .then(function(content) {
          saveAs(content, `${nombre}.zip`);
        });
    });

  }

  async capturarPantalla() {
    const canvas = document.querySelector("#gameCanvas");
    return new Promise((success) => {
      const src = canvas.toDataURL();
      success(src);
    });
  }

}

export default BotonGuardar;
