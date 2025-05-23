import { enviarMensaje, recibirMensaje } from "./bus.js";
import { obtenerDesdeLocalStorage, guardarEnLocalStorage } from "./utils.js";

//const HOST = "http://127.0.0.1:8000";
const HOST = "https://retro-python-backend.pilas-engine.com.ar";
const CONFIRMAR_CIERRE = true;

function obtenerConfiguración() {
  let configuraciónPorOmisión = {modoOscuro: true};
  let configuracionGuardada = obtenerDesdeLocalStorage("configuración", configuraciónPorOmisión);
  return configuracionGuardada;
}




class Configuracion extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.reflejarConfiguraciónEnElDOM();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `

    <button id="boton-configuracion">
      <div class="icono">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </div>
      <span class="ocultar-en-mobile">Configurar</span>
    </button>

      <dialog id="dialogo-configuracion" class="texto">


      <div id="config" class="no-user-select pa2">

        <div class="contenido-dialogo-de-configuracion">
          <!-- TODO: opción desactivada -->
          <!--
          <label>
            <input type="checkbox" id="live">
            Ejecutar automáticamente
          </label>
          -->
          <!-- FIN TODO: opción desactivada -->

          <label>
            <input type="checkbox" id="vim">
            Modo VIM 
          </label>

          <label>
            <input type="checkbox" id="modo-oscuro" checked="checked">
            Modo oscuro
          </label>
        </div>

        <form method="dialog">
          <button id="guardar">Aplicar la configuración</button>
        </form>

</dialog>
  `;
  }

  reflejarConfiguraciónEnElDOM() {
    const switchVim = this.querySelector("#vim");
    const switchModoOscuro = this.querySelector("#modo-oscuro");
    let configuracionGuardada = obtenerConfiguración();

    switchVim.checked = configuracionGuardada.modoVim;
    switchModoOscuro.checked = configuracionGuardada.modoOscuro;
  }

  conectarEventos() {
    const boton = this.querySelector("#boton-configuracion");
    const dialogo = this.querySelector("#dialogo-configuracion");
    const guardar = this.querySelector("#guardar");
    const switchVim = this.querySelector("#vim");
    const switchModoOscuro = this.querySelector("#modo-oscuro");

    boton.addEventListener("click", function() {
      dialogo.showModal();
    });

    /*
    this.querySelector("#live").addEventListener("change", function(e) {
      enviarMensaje(this, "señal-activar-modo-live", { enabled: e.target.checked });
    });
    */

    switchVim.addEventListener("change", function(e) {
      enviarMensaje(this, "señal-activar-el-modo-vim", { enabled: e.target.checked });
    });

    switchModoOscuro.addEventListener("change", function(e) {
      enviarMensaje(this, "señal-activar-modo-oscuro", { activado: e.target.checked });
    });


    guardar.addEventListener("click", function() {
      configuracionGuardada = {
        modoVim: switchVim.checked,
        modoOscuro: switchModoOscuro.checked,
      };
      
      guardarEnLocalStorage("configuración", configuracionGuardada);
      console.log("Guardando la configuración en localStorage");
    });

  }

}

export { Configuracion, HOST, CONFIRMAR_CIERRE, obtenerConfiguración };
