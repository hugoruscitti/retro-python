class CanvasNuevo {

  constructor(canvas, contenedor) {
    this.canvas = canvas;

    // todo: completar esto mirando el archivo js/canvas.js
    this.variables = {
      mouse_y: false,
      mouse_x: false,
      click: false,
      espacio: false,
      izquierda: false,
      derecha: false,
      arriba: false,
      abajo: false,
    }

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

      console.log(scale);
        scale = Math.floor(scale);
        canvas.style.width = `${Math.round(scale * canvas.width)}px`;
        canvas.style.height = `${Math.round(scale * canvas.height)}px`;
      }

    // TODO: evitar exponer esta función acá, en lugar
    // de eso generar un evento y responder a el.
    window.ajustarTamaño = ajustarTamaño; 

  }

  obtenerColor(key, defaultValue = 0x000000) {
    const indice = this.obtenerIndiceDeColor(key)
    const colorFinal = this.colores[indice] || defaultValue;
    return colorFinal;
  }
  obtenerIndiceDeColor(numero) {
    return Math.floor(Math.abs(numero || 0)) % 16;
  }

  actualizarTextura(textura) {
    console.log(`Se debe actualizar la textura`);
  }


  borrar() {
    this.ctx.clearRect(0, 0, 128, 128);
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




  flip() {
  }

  print(texto, color, x, y) {
    if (x === undefined) {
      x = 0;
    }

    if (y === undefined) {
      y = this.posicionUltimoPrint;
    }

    const letterMap = {
      "0": [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 1, 1, 1, 0], 
      ],
      "1": [
        [0, 0, 1, 0, 0], 
        [0, 1, 1, 0, 0], 
        [1, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [1, 1, 1, 1, 1], 
        [0, 0, 0, 0, 0], 
      ],
      "2": [
        [0, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [0, 0, 0, 0, 1], 
        [0, 0, 0, 1, 0], 
        [0, 0, 1, 0, 0], 
        [0, 1, 0, 0, 0], 
        [1, 1, 1, 1, 1], 
        [0, 0, 0, 0, 0], 
      ],
      "3": [
        [0, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [0, 0, 0, 0, 1], 
        [0, 0, 1, 1, 0], 
        [0, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 1, 1, 1, 0], 
      ],
"4": [
  [0, 0, 0, 1, 1], 
  [0, 0, 1, 0, 1], 
  [0, 1, 0, 0, 1], 
  [1, 0, 0, 0, 1], 
  [1, 1, 1, 1, 1], 
  [0, 0, 0, 0, 1], 
  [0, 0, 0, 0, 1], 
  [0, 0, 0, 0, 0], 
],
      "5": [
        [1, 1, 1, 1, 1], 
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
        [0, 1, 1, 1, 0], 
        [0, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 1, 1, 1, 0], 
      ],
      "6": [
        [0, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 0], 
        [1, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 1, 1, 1, 0], 
      ],
      "7": [

        [1, 1, 1, 1, 1], 
        [0, 0, 0, 0, 1], 
        [0, 0, 0, 0, 1], 
        [0, 0, 0, 1, 0], 
        [0, 0, 1, 0, 0], 
        [0, 1, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
      ],
      "8": [

        [0, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 1, 1, 1, 0], 
      ],
      "9": [
        [0, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 1, 1, 1, 1], 
        [0, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 1, 1, 1, 0], 
      ],
      "a": [

        [0, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 1, 1, 1, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 0, 0, 0, 0], 
      ],
      "b": [

        [1, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 1, 1, 1, 0], 
      ],
      "c": [

        [0, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 1], 
        [0, 1, 1, 1, 0], 
        [1, 1, 1, 1, 1], 
      ],
      "d": [

        [1, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 1, 1, 1, 0], 
      ],
      "e": [

        [1, 1, 1, 1, 1], 
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
        [1, 1, 1, 1, 0], 
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
        [1, 1, 1, 1, 1], 
        [0, 0, 0, 0, 0], 
      ],
      "f": [

        [1, 1, 1, 1, 1], 
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
        [1, 1, 1, 1, 0], 
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
      ],
      "g": [

        [0, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 0], 
        [1, 0, 1, 1, 1], 
        [1, 0, 0, 0, 1], 
        [0, 1, 1, 1, 0], 
      ],
      "h": [
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 1, 1, 1, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
      ],
      "i": [

        [1, 1, 1, 1, 1], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [1, 1, 1, 1, 1], 
        [0, 0, 0, 0, 0], 
      ],
      "j": [

        [1, 1, 1, 1, 1], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [1, 0, 1, 0, 0], 
        [1, 0, 1, 0, 0], 
        [0, 1, 1, 0, 0], 
      ],
      "k": [

        [1, 0, 0, 0, 1], 
        [1, 0, 0, 1, 0], 
        [1, 0, 1, 0, 0], 
        [1, 1, 0, 0, 0], 
        [1, 0, 1, 0, 0], 
        [1, 0, 0, 1, 0], 
        [1, 0, 0, 0, 1], 
        [0, 0, 0, 0, 0], 
      ],
      "l": [

        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
        [1, 1, 1, 1, 1], 
        [0, 0, 0, 0, 0], 
      ],
      "m": [

        [1, 0, 0, 0, 1], 
        [1, 1, 0, 1, 1], 
        [1, 0, 1, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 0, 0, 0, 0], 
      ],
      "n": [

        [1, 0, 0, 0, 1], 
        [1, 1, 0, 0, 1], 
        [1, 0, 1, 0, 1], 
        [1, 0, 0, 1, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 0, 0, 0, 0], 
      ],
      "o": [

        [0, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 1, 1, 1, 0], 
      ],
      "p": [

        [1, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 1, 1, 1, 0], 
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
      ],
      "q": [

        [0, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 1, 1, 1, 0], 
        [0, 0, 0, 0, 1], 
        [0, 0, 0, 0, 0], 
      ],
      "r": [

        [1, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 1, 1, 1, 0], 
        [1, 0, 1, 0, 0], 
        [1, 0, 0, 1, 0], 
        [1, 0, 0, 0, 1], 
        [0, 0, 0, 0, 0], 
      ],
      "s": [

        [0, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 0], 
        [0, 1, 1, 1, 0], 
        [0, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 1, 1, 1, 0], 
      ],
      "t": [

        [1, 1, 1, 1, 1], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
      ],
      "u": [

        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 1, 1, 1, 0], 
      ],
      "v": [

        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 1, 0, 1, 0], 
        [0, 1, 0, 1, 0], 
        [0, 1, 0, 1, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
      ],
      "w": [

        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [1, 0, 1, 0, 1], 
        [1, 0, 1, 0, 1], 
        [1, 0, 1, 0, 1], 
        [0, 1, 0, 1, 0], 
      ],
      "x": [

        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 1, 0, 1, 0], 
        [0, 0, 1, 0, 0], 
        [0, 1, 0, 1, 0], 
        [1, 0, 0, 0, 1], 
        [1, 0, 0, 0, 1], 
        [0, 0, 0, 0, 0], 
      ],
      "y": [

        [1, 0, 0, 0, 1], 
        [0, 1, 0, 1, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
      ],
      "z": [

        [1, 1, 1, 1, 1], 
        [0, 0, 0, 0, 1], 
        [0, 0, 0, 1, 0], 
        [0, 0, 1, 0, 0], 
        [0, 1, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
        [1, 1, 1, 1, 1], 
        [0, 0, 0, 0, 0], 
      ],
      "_": [

        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [1, 1, 1, 1, 1], 
      ],
      ".": [

        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 1, 0, 0], 
      ],
      ",": [

        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 1, 0, 0, 0], 
      ],
      "!": [

        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 1, 0, 0], 
      ],
      "?": [

        [0, 1, 1, 1, 0], 
        [1, 0, 0, 0, 1], 
        [0, 0, 0, 0, 1], 
        [0, 0, 0, 1, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 1, 0, 0], 
      ],
      ":": [

        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
      ],
      ";": [

        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 1, 0, 0, 0], 
      ],
      "(": [

        [0, 0, 0, 1, 0], 
        [0, 0, 1, 0, 0], 
        [0, 1, 0, 0, 0], 
        [0, 1, 0, 0, 0], 
        [0, 1, 0, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 0, 1, 0], 
      ],
      ")": [

        [0, 1, 0, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 0, 1, 0], 
        [0, 0, 0, 1, 0], 
        [0, 0, 0, 1, 0], 
        [0, 0, 1, 0, 0], 
        [0, 1, 0, 0, 0], 
      ],
      "[": [

        [0, 1, 1, 1, 0], 
        [0, 1, 0, 0, 0], 
        [0, 1, 0, 0, 0], 
        [0, 1, 0, 0, 0], 
        [0, 1, 0, 0, 0], 
        [0, 1, 0, 0, 0], 
        [0, 1, 1, 1, 0], 
      ],
      "]": [

        [0, 1, 1, 1, 0], 
        [0, 0, 0, 1, 0], 
        [0, 0, 0, 1, 0], 
        [0, 0, 0, 1, 0], 
        [0, 0, 0, 1, 0], 
        [0, 0, 0, 1, 0], 
        [0, 1, 1, 1, 0], 
      ],
      "{": [

        [0, 0, 1, 1, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 1, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 1, 0], 
      ],
      "}": [

        [0, 1, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 1, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 1, 1, 0, 0], 
      ],
      "<": [

        [0, 0, 0, 1, 0], 
        [0, 0, 1, 0, 0], 
        [0, 1, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
        [0, 1, 0, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 0, 1, 0], 
      ],
      ">": [

        [0, 1, 0, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 0, 1, 0], 
        [0, 0, 0, 0, 1], 
        [0, 0, 0, 1, 0], 
        [0, 0, 1, 0, 0], 
        [0, 1, 0, 0, 0], 
      ],
      "-": [

        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 1, 1, 1, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
      ],
      "+": [

        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 1, 1, 1, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
      ],
      "/": [

        [0, 0, 0, 0, 1], 
        [0, 0, 0, 1, 0], 
        [0, 0, 0, 1, 0], 
        [0, 0, 1, 0, 0], 
        [0, 1, 0, 0, 0], 
        [0, 1, 0, 0, 0], 
        [1, 0, 0, 0, 0], 
      ],
      "\\": [
        [1, 0, 0, 0, 0], 
        [0, 1, 0, 0, 0], 
        [0, 1, 0, 0, 0], 
        [0, 0, 1, 0, 0], 
        [0, 0, 0, 1, 0], 
        [0, 0, 0, 1, 0], 
        [0, 0, 0, 0, 1], 
        [0, 0, 0, 0, 0], 
      ],

    }

    for (let i = 0; i < texto.length; i++) {
      let letra = texto[i];
      let matriz = letterMap[letra];

      if (matriz) {
        console.log({filas: matriz.length});
        for (let fila=0; fila<matriz.length; fila++) {
          console.log({columnas: matriz[fila].length});
          for (let columna=0; columna<matriz[fila].length; columna++) {
            if (matriz[fila][columna]) {
              this.pixel(x+columna + 6*i, y+fila, color);
             } 
          }
        }
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


