import { hex } from "../pixels.js";
import letras from "../letras.js";

function b64toBlob(b64Data, sliceSize=512) {
  const data = b64Data.split(",")[1];
  const byteCharacters = atob(data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
    
  const blob = new Blob(byteArrays, {type: "image/png"});
  return blob;
}


class Motor {

  constructor() {
    this.posicionUltimoPrint = 0;
    this.mantenerEjecucion = true;
    this.ctx = null;

    this.reiniciar_variables();

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
    };

    this.coloresRGB = {
      0: { r: 0, g: 0, b: 0 },        // "#000000"
      1: { r: 29, g: 43, b: 83 },     // "#1D2B53"
      2: { r: 126, g: 37, b: 83 },    // "#7E2553"
      3: { r: 0, g: 135, b: 81 },     // "#008751"
      4: { r: 171, g: 82, b: 54 },    // "#AB5236"
      5: { r: 95, g: 87, b: 79 },     // "#5F574F"
      6: { r: 194, g: 195, b: 199 },   // "#C2C3C7"
      7: { r: 255, g: 241, b: 232 },   // "#FFF1E8"
      8: { r: 255, g: 0, b: 77 },      // "#FF004D"
      9: { r: 255, g: 163, b: 0 },     // "#FFA300"
      10: { r: 255, g: 236, b: 39 },    // "#FFEC27"
      11: { r: 0, g: 228, b: 54 },     // "#00E436"
      12: { r: 41, g: 173, b: 255 },    // "#29ADFF"
      13: { r: 131, g: 118, b: 156 },   // "#83769C"
      14: { r: 255, g: 119, b: 168 },   // "#FF77A8"
      15: { r: 255, g: 204, b: 170 }    // "#FFCCAA"
    };
  }

  actualizarPantalla() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  conectarCanvas(canvas) {
    // conecta el canvas del DOM con este webworker. Toda operación
    // que se haga en este contexto se reflejará en el elemento
    // canvas del DOM.

    this.ctx = canvas.getContext("2d", {willReadFrequently: false, alpha: false });
    this.ctx.imageSmoothingEnabled = false;
    this.imageData = this.ctx.createImageData(canvas.width, canvas.height);
  }

  reiniciar() {
    this.borrar();
    this.reiniciar_variables();
  }

  reiniciar_variables() {
    this.mouse_x = 64;
    this.mouse_y = 64;
    this.click = false;

    this.izquierda = false;
    this.derecha = false;
    this.arriba = false;
    this.abajo = false;

    this.boton = false;
    this.boton_secundario = false;

    this.shift = false;
  }

  obtenerIndiceDeColor(numero) {
    return Math.floor(Math.abs(numero || 0)) % 16;
  }

  obtenerColor(key, defaultValue = 0x000000) {
    const indice = this.obtenerIndiceDeColor(key);
    const colorFinal = this.colores[indice] || defaultValue;
    return colorFinal;
  }

  obtenerColorRGB(key, defaultValue = 0x000000) {
    const indice = this.obtenerIndiceDeColor(key);
    const colorFinal = this.coloresRGB[indice] || defaultValue;
    return colorFinal;
  }

  dibujar(indice, dx, dy) {
    const columna = indice % 16;
    const fila = Number.parseInt(indice / 16, 10);
    dx = Number.parseInt(dx, 10);
    dy = Number.parseInt(dy, 10);

    let sx = columna * 8;
    let sy = fila * 8;

    for (let i=0; i<8; i++) {
      for (let j=0; j<8; j++) {
        let si = ((sy+j) * 128 + (sx+i)) * 4;
        let di = ((dy+j) * 128 + (dx+i)) * 4;

        // evita pintar pixeles transparentes
        if (this.pixels.data[si + 0] === 255 && this.pixels.data[si + 1] === 0 && this.pixels.data[si + 2] === 255) {
          continue;
        }

        // evita dibujar por fuera de la pantalla
        if (dx+i >= 128 || dx+i < 0) {
          continue;
        }

        if (dy+j >= 128 || dy+j < 0) {
          continue;
        }

        this.imageData.data[di + 0] = this.pixels.data[si + 0];
        this.imageData.data[di + 1] = this.pixels.data[si + 1];
        this.imageData.data[di + 2] = this.pixels.data[si + 2];
        this.imageData.data[di + 3] = this.pixels.data[si + 3];
      }
    }

  }

  obtenerPixel(indice, x, y) {
    x = Number.parseInt(x, 10);
    y = Number.parseInt(y, 10);
    const pixel = this.pixels;
    const pos = (y * 128 + x) * 4;

    const r = hex(pixel.data[pos + 0]);
    const g = hex(pixel.data[pos + 1]);
    const b = hex(pixel.data[pos + 2]);
    const color = `#${r}${g}${b}`.toUpperCase();

    // si es un pixel transparente retorna null.
    if (color === "#FF00FF") {
      return -1;
    }

    // si es otro color, lo retorna de la paleta de colores
    return Object.keys(this.colores).find(indice => this.colores[indice] === color);
  }

  async actualizarTextura(textura, ancho, alto) {
    // Este método se llama al ejecutar el proyecto, y se utiliza
    // para que la textura con sprites esté siempre actualizada.
    this.imagen = await createImageBitmap(b64toBlob(textura));
    const W = 128;
    const H = 128;

    const canvas = new OffscreenCanvas(W, H);
    const ctx = canvas.getContext("2d", {willReadFrequently: true, alpha: false });
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = "#FF00FF";
    ctx.fillRect(0, 0, W, H);

    ctx.drawImage(this.imagen, 
      0, 0,  // sx, sy
      W, H,  // s width, s height
      0, 0,  // dx, dy
      W, H   // d width, s height
    );

    const pixels = ctx.getImageData(0, 0, W, H);
    this.pixels = pixels;
  }

  borrar() {
    this.rectanguloRGB(0, 0, 128, 128, 137, 135, 135);
  }

  rectanguloRGB(_x, _y, ancho, alto, r, g, b) {
    let data = this.imageData.data;
    let i = 0;

    for (let x=_x; x<ancho; x++) {
      for (let y=_y; y<alto; y++) {
        let i = (y * 128 + x) * 4;
        data[i+0] = r;
        data[i+1] = g;
        data[i+2] = b;
        data[i+3] = 255;
      }
    }

    this.posicionUltimoPrint = 0;
  }

  azar(a, b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
  }

  seno(r) {
    return Math.sin(r);
  }

  coseno(r) {
    return Math.cos(r);
  }

  tangente(r) {
    return Math.tan(r);
  }

  arcotangente(r) {
    return Math.atan(r);
  }

  arcotangente2(r) {
    return Math.atan2(r);
  }

  pixel(x, y, color) {
    let { r, g, b } = this.obtenerColorRGB(color);
    x = x >> 0;
    y = y >> 0;

    if (x < 0 || y < 0) {
      return;
    }

    if (x >= 128 || y >= 128) {
      return;
    }

    let i = (y * 128 + x) * 4;

    this.imageData.data[i+0] = r;
    this.imageData.data[i+1] = g;
    this.imageData.data[i+2] = b;
    this.imageData.data[i+3] = 255;
  }

  rectangulo(x, y, ancho, alto, color, relleno) {
    x = Math.round(x);
    y = Math.round(y);
    ancho = Math.round(ancho);
    alto = Math.round(alto);

    if (relleno) {
      let { r, g, b } = this.obtenerColorRGB(color);
      this.rectanguloRGB(x, y, ancho, alto, r, g, b);
    } else {
      this.linea(x, y, x+ancho-1, y, color);
      this.linea(x+ancho-1, y, x+ancho-1, y+alto-1, color);
      this.linea(x, y+alto-1, x+ancho-1, y+alto-1, color);
      this.linea(x, y, x, y+alto-1, color);
    }
  }

  circulo(x, y, r, color, relleno) {
    x = Math.round(x);
    y = Math.round(y);
    r = Math.round(r);

    for (let i = x - r; i <= x + r; i++) {
      for (let j = y - r; j <= y + r; j++) {
        const distanceSquared = (i - x) ** 2 + (j - y) ** 2;

        if (relleno) {
          if (distanceSquared <= r ** 2) {
            this.pixel(i, j, color);
          }
        } else {
          const tolerance = 0.5; 
          const lowerBound = (r - tolerance) ** 2;
          const upperBound = (r + tolerance) ** 2;

          if (distanceSquared > lowerBound && distanceSquared < upperBound) {
            this.pixel(i, j, color);
          }
        }
      }
    }
  }

  linea(x, y, x1, y1, color) {
    const dx = x1 - x;
    const dy = y1 - y;

    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    const incrementX = dx / steps;
    const incrementY = dy / steps;

    for (let i = 0; i <= steps; i++) {
      const currentX = x + incrementX * i;
      const currentY = y + incrementY * i;
      this.pixel(currentX >> 0, currentY >> 0, color)
    }
  }

  pintar(color) {
    this.rectangulo(0, 0, 128, 128, color, true);
    this.posicionUltimoPrint = 0;
  }

  sonido(indice) {
    self.postMessage({ callback: "sonido", argumento: indice });
  }

  notificar_ejecucion_de_linea(numero) {
    self.postMessage({
      callback: "notificar-ejecucion-de-linea",
      numero: numero
    });
  }

  print(texto, color, x, y) {
    const paso = 8;
    let avanzarLineas = false;
    let hacerScroll = false;
    texto = `${texto}`.toLowerCase();

    if (x === undefined || y === undefined) {
      x = 0;

      if (this.posicionUltimoPrint >= 128) {
        this.posicionUltimoPrint = 120;
        hacerScroll = true;
      }

      y = this.posicionUltimoPrint;
      avanzarLineas = true;
    }

    // si el print va a pasar la parte inferior de la pantalla, produce
    // un salto de linea, desplazando toda la pantalla hacia arriba y luego
    // continua.
    if (hacerScroll) {
      let data = this.imageData.data;

      // Si tiene que hacer scroll, intenta sobre escribir todos
      // los píxeles del buffer, para eliminar la primer linea del
      // y=0 al y=8.
      for (let x=0; x<128; x++) {
        for (let y=0; y<120; y++) {
          let si = ((y+8) * 128 + x) * 4;
          let di = (y * 128 + x) * 4;

          data[di+0] = data[si+0];
          data[di+1] = data[si+1];
          data[di+2] = data[si+2];
          data[di+3] = data[si+3];
        }
      }

      // Luego, con lo que queda de la pantalla, es decir de y=120
      // a y=127 rellena con el color gris así:
      for (let x=0; x<128; x++) {
        for (let y=120; y<128; y++) {
          let i = (y * 128 + x) * 4;
          data[i+0] = 137;
          data[i+1] = 135;
          data[i+2] = 135;
          data[i+3] = 255;
        }
      }

    }

    for (let i = 0; i < texto.length; i++) {
      let letra = texto[i];
      let matriz = letras[letra]; // nota: letras es un símbolo importado, ver el archivo js/letras.js

      if (matriz) {
        for (let fila=0; fila<matriz.length; fila++) {
          for (let columna=0; columna<matriz[fila].length; columna++) {
            if (matriz[fila][columna]) {
              this.pixel(1+x+columna + 6*i, y+fila, color);
             } 
          }
        }
      }
    }

    if (avanzarLineas) {
      this.posicionUltimoPrint += paso;
      //if (this.posicionUltimoPrint <= 128 -8 - paso) {
        //this.posicionUltimoPrint += paso;
      //}
    }
  }

  distancia(x1, y1, x2, y2) {
    const a = x1 - x2;
    const b = y1 - y2;
    return Number.parseInt(Math.sqrt(a*a + b*b), 10);
  }
}

export default Motor;
