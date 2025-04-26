/*jshint esversion: 8 */
const CAPTURAR_ERRORES = false;

// webworker.mjs
import { loadPyodide } from "../../pyodide/pyodide.mjs";
import Motor from "./motor.js";

let pyodideReadyPromise = loadPyodide();

let ctx = null;


const motor = new Motor();



async function ejecutarEnPyodide(pyodide, id, codigo, contexto) {
  const dict = pyodide.globals.get("dict");
  const globals = dict(Object.entries(contexto));
  const codigoModificado = await pyodide.runPythonAsync(codigo, { globals });

  console.groupCollapsed("El código a ejecutar será este");
  console.log(codigo + codigoModificado);
  console.groupEnd();

  const resultado = await pyodide.runPythonAsync(codigoModificado, { globals });

  self.postMessage({ resultado, id });
}



self.onmessage = async (event) => {
  //console.log(`Llega el evento evento data=${JSON.stringify(event.data)}`);

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
    motor.conectarCanvas(event.data.canvas);
    //const canvas = event.data.canvas;

    //ctx = canvas.getContext("2d", {willReadFrequently: false, alpha: false });
    //ctx.imageSmoothingEnabled = false;

    return;
  }

  if (event.data.id.startsWith("ejecutar-id")) {
    const pyodide = await pyodideReadyPromise;
    let { id, python, context } = event.data;
    motor.mantenerEjecucion = true;

    context.motor = motor;
    await context.motor.actualizarTextura(context.textura, context.anchoDeTextura, context.altoDeTextura);
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
buffer = []

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
  global buffer

  mouse_x = motor.mouse_x
  mouse_y = motor.mouse_y
  click = motor.click

  izquierda = motor.izquierda
  derecha = motor.derecha
  arriba = motor.arriba
  abajo = motor.abajo
  boton = motor.boton
  boton_secundario = motor.boton_secundario
  motor.actualizarPantalla()
  buffer = motor.imageData.data

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
  #
  # También coloca una llamada a "borrar()" al principio
  # y una llamada a "esperar" al final para que se dibuje
  # la pantalla.
  #
  # Poner el código dentro de una función __main() es
  # importante porque esto permite que el script pueda
  # ser terminado con la sentencia "return".
  def visit_Module(self, nodo):
    super().generic_visit(nodo)

    nodo.body.insert(0, ast.parse("""
if True:
    for x in range(7):
        for x in range(128):
            for y in range(128):
                pixel(x, y, 5+azar()%3)
        await esperar(1/60)
    borrar()
"""))
    #nodo.body.insert(0, ast.parse("borrar()"))








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

    ast_funcion_main.body.append(ast.parse("esperar(1/100)"))
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

    if (CAPTURAR_ERRORES) {
      try {
        await ejecutarEnPyodide(pyodide, id, codigoInicial, context);
      } catch (error) {
        console.log(error);
        self.postMessage({ error: error.message, id });
      }
    } else {
      await ejecutarEnPyodide(pyodide, id, codigoInicial, context);
    }

  }




};
