import { enviarMensaje, recibirMensaje } from "./bus.js";
import { proyecto } from "./proyecto.js";
import { hex } from "./pixels.js";

class CuadrosDeTexturaPixelart extends HTMLElement {

  connectedCallback() {
    this.cargarColores();
    this.crearHTML();
    this.conectarEventos();
  }

  cargarColores() {
    this.colores = {
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
  }

  /* se ejecuta cuando llega la señal señal-cargar-editor-pixelart */
  recargar() {
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

    imagenTemporal.onload = () => {
      ctx.clearRect(0, 0, 128, 128);
      ctx.drawImage(imagenTemporal, 0, 0);

      const datos = this.obtenerColoresDeLaGrilla(0, 0);
      enviarMensaje(this, "señal-selecciona-sprite-en-canvas-textura", datos);
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

      <div class="editor-de-pixelart-consejo">
        Para dibujar este cuadro número <span id="cuadro">0</span>
        podrías usar un código como este
        <code>dibujar(<span id="cuadroEjemplo">0</span>, 64, 64)</code>.
      </div>

      <button id="alternar-fondo">Alternar fondo</button>
    `;
  }

  guardarCambiosEnLaTextura() {
    const canvas = this.querySelector("#textura")
    const textura = canvas.toDataURL();
    enviarMensaje(this, "señal-actualizar-textura-del-proyecto", {textura, ancho: 128, alto: 40});
  }

  conectarEventos() {
    const contenedor = this.querySelector("#retro-cuadros-de-textura-pixelart");
    const boton = this.querySelector("#alternar-fondo");
    const cursor = this.querySelector("#cursor-de-textura");
    const cursorDeCuadro = this.querySelector("#cursor-de-cuadro");
    const canvas = this.querySelector("#textura")
    const cuadro = this.querySelector("#cuadro")
    const cuadroEjemplo = this.querySelector("#cuadroEjemplo")

    recibirMensaje(this, "señal-cargar-editor-pixelart", () => {
      this.recargar();
    });

    // Permite pegar sobre la grilla de sprites una imagen
    // externa.
    window.addEventListener("paste", async (evento) => {

      if (evento.target.id === "cursor-de-cuadro") {
        evento.preventDefault();
        evento.stopPropagation();
        const item = evento.clipboardData.items[0];

        if (!item.type.startsWith('image/')) {
          alert("Solo puedes pegar una imagen");
          return;
        }

        let file = item.getAsFile();
        let { pixels, ancho, alto } = await this.obtenerPixelsDesdeArchivo(file);

        for (let x=0; x<ancho; x++) {
          for (let y=0; y<alto; y++) {
            const pos = (y * ancho + x) * 4;
            const r = hex(pixels.data[pos + 0]);
            const g = hex(pixels.data[pos + 1]);
            const b = hex(pixels.data[pos + 2]);
            const color = `#${r}${g}${b}`.toUpperCase();

            //this.cuadro = columna + fila * 16;
            const colorIndexado = this.obtenerIndiceDeColorMasParecido(color);
            this.pintarPixel(x, y, colorIndexado);
          }
        }

      this.guardarCambiosEnLaTextura();

      }

    });
      
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
      cuadroEjemplo.innerText = datos.cuadro;
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

  obtenerPixelsDesdeArchivo(file) {
    return new Promise((success) => {
      var reader = new FileReader;

      reader.onload = function() {
        var image = new Image();

        image.src = reader.result;

        image.onload = function() {
          const canvas = new OffscreenCanvas(image.width, image.height);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0);
          const pixels = ctx.getImageData(0, 0, image.width, image.height);
          success({pixels, ancho: image.width, alto: image.height});
        };
      };

      reader.readAsDataURL(file);
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

  /*
   * Toma un color en formato #RRGGBB y retorna el índice de color (de 0 a 15)
   * del color más parecido que encuentre. De esta forma, cuando un usuario
   * "pega" una imagen, nos aseguramos que no introduzca colores por fuera de
   * la paleta de colores.
   */
  obtenerIndiceDeColorMasParecido(color) {
    let nuevoColor = this.obtenerColorMasCercano(color);

    for (let i=0; i<16; i++) {
      if (this.colores[i] == nuevoColor) {
        return i;
      }
    }
  }

  obtenerColorMasCercano(colorRGB) {
    let {r, g, b} = this.separarComponentesDeColor(colorRGB);

    let closestDistance = 1000000000000;
    let closestColor = null;

    for (let i=0; i<16; i++) {
      let color = this.colores[i];
      const color2 = this.separarComponentesDeColor(color);

      const distance = Math.sqrt(
        (r - color2.r) ** 2 +
        (g - color2.g) ** 2 +
        (b - color2.b) ** 2
      );

      // Update closest color and distance if the current distance is smaller than the closest distance
      if (distance < closestDistance) {
        closestDistance = distance;
        closestColor = color;
      }
    }

    return closestColor;
  }

  separarComponentesDeColor(colorRGB) {
    let color = colorRGB.replace("#", "");
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);

    return {r, g, b};
  }


  pintarPixel(x, y, color) {
    const canvas = this.querySelector("#textura");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = this.colores[color];

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
