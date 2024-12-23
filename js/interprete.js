import { enviarMensaje } from "./bus.js";
import { python } from "./servicios/python.js";
import { recibirMensaje } from "./bus.js";
import { proyecto } from "./proyecto.js";


class Interprete extends HTMLElement {

  connectedCallback() {
    this.ejecutando = false;
    this.temporizador = null;

    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `<div>
      <div id="error">
        <button id="boton-ocultar-error">✕</button>

        <div>Oh, parece que hubo un error:</div>

        <div id="detalle"></div>
      </div>
    </div>`;

    this.limpiarErrores();
  }


  conectarEventos() {
    const botonOcultarError = this.querySelector("#boton-ocultar-error");

    // cuando llega el mensaje run, solicita el código como
    // string e inicia la ejecución
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

  ejecutar(codigo, textura) {
    this.ejecutando = true;

    this.limpiarErrores();

    // Arma el contexto de ejecución para comunicar python con JavaScript
    python.ejecutar(codigo, textura, {
      continuar_ejecucion: () => {
        return this.ejecutando;
      },
      canvas: window.canvas,
      __fin: () => {
        this.terminarPrograma();
      }
    });
  }

  iniciarTemporizadorDeBuclePrincipal() {
    if (this.temporizador) {
      this.destruirTemporizador();
    }

    this.temporizador = window.canvas.time.addEvent({
        delay: 1000 / 30,
        loop: true,
        callback: () => {
          // esta función la genera la función replaceMainLoopWithFunction
          // solamente si el programa tiene un bucle principal.
            try {
              if (window.__bloque_while) {
                window.cuadro += 1;
                window.__bloque_while();
              } else {
                console.log("warning to do: la función __bloque_while no existe aún")
              }
            } catch (e) {
              enviarMensaje(this, "señal-detener-la-ejecución", {});
              this.mostrarError(e);
            }
          /*

          acumulador += 33;

          if (acumulador >= 1000 / speed) {
            acumulador = 0;
          }
          */

        }
      });
  }

  detenerEjecucion() {
    if (this.temporizador) {
      this.destruirTemporizador();
      enviarMensaje(this, "señal-detener-la-ejecución", {});
    }
  }

  destruirTemporizador() {
    this.temporizador.destroy()
    this.temporizador = null;
    this.ejecutando = false;
  }

  terminarPrograma() {
    setTimeout(() => {
      this.ejecutando = false;
      enviarMensaje(this, "señal-detener-la-ejecución", {});
    }, 500);
  }

  limpiarErrores() {
    const errorContainer = document.querySelector("#error");
    errorContainer.style.display = "none";
  }

  mostrarError(error) {
    const errorContainer = this.querySelector("#error");
    const detalleDelError = this.querySelector("#error #detalle");


    error = this.traducirError(error);

    detalleDelError.innerHTML = error.join("<br/>");
    errorContainer.style.display = "block";
    console.error(error);
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

    return error.map(e => {
      console.log(`Traducción, original '${e}'`);

      e = e.replace(`  File "<exec>", `, "")
      e = e.replace(`File "<unknown>", `, "") 
      e = e.replace(`, in <module>`, "");
      e = e.replace(`, in `, ", en ");
      //e = e.replace("line", "en la linea número");
      e = e.replace(`File \"<exec>\", `, "");

      e = e.replace(/TypeError: (.*) takes (.*) positional arguments but (.*) was given/, "Error en los argumentos, la función $1 esperaba $2 argumentos, pero se llamó con $3");
      e = e.replace(/NameError: name (.*) is not defined/, "La variable o función $1 no está definida")
      e = e.replace(/Did you mean: (.*)?/, "¿Quisiste escribir $1");
      e = e.replace("SyntaxError: invalid syntax", "Error de sintáxis");
      e = e.replace("SyntaxError: '(' was never closed", "No se cerró el paréntesis (")
      e = e.replace("IndentationError", "Error de identación");
      e = e.replace("expected an indented block after ", "se esperaba una identación después de ");
      e = e.replace("statement on", "");
      e = e.replace("unexpected indent", "identación no esperada");
      e = e.replace("unindent does not match any outer indentation level", "la des-identanción no coincide con las lineas anteriores");

      console.log(`Traducción, luego de traducir quedó '${e}'`);


      return e;

    });
  }
}


export default Interprete;
