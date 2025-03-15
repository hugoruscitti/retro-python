import letras from "./letras.js";

class CanvasNuevo {

  constructor(canvas, contenedor) {
    this.canvas = canvas;

    this.variables = {
      mouse_y: 22,
      mouse_x: 4444,
      click: false,
      espacio: false,
      izquierda: false,
      derecha: false,
      arriba: false,
      abajo: false,
    }

    this.conectarEventos(canvas);

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

    this.posicionUltimoPrint = 0
    const ctx = canvas.getContext("2d");
    this.ctx = ctx;

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
      }

    // TODO: evitar exponer esta función acá, en lugar
    // de eso generar un evento y responder a el.
    window.ajustarTamaño = ajustarTamaño; 

  }

  conectarEventos(canvas) {
    function cuandoPulsaTecla(evento) {
      console.log("down", evento);
    }

    function cuandoSueltaTecla(evento) {
      console.log("up", evento);
    }

    //window.addEventListener("keydown", cuandoPulsaTecla, false);
    //window.addEventListener("keyup", cuandoSueltaTecla, false);

    canvas.addEventListener("mousemove", (evento) => {
      const escala = evento.target.clientWidth / 128;
      const x = Math.floor(evento.offsetX / escala);
      const y = Math.floor(evento.offsetY / escala);

      //console.log({x, y});
      this.variables.mouse_x = x;
      this.variables.mouse_y = y;

    }, false);
  }

  actualizar() {
    return this.variables;
  }

  obtenerColor(key, defaultValue = 0x000000) {
    const indice = this.obtenerIndiceDeColor(key)
    const colorFinal = this.colores[indice] || defaultValue;
    return colorFinal;
  }

  obtenerIndiceDeColor(numero) {
    return Math.floor(Math.abs(numero || 0)) % 16;
  }

  async actualizarTextura(textura) {
    return new Promise((success) => {
      this.image = new Image();
      this.image.onload = function() {
        success();
      };
      this.image.src = textura;
    });
  }

  dibujar(indice, x, y) {
    const columna = indice % 16;
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    this.ctx.drawImage(this.image, columna * 8, 0, 8, 8, x, y, 8, 8);
  }

  borrar() {
    this.ctx.clearRect(0, 0, 128, 128);
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
    const ctx = this.ctx;
    ctx.fillStyle = this.obtenerColor(color);
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }

  linea(x, y, x1, y1, color) {
    const ctx = this.ctx;

    ctx.fillStyle = this.obtenerColor(color);

    const dx = x1 - x;
    const dy = y1 - y;

    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    const incrementX = dx / steps;
    const incrementY = dy / steps;

    for (let i = 0; i <= steps; i++) {
      const currentX = x + incrementX * i;
      const currentY = y + incrementY * i;

      ctx.fillRect(Math.round(currentX), Math.round(currentY), 1, 1);
    }

  }

  pintar(color) {
    this.rectangulo(0, 0, 128, 128, color, true);
    this.posicionUltimoPrint = 0;
  }

  circulo(x, y, r, color, relleno) {
    x = Math.round(x);
    y = Math.round(y);
    r = Math.round(r);
    // Loop over a bounding box around the circle
    for (let i = x - r; i <= x + r; i++) {
      for (let j = y - r; j <= y + r; j++) {
        // Check if the point (i, j) is inside the circle using the equation (i - x)^2 + (j - y)^2 <= r^2
        const distanceSquared = (i - x) ** 2 + (j - y) ** 2;

        if (relleno) {
          // For a filled circle, include all points inside the circle
          if (distanceSquared <= r ** 2) {
            this.pixel(i, j, color);
          }
        } else {
          // For a hollow circle, only include points that are on the circumference
          const tolerance = 1; // This tolerance helps us ensure the edge is visible
          const lowerBound = (r - tolerance) ** 2;  // A little smaller than r^2
          const upperBound = (r + tolerance) ** 2;  // A little larger than r^2

          // Check if the point is close enough to the circumference
          if (distanceSquared >= lowerBound && distanceSquared <= upperBound) {
            this.pixel(i, j, color);
          }
        }
      }
    }
  }

  rectangulo(x, y, ancho, alto, color, relleno) {
    const ctx = this.ctx;

    x = Math.round(x);
    y = Math.round(y);
    ancho = Math.round(ancho);
    alto = Math.round(alto);

    if (relleno) {
      ctx.fillStyle = this.obtenerColor(color);
      ctx.fillRect(x, y, ancho, alto);
    } else {
      this.linea(x, y, x+ancho-1, y, color);
      this.linea(x+ancho-1, y, x+ancho-1, y+alto-1, color);
      this.linea(x, y+alto-1, x+ancho-1, y+alto-1, color);
      this.linea(x, y, x, y+alto-1, color);
    }
  }

  print(texto, color, x, y) {
    let avanzarLineas = false;

    if (x === undefined || y === undefined) {
      x = 0;
      y = this.posicionUltimoPrint;
      avanzarLineas = true;
    }

    // si el print va a pasar la parte inferior de la pantalla, produce
    // un salto de linea, desplazando toda la pantalla hacia arriba y luego
    // continua.
    if (avanzarLineas) {
      if (this.posicionUltimoPrint + 10 >= 128) {
        const data = this.ctx.getImageData(0, 0, 128, 128);
        this.ctx.clearRect(0, 0, 128, 128);
        this.ctx.putImageData(data, 0, -10);
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
      if (this.posicionUltimoPrint <= 110) {
        this.posicionUltimoPrint += 10;
      }
    }
  }

  sonido(indice) {
    let tipo = "random";
    const tiposDeSonidos = [
      "pickupCoin",
      "laserShoot",
      "explosion",
      "powerUp",
      "hitHurt",
      "jump",
      "blipSelect",
      "synth",
      "tone",
      "click",
    ]

    if (indice !== undefined) {
      indice = Math.floor(Math.abs(indice)) % tiposDeSonidos.length;
      tipo = tiposDeSonidos[indice];
    }

    const sonido = sfxr.generate(tipo);
    sfxr.play(sonido);
  }

  distancia(x1, y1, x2, y2) {
    const a = x1 - x2;
    const b = y1 - y2;
    return parseInt(Math.sqrt(a*a + b*b), 10);
  }
}

export default CanvasNuevo;


