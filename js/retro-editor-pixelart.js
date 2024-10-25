import { enviarMensaje, recibirMensaje } from "./bus.js";
import { proyecto } from "./proyecto.js";

class EditorPixelart extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.configurarCanvasDeTextura();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `
      <button id="abrir-editor">
        <div class="icono">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </div>

        Abrir el editor pixelart
      </button>

      <dialog>

        <div class="contenedor-editor-pixelart">
          <div>
            <retro-pixelart-canvas></retro-pixelart-canvas>
          </div>
          <div>
            <retro-pixelart-colores></retro-pixelart-colores>
          </div>
        </div>

        <div class="contenedor-canvas-textura">
          <canvas id="canvas-textura" width="128" height="40"></canvas>
          <img src="" id="textura" class="textura"/>
          <div id="cursor" class="cursor-canvas-textura"></div>
        </div>

        <form method="dialog">
          <button>

            <div class="icono">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
              </svg>
            </div>

            Volver al proyecto
          </button>
        </form>
      </dialog>
    `;
  }

  conectarEventos() {
    const boton = this.querySelector("#abrir-editor");
    const dialogo = this.querySelector("dialog");
    const canvasTextura = this.querySelector("#canvas-textura");
    const textura = this.querySelector("#textura");
    
    boton.addEventListener("click", () => {
      const data = proyecto.obtenerProyectoCompleto();
      this.moverCursor(0, 0);

      textura.addEventListener("load", () => {
        this.cargarCanvas();
      });

      textura.src = data.textura;
      dialogo.showModal();
    });

    canvasTextura.addEventListener("mousemove", (evento) => {
      const { fila, columna } = this.obtenerCoordenadaDesdeEvento(evento);
      this.moverCursor(fila, columna);
    });

    canvasTextura.addEventListener("click", (evento) => {
      const { fila, columna } = this.obtenerCoordenadaDesdeEvento(evento);
      const indice = fila * 16 + columna;
      enviarMensaje(this, "señal-selecciona-sprite-en-canvas-textura", {indice});
      this.seleccionarCuadroPorIndice(indice);
    });

  }

  seleccionarCuadroPorIndice() {
    const canvasTextura = this.querySelector("#canvas-textura");
    const textura = this.querySelector("#textura");
    const ctx = canvasTextura.getContext("2d");
    ctx.drawImage(textura, 0, 0);
  }

  obtenerCoordenadaDesdeEvento(evento) {
    const canvasTextura = this.querySelector("#canvas-textura");
    const rect = canvasTextura.getClientRects()[0];
    const x = evento.pageX - rect.left;
    const y = evento.pageY - rect.top;
    const fila = Math.floor(y/32);
    const columna = Math.floor(x/32);
    return { fila, columna };
  }

  moverCursor(fila, columna) {
    const cursor = this.querySelector("#cursor");
    fila = Math.max(fila, 0);
    columna = Math.max(columna, 0);

    cursor.style.left = `${columna*32}px`;
    cursor.style.top = `${fila*32}px`;
  }

  cargarCanvas() {
    const canvasTextura = this.querySelector("#canvas-textura");
    const ctx = canvasTextura.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    this.pintarTextura();
  }

  pintarTextura() {
    const canvasTextura = this.querySelector("#canvas-textura");
    const textura = this.querySelector("#textura");
    const ctx = canvasTextura.getContext("2d");
    ctx.drawImage(textura, 0, 0, textura.naturalWidth, textura.naturalHeight, 0, 0, 512, 160);
  }

  configurarCanvasDeTextura() {
    const canvasTextura = this.querySelector("#canvas-textura");
    const ctx = canvasTextura.getContext("2d");
    ctx.imageSmoothingEnabled = false;
  }

  disconnectedCallback() {
  }
}

export default EditorPixelart;


