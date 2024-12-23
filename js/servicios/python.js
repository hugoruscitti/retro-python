import { enviarMensaje } from "../bus.js";

class ServicioPython {

  constructor() {
    this.pyodide = null;
  }

  async iniciar() {
    this.pyodide = await loadPyodide();
    await this.pyodide.loadPackage("jedi");
  }

  async ejecutar(codigoOriginal, textura, contexto) {
    this.pyodide.registerJsModule("contexto", contexto);

    contexto.canvas.actualizarTextura(textura);
    //contexto.canvas.textures.remove('sprites');
    //contexto.canvas.load.spritesheet("sprites", textura, { frameWidth: 8, frameHeight: 8 } );
    //contexto.canvas.load.start();

    try {
      console.log("🔥 Detectando código para ejecutar, este es el código original")
      console.log(codigoOriginal);

      this.pyodide.globals.set("__codigo", codigoOriginal);

      let codigo = this.pyodide.runPython(`
import ast
import contexto
import asyncio

mouse_x = 64
mouse_y = 64
cuadro = 0
click = False

def __flip():
  contexto.canvas.flip()

def __actualizar_globales():
  global cuadro
  global mouse_x, mouse_y, click
  global espacio, izquierda, derecha, arriba, abajo

  cuadro += 1

  mouse_x = contexto.canvas.variables.mouse_x
  mouse_y = contexto.canvas.variables.mouse_y
  click = contexto.canvas.variables.click

  espacio = contexto.canvas.variables.espacio
  izquierda = contexto.canvas.variables.izquierda
  derecha = contexto.canvas.variables.derecha
  arriba = contexto.canvas.variables.arriba
  abajo = contexto.canvas.variables.abajo

def linea(x, y, x1, y1, color):
  contexto.canvas.linea(x, y, x1, y1, color)

def azar(a=0, b=128):
  return contexto.canvas.azar(a, b)

def seno(r):
  return contexto.canvas.seno(r)

def coseno(r):
  return contexto.canvas.coseno(r)

def arcotangente(r):
  return contexto.canvas.arcotangente(r)

def arcotangente2(r):
  return contexto.canvas.arcotangente2(r)

async def __inicio():
  borrar()
  __actualizar_globales()
  await asyncio.sleep(0.1)

async def esperar(segundos=1):
  espera = min(segundos, 1/30)

  while segundos > 0:
    # se hacen pausas muy cortitas, y en cada una
    # de ellas se intenta ver si el programa se
    # interrumpe o no.
    if contexto.continuar_ejecucion():
      __actualizar_globales()
      __flip()
      await asyncio.sleep(espera)
      segundos -= espera
    else:
      terminar()

def terminar():
    __flip()
    exit(0)

def __fin():
  __flip()
  contexto.__fin()

def pintar(color):
  contexto.canvas.pintar(color)

def circulo(x, y, radio, color, relleno):
  contexto.canvas.circulo(x, y, radio, color, relleno)

def dibujar(indice, x, y):
  # si en lugar de un número se envía una lista, intenta hacer
  # una animación tomando cuadros de animación de esa lista.
  if type(indice).__name__ == "list":
    i = cuadro % len(indice)
    indice = indice[i]

  contexto.canvas.dibujar(indice, x, y)

def borrar():
  contexto.canvas.borrar()

def distancia(x1, y1, x2, y2):
  return contexto.canvas.distancia(x1, y1, x2, y2)

def rectangulo(x, y, width, height, color, relleno):
  contexto.canvas.rectangulo(x, y, width, height, color, relleno)

def pixel(x, y, color):
  contexto.canvas.pixel(x, y, color)

def print(mensaje, color=0, x=None, y=None):
  contexto.canvas.print(mensaje, color, x, y)

def sonido(indice=None):
  contexto.canvas.sonido(indice)

# __codigo viene de JavaScript
nodo = ast.parse(__codigo)

class Transformador(ast.NodeTransformer):

  # Agrega __inicio() y __fin() al principio y
  # final del programa.
  def visit_Module(self, nodo):
    super().generic_visit(nodo)
    nodo.body.insert(0, ast.parse("await __inicio()"))
    nodo.body.append(ast.parse("__fin()"))
    return nodo

  # al final de cada while, agrega una pausa para poder
  # crear main-loops.
  def visit_While(self, nodo):
    super().generic_visit(nodo)
    pausa = ast.parse("await esperar(1/30)")
    nodo.body.append(pausa)
    return nodo

  def visit_Call(self, nodo):
    if isinstance(nodo.func, ast.Name):
      # solo si encuentra una llamada a la función 'esperar'
      # reemplazará la sentencia por 'await esperar...'
      if nodo.func.id == "esperar":
        nodo_await = ast.parse("await esperar(0)")
        nodo_await.body[0].value.value = nodo
        return nodo_await.body[0].value
    return nodo

nodo = Transformador().visit(nodo)


# Requiere pyton 3.9
# la siguiente linea debería retornar el string
# del código modificado a JavaScript
ast.unparse(nodo)`);

      /*
       * TODO exponer estas funciones
       *
      dibujar: c.dibujar.bind(c),
      print: c.print.bind(c),

      seno: c.seno.bind(c),
      coseno: c.coseno.bind(c),
      tangente: c.tangente.bind(c),
      arcotangente: c.arcotangente.bind(c),
      arcotangente2: c.arcotangente2.bind(c),

      pixel: c.pixel.bind(c),
      flip: c.flip.bind(c),

      sonido: c.sonido.bind(c),


    */

      console.log("🤖 Aplicando conversión de código a través de un AST")

      console.log("🔥 Luego de la conversión, este es el código que se ejecutará");
      console.log(codigo)

      await this.pyodide.runPythonAsync(codigo);

    } catch (error) {

      // se considera que si el programa llamó a terminar/exit(0)
      // entonces no es un error, y se asumirá como una finalización
      // del programa.
      if (error.message.includes("SystemExit: 0")) {
        return;
      }

      const detalleCompleto = error.message.split("\n");
      const cantidad = detalleCompleto.length;

      // solo envía la última parte del error, para evitar todo
      // lo relacionado con las partes internas la de la herramienta.
      const ultimaLlamada = error.message.lastIndexOf("File ");
      const detalle = error.message.slice(ultimaLlamada, error.message.length)

      enviarMensaje(this, "señal-mostrar-error", {
        detalle: detalle.split("\n")
      });

    }
  }
}


const python = new ServicioPython();

export { python };
