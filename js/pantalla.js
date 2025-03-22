import { conectarCanvasAlWorker, detenerEjecucionDePython, actualizarEstadoDelTeclado, enviarEventoDelMouse } from "./servicios/workerApi.mjs";

class Pantalla extends HTMLElement {

  connectedCallback() {
    this.innerHTML = `
      <div class="canvas-container">
        <canvas tabindex="1" id="gameCanvas" width="128" height="128"></canvas>
      </div>
    `;

    this.crearCanvas();
  }

  crearCanvas() {
    const canvas = document.getElementById("gameCanvas");
    const contenedor = document.querySelector("retro-pantalla");

    conectarCanvasAlWorker(canvas);

    canvas.addEventListener("keydown", (evento) => {
      const tecla = evento.code;

      if (tecla === "ShiftRight" || tecla === "ShiftLeft") {
        actualizarEstadoDelTeclado({shift: true});
      }

      if (tecla === "Escape") {
        detenerEjecucionDePython();
      }

      if (tecla === "ArrowLeft" || tecla === "KeyH" || tecla === "KeyA") {
        actualizarEstadoDelTeclado({izquierda: true});
      }

      if (tecla === "ArrowUp" || tecla === "KeyK" || tecla === "KeyW") {
        actualizarEstadoDelTeclado({arriba: true});
      }

      if (tecla === "ArrowRight" || tecla === "KeyL" || tecla === "KeyD") {
        actualizarEstadoDelTeclado({derecha: true});
      }

      if (tecla === "ArrowDown" || tecla === "KeyJ" || tecla === "KeyS") {
        actualizarEstadoDelTeclado({abajo: true});
      }

      if (tecla === "Space" || tecla === "KeyZ" || tecla === "KeyC") {
        actualizarEstadoDelTeclado({boton: true});
      }

      if (tecla === "KeyX") {
        actualizarEstadoDelTeclado({boton_secundario: true});
      }

    }, false);

    canvas.addEventListener("keyup", (evento) => {
      const tecla = evento.code;

      if (tecla === "ShiftRight" || tecla === "ShiftLeft") {
        actualizarEstadoDelTeclado({shift: false});
      }

      if (tecla === "ArrowLeft" || tecla === "KeyH" || tecla === "KeyA") {
        actualizarEstadoDelTeclado({izquierda: false});
      }

      if (tecla === "ArrowUp" || tecla === "KeyK" || tecla === "KeyW") {
        actualizarEstadoDelTeclado({arriba: false});
      }

      if (tecla === "ArrowRight" || tecla === "KeyL" || tecla === "KeyD") {
        actualizarEstadoDelTeclado({derecha: false});
      }

      if (tecla === "ArrowDown" || tecla === "KeyJ" || tecla === "KeyS") {
        actualizarEstadoDelTeclado({abajo: false});
      }
    }, false);

    canvas.addEventListener("mousemove", (evento) => {
      const escala = evento.target.clientWidth / 128;
      const x = Math.floor(evento.offsetX / escala);
      const y = Math.floor(evento.offsetY / escala);
      enviarEventoDelMouse({x, y});
    }, false);

    canvas.addEventListener("mousedown", (evento) => {
      const escala = evento.target.clientWidth / 128;
      const x = Math.floor(evento.offsetX / escala);
      const y = Math.floor(evento.offsetY / escala);
      enviarEventoDelMouse({x, y, click: evento.which === 1});
    }, false);

    canvas.addEventListener("mouseup", (evento) => {
      const escala = evento.target.clientWidth / 128;
      const x = Math.floor(evento.offsetX / escala);
      const y = Math.floor(evento.offsetY / escala);
      enviarEventoDelMouse({x, y, click: !(evento.which === 1)});
    }, false);

    this.conectarFuncionParaAjustarTamaño(canvas, contenedor);
  }

  conectarFuncionParaAjustarTamaño(canvas, contenedor) {

    function ajustarTamaño() {
        let scale = Math.min(
          contenedor.clientWidth / canvas.width,
          contenedor.clientHeight / canvas.height
        );

      if (scale < 1) {
        return;
      }

        scale = Math.floor(scale);
        canvas.style.width = `${Math.round(scale * canvas.width)}px`;
        canvas.style.height = `${Math.round(scale * canvas.height)}px`;
      canvas.setAttribute("scale", scale);
      }

    // TODO: evitar exponer esta función acá, en lugar
    // de eso generar un evento y responder a el.
    window.ajustarTamaño = ajustarTamaño; 
  }
}

export default Pantalla;
