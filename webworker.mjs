const DEBUG_WORKER = true;

// webworker.mjs
import { loadPyodide } from "./pyodide/pyodide.mjs";
import { hex } from "./js/pixels.js";
import letras from "./js/letras.js";

let pyodideReadyPromise = loadPyodide();

let ctx = null;



class Motor {

  constructor() {
    this.posicionUltimoPrint = 0
    this.mantenerEjecucion = true;

    this.reiniciar_variables()

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
    const indice = this.obtenerIndiceDeColor(key)
    const colorFinal = this.colores[indice] || defaultValue;
    return colorFinal;
  }

  dibujar(indice, x, y) {
    const columna = indice % 16;
    const fila = parseInt(indice / 16, 10);
    x = parseInt(x, 10);
    y = parseInt(y, 10);

    ctx.drawImage(this.imagen, 
      columna * 8, fila * 8,  // sx, sy
      8, 8,            // s width, s height
      x, y,            // dx, dy
      8, 8             // d width, s height
    );
  }

  obtenerPixel(indice, x, y) {
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    const pixel = this.pixels;
    const pos = (y * 128 + x) * 4;

    const r = hex(pixel.data[pos + 0]);
    const g = hex(pixel.data[pos + 1]);
    const b = hex(pixel.data[pos + 2]);
    const color = `#${r}${g}${b}`.toUpperCase();

    // si es un pixel transparente retorna null.
    if (color == "#FF00FF") {
      return -1
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
    const ctx = canvas.getContext('2d');

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
    ctx.fillStyle = "#898787";
    ctx.fillRect(0, 0, 128, 128);
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
    ctx.fillStyle = this.obtenerColor(color);
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }

  rectangulo(x, y, ancho, alto, color, relleno) {
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
    texto = `${texto}`.toLowerCase()

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
        const data = ctx.getImageData(0, 0, 128, 128);
        ctx.putImageData(data, 0, -8);
        ctx.fillStyle = "#898787";
        ctx.fillRect(0, 120, 128, 8);
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
    return parseInt(Math.sqrt(a*a + b*b), 10);
  }
}


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


const motor = new Motor();

self.onmessage = async (event) => {

  if (event.data.id === "detener") {
    motor.mantenerEjecucion = false;
    return;
  }

  if (event.data.id === "evento-del-mouse") {
    motor.mouse_x = event.data.evento.x;
    motor.mouse_y = event.data.evento.y;

    if ("click" in event.data.evento) {
      motor.click = event.data.evento.click;
    }

    return;
  }

  if (event.data.id === "actualizar-el-estado-del-teclado") {
    const evento = event.data.evento;

    if ('izquierda' in evento) {
      motor.izquierda = evento.izquierda;
    }

    if ('derecha' in evento) {
      motor.derecha = evento.derecha;
    }

    if ('arriba' in evento) {
      motor.arriba = evento.arriba;
    }

    if ('abajo' in evento) {
      motor.abajo = evento.abajo;
    }

    if ('boton' in evento) {
      motor.boton = evento.boton;
    }

    if ('boton_secundario' in evento) {
      motor.boton_secundario = evento.boton_secundario;
    }

    if ('shift' in evento) {
      motor.shift = evento.shift;
    }

    return;
  }

  if (event.data.id === "conectar-el-canvas") {
    const canvas = event.data.canvas;

    ctx = canvas.getContext("2d", {willReadFrequently: true, alpha: false });

    return;
  }

  if (event.data.id.startsWith("ejecutar-id")) {
    const pyodide = await pyodideReadyPromise;
    let { id, python, context } = event.data;
    motor.mantenerEjecucion = true;

    context.motor = motor;
    await context.motor.actualizarTextura(context.textura, context.anchoDeTextura, context.altoDeTextura)
    context.__codigo = python;

    const codigoInicial = `

# La primer parte de este código son una serie de funciones que
# formarán parte del scope global de retro-python, por ejemplo
# las funciones "linea", "circulo", "borrar" etc..

import asyncio


# Todas estas variables sirven para crear
# juegos interactivos, el valor de las variables
# se actualiza en la función __actualizar_globales

mouse_x = 0
mouse_y = 0
click = False
izquierda = False
derecha = False
arriba = False
abajo = False
boton = False
camara_x = 0
camara_y = 0
boton_secundario = False
cuadro = 1

motor.reiniciar()

def linea(x, y, x1, y1, color):
  x -= camara_x
  y -= camara_y
  x1 -= camara_x
  y1 -= camara_y
  motor.linea(x, y, x1, y1, color)

def azar(a=0, b=128):
  return motor.azar(a, b)

def seno(r):
  return motor.seno(r)

def coseno(r):
  return motor.coseno(r)

def arcotangente(r):
  return motor.arcotangente(r)

def arcotangente2(r):
  return motor.arcotangente2(r)

def __actualizar_globales():
  # importante: las variables tienen que declararse como
  #             globales aquí y en la función __main
  global cuadro
  global mouse_x, mouse_y, click
  global izquierda, derecha, arriba, abajo
  global boton, boton_secundario

  mouse_x = motor.mouse_x
  mouse_y = motor.mouse_y
  click = motor.click

  izquierda = motor.izquierda
  derecha = motor.derecha
  arriba = motor.arriba
  abajo = motor.abajo
  boton = motor.boton
  boton_secundario = motor.boton_secundario

async def esperar(segundos=1):
  espera = min(segundos, 1/30)

  while segundos > 0:
    # se hacen pausas muy cortitas, y en cada una
    # de ellas se intenta ver si el programa se
    # interrumpe o no.

    if motor.mantenerEjecucion:
      __actualizar_globales()

      # Impone una pausa extra por si el usuario mantiene pulsada
      # la tecla shift.
      if motor.shift:
        print("CAMARA LENTA ...", 0, 1, 2)
        print("CAMARA LENTA ...", 7, 1, 1)
        for x in range(10):
          if motor.shift and motor.mantenerEjecucion:
            await asyncio.sleep(1/10)

      await asyncio.sleep(espera)
      segundos -= espera
    else:
      # Indica que debe finalizar la espera
      return True

def pintar(color):
  motor.pintar(color)

def circulo(x, y, radio, color, relleno):
  x -= camara_x
  y -= camara_y

  motor.circulo(x, y, radio, color, relleno)

def borrar():
  motor.borrar()

def distancia(x1, y1, x2, y2):
  x1 -= camara_x
  y1 -= camara_y
  x2 -= camara_x
  y2 -= camara_y
  return motor.distancia(x1, y1, x2, y2)

def rectangulo(x, y, ancho, alto, color, relleno):
  x -= camara_x
  y -= camara_y
  motor.rectangulo(x, y, ancho, alto, color, relleno)

def pixel(x, y, color):
  x -= camara_x
  y -= camara_y
  motor.pixel(x, y, color)

print_original = print

def print(mensaje, color=0, x=None, y=None):
  motor.print(mensaje, color, x, y)

def dibujar(indice, x=64, y=64):
  global cuadro

  # si en lugar de un número se envía una lista, intenta hacer
  # una animación tomando cuadros de animación de esa lista.

  if type(indice).__name__ == "list":
    i = cuadro % len(indice)
    indice = indice[i]

  motor.dibujar(indice, x - camara_x, y - camara_y)

def sonido(indice=None):
  motor.sonido(indice)

def obtener_pixel(indice, x, y):
  i = motor.obtenerPixel(indice, x, y)

  if i == -1:
    return 0
  else:
    return i

# Esta segunda parte del script se encarga de tomar
# el código que escribió la persona que programó en
# retro-python y lo convierte en una versión de código
# más fácil de ejecutar, interrumpir y procesar.
#
# Por ejemplo, agrega una llamada al principio para
# limpiar la llamada, hace que los ciclos "while True"
# se ejecuten a 30 cuadros por segundo, hace que
# la función "esperar" no necesite el prefijo await
# entre otras cosas más.

import ast

class Transformador(ast.NodeTransformer):

  # Pone todo el código dentro de una función
  # llamada __main() y luego invoca a esa función.
  # También coloca una llamada a "borrar()" al principio.
  #
  # Poner el código dentro de una función __main() es
  # importante porque esto permite que el script pueda
  # ser terminado con la sentencia "return".
  def visit_Module(self, nodo):
    super().generic_visit(nodo)

    nodo.body.insert(0, ast.parse("borrar()"))

    ast_funcion_main = ast.parse("""
async def __main():
  global cuadro
  global mouse_x, mouse_y, click
  global izquierda, derecha, arriba, abajo
  global boton, boton_secundario
  global camara_x, camara_y
await __main()""")
  
    for x in nodo.body:
      ast_funcion_main.body[0].body.append(x)

    return ast_funcion_main

  # Al final de cada while, agrega una pausa para poder
  # crear main-loops y también incrementa el contador
  # de cuadros de animación
  def visit_While(self, nodo):
    super().generic_visit(nodo)


    # busca ver si en el bucle hay una llamada
    # a la función esperar, si no existe ninguna
    # agrega una llamada para que el programa
    # se ejecute a 30 cuadros por segundo.
    #
    # si hay una llamada a esperar, no hace ninguna
    # pausa personalizada. Esto permite que el temporizador
    # sea controlado de forma manual, a veces se quieren
    # hacer juegos que funcionen a 60 fps por ejemplo.

    ## TODO: ¿cómo puedo hacer para saber si quién
    ##       programó el bucle while puso una llamada
    ##       a esperar?
    #for x in nodo.body:
    #  print_original(x.get("value"))

    #if nodo.body[-1].value.__class__.__name__ == 'Call' and nodo.body[-1].value.func.id == "esperar":
    #  pass
    #else:

    pausa = ast.parse("""
__terminar = await esperar(1/60)

if __terminar:
  return

""")

    incrementar_cuadro = ast.parse("global cuadro")
    nodo.body.insert(0, incrementar_cuadro)

    nodo.body.append(pausa)

    incrementar_cuadro = ast.parse("cuadro += 1")
    nodo.body.append(incrementar_cuadro)

    return nodo

  def visit_Call(self, nodo):
    if isinstance(nodo.func, ast.Name):
      # solo si encuentra una llamada a la función 'esperar'
      # reemplazará la sentencia por 'await esperar...'
      if nodo.func.id == "esperar":
        nodo_await = ast.parse("await esperar(0)")
        # aquí tomará el tiempo de espera y lo reutilizará
        nodo_await.body[0].value.value = nodo
        return nodo_await.body[0].value
    return nodo

nodo = ast.parse(__codigo)
nodo = Transformador().visit(nodo)

# La siguiente linea de código retorna un string
# con el código modificado a través del Transformador.
#
# Este string será evaluado por la función
# runPythonAsync.

ast.unparse(nodo)`;

    // Now load any packages we need, run the code, and send the result back.
    await pyodide.loadPackagesFromImports(python);
    // make a Python dictionary with the data from `context`
    const dict = pyodide.globals.get("dict");
    const globals = dict(Object.entries(context));

    try {
      const codigoModificado = await pyodide.runPythonAsync(codigoInicial, { globals });
      console.groupCollapsed("El código a ejecutar será este");
      console.log(codigoInicial + codigoModificado);
      console.groupEnd();
      const resultado = await pyodide.runPythonAsync(codigoModificado, { globals });

      self.postMessage({ resultado, id });
    } catch (error) {
      console.log(error);
      self.postMessage({ error: error.message, id });
    }
  }
};
