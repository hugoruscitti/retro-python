import { enviarMensaje, recibirMensaje } from "./bus.js";
import { HOST } from "./configuracion.js";
import { proyecto } from "./proyecto.js";

class RetroPythonApp extends HTMLElement {

  connectedCallback() {
    //proyecto.iniciar();
    this.crearHTML();
    this.conectarEventos();
    this.iniciar();
  }

  async iniciar() {
    if (window.location.search.includes("proyecto=")) {
      const proyecto = /proyecto=(.*)/.exec(window.location.search)[1];
      await this.cargarProyecto(proyecto);
      this.ocultarOverlay();
    } else {

      const data = proyecto.obtenerProyectoCompleto();
      console.log(data);
      enviarMensaje(this, "señal-cargar-proyecto", data);

      this.ocultarOverlay();
    }
  }

  cargarProyecto(hashDeProyecto) {
    return new Promise((success, error) => {
      const url = `${HOST}/obtener/${hashDeProyecto}`;
      fetch(url)
        .then(resolve => resolve.json())
        .then(data => {
          enviarMensaje(this, "señal-cargar-proyecto", data);
          success(data);
        })
        .catch((err) => {
          error(err);
        });
    });
  }

  crearHTML() {
    this.innerHTML = `

    <div class="overlay" id="overlay">
      <svg width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <style>.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}@keyframes spinner_AtaB{100%{transform:rotate(360deg)}}</style>
        <path fill="white" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
        <path fill="white" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_ajPY"/>
      </svg>
    </div>

    <retro-interprete></retro-interprete>
    <div class="layout">
      <retro-header></retro-header>

      <div class="center-layout">

        <div class="result-panel" id="result-panel">
          <retro-run-indicator></retro-run-indicator>

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
        <retro-acerca-de></retro-acerca-de>
      </div>

    </div>






      <div id="retro-python-app">
      </div>
    `;
  }

  conectarEventos() {
    document.addEventListener("DOMContentLoaded", () => {
      this.crearSplitView();



      //this.ocultarOverlay();
    });
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
    Split(['#result-panel', '#panel-de-codigo'], {
      gutterAlign: 'start',
      sizes: sizesSplitCentral,
      gutter: function() {
        const gutter = document.querySelector('#gutter')
        return gutter
      },
      onDragEnd: function(sizes) {
        localStorage.setItem('split-sizes-central', JSON.stringify(sizes))
      },
    });

    Split(['retro-pantalla', 'retro-manual'], {
      direction: 'vertical',
      sizes: sizesSplitIzquierdo,
      onDragEnd: function(sizes) {
        localStorage.setItem('split-sizes-izquierdo', JSON.stringify(sizes))
      },
    });

  }


  disconnectedCallback() {
  }
}

export default RetroPythonApp;


