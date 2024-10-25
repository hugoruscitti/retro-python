import { hasMainLoopInThisAST, createASTFromPython, replaceMainLoopWithFunction } from "./ast.js";
import Pantalla from "./pantalla.js";
import Editor from "./editor.js";
import Header from "./header.js";
import BotonPublicar from "./boton-publicar.js";
import RunButton from "./run-button.js";
import Interprete from "./interprete.js";
import { Configuracion } from "./configuracion.js";
import Manual from "./manual.js";
import BarraDeBotones from "./retro-barra-de-botones.js"
import AcercaDe from "./retro-acerca-de.js"
import EditorPixelart from "./retro-editor-pixelart.js"
import PixelartCanvas from "./retro-pixelart-canvas.js"
import PixelartColores from "./retro-pixelart-colores.js"
import RetroPythonApp from "./retro-python-app.js"
import RetroEjemplos from "./retro-ejemplos.js"

customElements.define("retro-ejemplos", RetroEjemplos);
customElements.define("retro-python-app", RetroPythonApp);
customElements.define("retro-pixelart-colores", PixelartColores);
customElements.define("retro-pixelart-canvas", PixelartCanvas);
customElements.define("retro-editor-pixelart", EditorPixelart);
customElements.define("retro-acerca-de", AcercaDe);
customElements.define("retro-barra-de-botones", BarraDeBotones);
customElements.define("retro-pantalla", Pantalla);
customElements.define("retro-editor", Editor);
customElements.define("retro-header", Header);
customElements.define("retro-boton-publicar", BotonPublicar);
customElements.define("retro-run-button", RunButton);
customElements.define("retro-interprete", Interprete);
customElements.define("retro-configuracion", Configuracion);
customElements.define("retro-manual", Manual);

// indica si el código está en un loop ejecutando.
var running = false;
var timer = null;
var speed = 30; // velocidad en cuadros por segundo


function stopTimer() {
  if (timer) {
    timer.destroy()
    timer = null;
  }
}

function step() {
  if (running) {
    __bloque_while();
  }
}

function stop() {
  document.getElementById("#stop")
  running = false;
  stopTimer();
}

function show_error(error) {
  alert(error);
}


function __deprecated_run() {
  const code = editor.state.doc.text;
  filbert.defaultOptions.runtimeParamName = "filbert.pythonRuntime"

  if (!running) {
    let ast = null;

    try {
      ast = createASTFromPython(code);
    } catch (e) {
      show_error(e);
      return;
    }
    running = true;

    const hasMainLoop = hasMainLoopInThisAST(ast);

    // debug log para mostrar el programa original
    console.log("%cPrograma original:", "color: #389aff; font-size: large")
    console.log(escodegen.generate(ast))
    console.log(ast);

    //console.log(JSON.stringify(ast, null, 2));

    // Agrega una llamada a la función 'clear()' automáticamente
    // al principio del programa
    const inicio = filbert.parse("clear()")
    ast.body.splice(0, 0, inicio.body[0])

    let acumulador = 0;

    if (hasMainLoop) {
      // si tiene mainloop intenta crear un temporizador
      timer = canvas.time.addEvent({
        delay: 1000 / 30,
        loop: true,
        callback: () => {

          acumulador += 33;

          if (acumulador >= 1000 / speed) {
            acumulador = 0;
            try {
              __bloque_while();
            } catch (e) {
              stop();
              show_error(e);
            }
          }

        }
      });
    }

    if (hasMainLoop) {
      ast.body = replaceMainLoopWithFunction(ast);
    }

    // si el programa tiene main-loop, espone la función para
    // que se pueda llamar desde un temporizador.
    if (hasMainLoop) {
      const bloque_while = filbert.parse("window.__bloque_while = __bloque_while")
      ast.body.push(bloque_while.body[0])
    }

    // marca el fin del programa, llamando a una función 'done'
    // para indicarle al editor que el programa terminó.
    if (!hasMainLoop) {
      const fin = filbert.parse("done()")
      ast.body.push(fin.body[0])
    }

    const js = escodegen.generate(ast);

    console.log("%cPrograma modificado:", "color: #389aff; font-size: large")
    console.log(js)
    console.log(ast)

    function print(args) {
      console.log(args);
    }

    function done() {
      running = false;
      stopTimer();
    }

    filbert.pythonRuntime.functions.print = print;

    /*
      *The following functions are exposed to the user code
      * to be able to draw on the canvas in runtime.
    */
    const clear = canvas.clear.bind(canvas);
    const draw_line = canvas.drawLine.bind(canvas);
    const fill = canvas.fill.bind(canvas);
    const draw_circle = canvas.drawCircle.bind(canvas);
    const draw_sprite = canvas.drawSprite.bind(canvas);
    const draw_rectangle = canvas.drawRectangle.bind(canvas);
    const randint = canvas.randint.bind(canvas);
    const random = canvas.random.bind(canvas);
    const sin = canvas.sin.bind(canvas);
    const cos = canvas.cos.bind(canvas);
    const tan = canvas.tan.bind(canvas);
    const atan = canvas.atan.bind(canvas);
    const atan2 = canvas.atan2.bind(canvas);
    const pi = Math.PI;
    const put_pixel = canvas.put_pixel.bind(canvas);
    const get_mouse = canvas.get_mouse.bind(canvas);
    const get_keys = canvas.get_keys.bind(canvas);
    const play_sound = canvas.play_sound.bind(canvas);


    let eval_string = js;

    try {
      (0, eval)(eval_string);
    } catch (e) {
      console.log(e);
    }

    // Caso particular, si está usando el modo manual para avanzar paso
    // a paso, se ejecuta el primer cuadro para que la pantalla no se
    // vea completamente vacía.
    if (hasMainLoop && speed == 0) {
      step();
    }
  }
}


document.addEventListener("DOMContentLoaded", function () {
  //const runButton = document.querySelector("#run");
  //const stopButton = document.querySelector("#stop");
  //const speedInput = document.querySelector("#speed");
  //const stepButton = document.querySelector("#step");
  //const tooltip = document.querySelector("#tooltip");



  //crearSplitView();

  /*


  speedInput.addEventListener("input", function (e) {
    speed = +e.target.value;
    console.log(`TODO: usar este valor de velocidad para el mainloop ${speed} FPS`);

    if (speed > 0) {
      stepButton.setAttribute("disabled", "disabled");
    } else {
      stepButton.removeAttribute("disabled");
    }
  });


  window.addEventListener("onload-phaserjs", function (evento) {
    run();
  });

  */
});

