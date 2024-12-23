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

  actualizarTextura(textura) {
    console.log(`Se debe actualizar la textura`);
  }


  borrar() {
    this.ctx.clearRect(0, 0, 128, 128);
  }

  azar(a, b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
  }

  pintar(color) {
    this.rectangulo(0, 0, 128, 128, color, true);
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

  obtenerIndiceDeColor(numero) {
    return Math.floor(Math.abs(numero || 0)) % 16;
  }

  obtenerColor(key, defaultValue = 0x000000) {
    const indice = this.obtenerIndiceDeColor(key)
    const colorFinal = this.colores[indice] || defaultValue;
    return colorFinal;
  }

  flip() {
  }
}

export default CanvasNuevo;


