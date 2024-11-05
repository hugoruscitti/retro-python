import { enviarMensaje } from "../bus.js";

class ServicioPython {

  constructor() {
    this.pyodide = null;
  }

  async iniciar() {
    this.pyodide = await loadPyodide();
  }

  async ejecutar(codigoOriginal, textura, contexto) {
    this.pyodide.registerJsModule("contexto", contexto);

    try {
      console.log("🔥 Detectando código para ejecutar, este es el código original")
      console.log(codigoOriginal);

      this.pyodide.globals.set("__codigo", codigoOriginal);

      let codigo = this.pyodide.runPython(`
import ast
import contexto
import asyncio

def alerta(nombre="sin nombre"):
  contexto.canvas.alerta(nombre)

def linea(x, y, x1, y1, color):
  contexto.canvas.linea(x, y, x1, y1, color)

def azar(a=0, b=128):
  return contexto.canvas.azar(a, b)

async def __inicio():
  borrar()
  await asyncio.sleep(0.1)

async def esperar(cuadros=30):
  for x in range(cuadros):
    # se hacen pausas muy cortitas, y en cada una
    # de ellas se intenta ver si el programa se
    # interrumpe o no.
    if contexto.continuar_ejecucion():
      await asyncio.sleep(1/30)
    else:
      terminar()

def terminar():
    exit(0)

def __fin():
  contexto.__fin()

def pintar(color):
  contexto.canvas.pintar(color)


def borrar():
  contexto.canvas.borrar()

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
    pausa = ast.parse("await esperar(1)")
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
      linea: c.linea.bind(c),

      circulo: c.circulo.bind(c),
      dibujar: c.dibujar.bind(c),
      rectangulo: c.rectangulo.bind(c),
      azar: c.azar.bind(c),
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