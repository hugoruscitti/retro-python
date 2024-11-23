import { enviarMensaje, recibirMensaje } from "./bus.js";
import { proyecto } from "./proyecto.js";

class CuadrosDeTexturaPixelart extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.conectarEventos();
    this.cuadro = 0;

    /* 
     * Este componente se encarga de "leer" la textura
     * de imágenes del proyecto y dibujarla como cuadros
     * de animación separados.
     */
    const data = proyecto.obtenerProyectoCompleto();
    const textura = this.querySelector("#textura");

    var ctx = textura.getContext("2d");

    var imagenTemporal = new Image();

    imagenTemporal.onload = function() {
      ctx.drawImage(imagenTemporal, 0, 0);
    };

    imagenTemporal.src = data.textura;
  }

  crearHTML() {
    this.innerHTML = `
      <div id="retro-cuadros-de-textura-pixelart">
        <div id="cursor-de-textura"></div>
        <div id="cursor-de-cuadro"></div>
        <canvas id="textura" width="128" height="40"></canvas>
      </div>

      <div>
        Cuadro actual: <span id="cuadro">0</span>
      </div>

      <button id="alternar-fondo">Alternar fondo</button>
    `;
  }

  guardarCambiosEnLaTextura() {
    const canvas = this.querySelector("#textura")
    const textura = canvas.toDataURL();
    enviarMensaje(this, "señal-actualizar-textura-del-proyecto", {textura});
  }

  conectarEventos() {
    const contenedor = this.querySelector("#retro-cuadros-de-textura-pixelart");
    const boton = this.querySelector("#alternar-fondo");
    const cursor = this.querySelector("#cursor-de-textura");
    const cursorDeCuadro = this.querySelector("#cursor-de-cuadro");
    const canvas = this.querySelector("#textura")
    const cuadro = this.querySelector("#cuadro")

    canvas.addEventListener("mousemove", (evento) => {
      let columna = parseInt(evento.offsetX / 32, 10);
      let fila = parseInt(evento.offsetY / 32, 10);

      columna = Math.min(columna, 15);
      fila = Math.min(fila, 4);

      cursor.style.left = columna * 32 + "px";
      cursor.style.top = fila * 32 + "px";
    });

    recibirMensaje(this, "señal-cambia-el-cuadro-en-la-grilla", (datos) => {
      cuadro.innerText = datos.cuadro;
    });

    canvas.addEventListener("click", (evento) => {
      let columna = parseInt(evento.offsetX / 32, 10);
      let fila = parseInt(evento.offsetY / 32, 10);

      columna = Math.min(columna, 15);
      fila = Math.min(fila, 4);

      cursorDeCuadro.style.left = columna * 32 + "px";
      cursorDeCuadro.style.top = fila * 32 + "px";

      const datos = this.obtenerColoresDeLaGrilla(columna, fila);
      this.cuadro = columna + fila * 16;

      enviarMensaje(this, "señal-selecciona-sprite-en-canvas-textura", datos);
      enviarMensaje(this, "señal-cambia-el-cuadro-en-la-grilla", {cuadro: this.cuadro});
    });

    recibirMensaje(this, "señal-pixelart-cambia-pixel", (datos) => {
      this.pintarPixel(datos.x, datos.y, datos.color);
      this.guardarCambiosEnLaTextura();
    });

    recibirMensaje(this, "señal-pixelart-borra-pixel", (datos) => {
      this.borrarPixel(datos.x, datos.y);
      this.guardarCambiosEnLaTextura();
    });

    boton.addEventListener("click", function() {
      enviarMensaje(this, "señal-alternar-fondo-transparente", {});
    });

  }

  obtenerColoresDeLaGrilla(columna, fila) {
    const xInicial = columna * 8;
    const yInicial = fila * 8;

    const canvas = this.querySelector("#textura");
    const ctx = canvas.getContext("2d");

    let datos = []

    for (let x=0; x<8; x++) {
      for (let y=0; y<8; y++) {
        const pixel = ctx.getImageData(xInicial + x, yInicial + y, 1, 1).data;
        const color = {r: pixel[0], g: pixel[1], b: pixel[2]};

        // solo se guardan los pixeles de color, no los transparentes
        if (pixel[3] !== 0) {
          datos.push({x, y, color});
        }
      }
    }

    return datos;
  }

  pintarPixel(x, y, color) {
    const canvas = this.querySelector("#textura");
    const ctx = canvas.getContext("2d");
    const colores = {
      0: "#000000",
      1: "#1D2B53",
      2: "#7E2553",
      3: "#008751",
      4: "#AB5236",
      5: "#5F574F",
      6: "#C2C3C7",
      7: "#FFF1E8",
      8: "#FF004D",
      9: "#FFA300",
      10: "#FFEC27",
      11: "#00E436",
      12: "#29ADFF",
      13: "#83769C",
      14: "#FF77A8",
      15: "#FFCCAA"
    }
    ctx.fillStyle = colores[color];

    const fila = parseInt(this.cuadro / 16, 10);
    const columna = parseInt(this.cuadro % 16, 10);

    ctx.fillRect(x + columna * 8, y + fila * 8, 1, 1);
  }

  borrarPixel(x, y) {
    const canvas = this.querySelector("#textura");
    const ctx = canvas.getContext("2d");

    const fila = parseInt(this.cuadro / 16, 10);
    const columna = parseInt(this.cuadro % 16, 10);

    ctx.clearRect(x + columna * 8, y + fila * 8, 1, 1);
  }

  disconnectedCallback() {
  }
}

export default CuadrosDeTexturaPixelart;

