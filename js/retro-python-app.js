import { enviarMensaje, recibirMensaje } from "./bus.js";
import { proyecto } from "./proyecto.js";
import { cargarProyecto, cargarEjemplo, esperar } from "./utils.js";
import { CONFIRMAR_CIERRE } from "./configuracion.js";


class RetroPythonApp extends HTMLElement {

  connectedCallback() {
    proyecto.iniciar();
    this.crearHTML();
    this.conectarEventos();
    this.iniciar();
  }

  async iniciar() {

    if (window.location.search.includes("proyecto=")) {
      const proyecto = /proyecto=(.*)/.exec(window.location.search)[1];
      const data = await cargarProyecto(proyecto);
      enviarMensaje(this, "señal-cargar-proyecto", data);
    } else {
      const data = proyecto.obtenerProyectoCompleto();
      enviarMensaje(this, "señal-cargar-proyecto", data);
    }

    this.ocultarOverlay();
  }


  crearHTML() {
    this.innerHTML = `

    <div class="overlay" id="overlay">

      <div class="overlay-texto">
        <svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <style>.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}@keyframes spinner_AtaB{100%{transform:rotate(360deg)}}</style>
          <path fill="white" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
          <path fill="white" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_ajPY"/>
        </svg>

        <div class="texto">
          Iniciando Python 3.12.1
        </div>
      </div>

      <div>


      </div>

    </div>

    <retro-interprete></retro-interprete>
    <div class="layout">
      <retro-header></retro-header>

      <div class="center-layout">

        <div class="panel-de-la-pantalla" id="result-panel">
          <retro-barra-de-botones-de-pantalla></retro-barra-de-botones-de-pantalla>
          <retro-pantalla></retro-pantalla>
          <retro-manual></retro-manual>
        </div>

        <div id="gutter" class="gutter gutter-horizontal" style="width: 10px;"></div>

        <div class="code-panel" id="panel-de-codigo">
          <retro-barra-de-botones></retro-barra-de-botones>

          <div class="code-area">
            <retro-editor></retro-editor>
          </div>
        </div>
      </div>

      <div class="footer">
      </div>

    </div>

    <div id="retro-python-app">
    </div>
    `;
  }

  conectarEventos() {
    document.addEventListener("DOMContentLoaded", () => {
      this.crearSplitView();
    });

    recibirMensaje(this, "señal-abrir-ejemplo-local", async (datos) => {
      enviarMensaje(this, "señal-detener-la-ejecución");
      await esperar(0.1);
      const ejemplo = await cargarEjemplo(datos.nombre);
      enviarMensaje(this, "señal-cargar-proyecto", ejemplo);
      enviarMensaje(this, "señal-comenzar-a-ejecutar");
    });

    if (CONFIRMAR_CIERRE) {
      window.onbeforeunload = function (e) {
        e = e || window.event;

        if (e) {
          e.returnValue = 'Quieres cerrar la ventana?';
        }

        return 'Quieres cerrar la ventana?';
      };
    }

  }

  mostrarOverlay() {
    const el = this.querySelector("#overlay");
    el.style.display = "inherit";
  }

  ocultarOverlay() {
    const el = this.querySelector("#overlay");
    el.style.display = "none";
  }


  crearSplitView() {
    var sizesSplitCentral = localStorage.getItem('split-sizes-central');
    var sizesSplitIzquierdo = localStorage.getItem('split-sizes-izquierdo');

    if (sizesSplitCentral) {
      sizesSplitCentral = JSON.parse(sizesSplitCentral)
    } else {
      sizesSplitCentral = null;
    }

    if (sizesSplitIzquierdo) {
      sizesSplitIzquierdo = JSON.parse(sizesSplitIzquierdo)
    } else {
      sizesSplitIzquierdo = null;
    }


    // invoca a la biblioteca SplitJS para hacer
    // que los paneles de puedan ajustar con el
    // mouse.
    //
    // nota: los dos selectores son los hijos
    // directos de "#center-layout" que tiene
    // la propiedad "display: flex"
    //
    window.splitVertical = Split(['#result-panel', '#panel-de-codigo'], {
      gutterAlign: 'start',
      sizes: sizesSplitCentral,
      minSize: [130],
      snapOffset: 0,
      gutter: function() {
        const gutter = document.querySelector('#gutter')
        return gutter
      },
      onDragEnd: function(sizes) {
        localStorage.setItem('split-sizes-central', JSON.stringify(sizes))
      },
      onDrag: function() {
        // todo: enviar una señal acá.
        ajustarTamaño();
      }
    });

    window.splitHorizontal = Split(['retro-pantalla', 'retro-manual'], {
      direction: 'vertical',
      sizes: sizesSplitIzquierdo,
      minSize: [128, 90],
      snapOffset: 0,
      onDragEnd: function(sizes) {
        localStorage.setItem('split-sizes-izquierdo', JSON.stringify(sizes))
      },
      onDrag: function() {
        // todo: enviar una señal acá.
        ajustarTamaño();
      }
    });

    ajustarTamaño();

    window.addEventListener("resize", function() {
      ajustarTamaño();
    });

  }


  disconnectedCallback() {
  }
}

export default RetroPythonApp;


