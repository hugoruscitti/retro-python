import { enviarMensaje } from "./bus.js";
import { recibirMensaje } from "./bus.js";
import { proyecto } from "./proyecto.js";
import { asyncRun, detenerEjecucionDePython } from "./servicios/workerApi.mjs";


class Interprete extends HTMLElement {

  connectedCallback() {
    this.ejecutando = false;
    this.temporizador = null;

    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `<div>
      <div id="error" class="absolute--fill bg-black-60 fixed z-999">
        <div id="mensaje-de-error" class="br3">
          <button id="boton-ocultar-error">✕</button>

          <div>Oh, parece que hubo un error:</div>

          <div id="detalle"></div>
        </div>
      </div>
    </div>`;

    this.limpiarErrores();
  }


  conectarEventos() {
    const botonOcultarError = this.querySelector("#boton-ocultar-error");

    recibirMensaje(this, "señal-comenzar-a-ejecutar", () => {
      const data = proyecto.obtenerProyectoCompleto();
      this.ejecutar(data.codigo, data.textura);
    });

    botonOcultarError.addEventListener("click", () => {
      this.limpiarErrores();
    });

    recibirMensaje(this, "señal-mostrar-error", (data) => {
      this.mostrarError(data.detalle);
    });

    recibirMensaje(this, "señal-detener-la-ejecución", () => {
      this.detenerEjecucion();
    });

    recibirMensaje(this, "señal-detener-la-ejecución", () => {
      this.ejecutando = false;
    });
  }

  async ejecutar(codigo, textura) {
    this.ejecutando = true;
    this.limpiarErrores();

    const contexto = { textura };
    const { resultado, error } = await asyncRun(codigo, contexto);

    if (error) {
      this.mostrarError(error);
    }

    enviarMensaje(this, "señal-detener-la-ejecución", {});
  }

  detenerEjecucion() {
    detenerEjecucionDePython();
  }

  limpiarErrores() {
    const errorContainer = document.querySelector("#error");
    errorContainer.style.display = "none";
  }

  mostrarError(error) {
    const errorContainer = this.querySelector("#error");
    const detalleDelError = this.querySelector("#error #detalle");
    let self = this;

    error = this.traducirError(error);
    error = error.filter(e => e.trim().length > 0);

    detalleDelError.innerHTML = error.join("<br/>");
    errorContainer.style.display = "block";

    console.error(error);


    function pulsaTecla(evento) {
      if (evento.key === "Escape") {
        window.document.removeEventListener("keydown", pulsaTecla);
        errorContainer.removeEventListener("click", cerrar);
        self.limpiarErrores();
      }
    }


    function cerrar(evento) {
      if (evento.target.id === "error") {
        window.document.removeEventListener("keydown", pulsaTecla);
        errorContainer.removeEventListener("click", cerrar);
        self.limpiarErrores();
      }
    }

    window.document.addEventListener("keydown", pulsaTecla);
    errorContainer.addEventListener("click", cerrar);

  }


  traducirError(error) {
    /*
     * Los errores de python suelen ser textos como estos:
     *
     * [
     *    "  File \"<exec>\", line 3, in <module>",
     *    "NameError: name '__fin' is not defined"
     * ]
     *
     * Sin embargo, aquí en retropython no nos interesa ese
     * detalle, alcanza con indicar el número de linea y traducir
     * algunos tipos de errores comunes.
     *
     * Esta función se encarga de traducir y simplificar esos
     * errores para que se vean en español.
     *
     *
     */
    console.error(error);

    return error.split("\n").map(e => {
      //console.log(`Traducción, original '${e}'`);

      //e = e.replace(`  File "<exec>", `, "")
      //e = e.replace(`File "<unknown>", `, "") 
      //e = e.replace(`, in <module>`, "");
      //e = e.replace(`, in `, ", en ");
      //e = e.replace("line", "en la linea número");
      //e = e.replace(`File \"<exec>\", `, "");

      e = e.replace(/TypeError: (.*) takes (.*) positional arguments but (.*) was given/, "Error en los argumentos, la función $1 esperaba $2 argumentos, pero se llamó con $3");
      e = e.replace(/NameError: name (.*) is not defined/, "La variable o función $1 no está definida")
      e = e.replace(/Did you mean: (.*)?/, "¿Quisiste escribir $1");
      e = e.replace(/(.*), line (\d+), in __main/, "");
      e = e.replace(/(.*), line (\d+), in/, "");
      e = e.replace("SyntaxError: invalid syntax", "Error de sintáxis");
      e = e.replace("SyntaxError: '(' was never closed", "No se cerró el paréntesis (")
      e = e.replace("Traceback (most recent call last):", "");
      e = e.replace(/(.*)python312.zip(.*)/, "");
      e = e.replace("await CodeRunner(", "");
      e = e.replace("await coroutine", "");
      e = e.replace("eval_code_async", "");
      e = e.replace("run_async", "");
      e = e.replace("IndentationError", "Error de identación");
      e = e.replace("expected an indented block after ", "se esperaba una identación después de ");
      e = e.replace("statement on", "");
      e = e.replace("unexpected indent", "identación no esperada");
      e = e.replace("unindent does not match any outer indentation level", "la des-identanción no coincide con las lineas anteriores");

      //console.log(`Traducción, luego de traducir quedó '${e}'`);


      return e;

    });
  }
}


export default Interprete;
