import Canvas from "./canvas.js";
import { hasMainLoopInThisAST, createASTFromPython, replaceMainLoopWithFunction } from "./ast.js";

customElements.define("retro-canvas", Canvas);

// indica si el código está en un loop ejecutando.
var running = false;
var timer = null;
var speed = 30; // velocidad en cuadros por segundo

const editor = new EditorView({
  extensions: [basicSetup, python()],
  parent: document.getElementById("editor"),
  value: "x = 0\nwhile True:\n    x += 1\n    # (x, y, length, angle, color)\n    drawLine(0, 0, 100*x, 200, 11)",
  mode: "python",
});


function updateButtons() {
  const runButton = document.querySelector("#run");

  if (running) {
    runButton.innerText = "STOP";
  } else {
    runButton.innerText = "RUN";
  }

}

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
  running = false;
  updateButtons();
  stopTimer();
}

function show_error(error) {
  alert(error);
}

/*
 * Toma el código en python, extrae el mainloop en una
 * función llamada `__bloque_while` y sobre-escribe la
 * función.
 */
function updateMainLoop(code) {
  /*
  const ast = createASTFromPython(code);

  const newAst = replaceMainLoopWithFunction(ast);
  const functionAST = newAst.filter(e => e.id).filter(e => e.id.name === "__bloque_while")[0];

  const js = escodegen.generate(functionAST);
  const exportAsGlobal = "window.__bloque_while = __bloque_while";

  let eval_string = js + exportAsGlobal;
  */
  //eval(eval_string);
}

function run() {
  debugger
  const code = editor.state.doc.text;
  filbert.defaultOptions.runtimeParamName = "filbert.pythonRuntime"
  if (running) {
    updateMainLoop(code);
    stop();
  } else {
    let ast = null;

    try {
      ast = createASTFromPython(code);
    } catch (e) {
      show_error(e);
      return;
    }
    const codigo = editor.state.doc.text;
    // codigo is a list of strings, join them to get the full code

    running = true;
    updateButtons();

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
      updateButtons();
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
      eval(eval_string);
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

function share() {
  const editor = document.getElementById("editor");
  const code = editor.value;

  const base64Encoded = btoa(code);
  var url = new URL(window.location.origin);
  url.searchParams.append('code', base64Encoded);

  const newURL = url.toString();

  navigator.clipboard.writeText(newURL);
  window.history.replaceState({}, window.title, newURL)
}

function loadCode() {
  const urlParams = new URLSearchParams(window.location.search);
  const base64Encoded = urlParams.get('code');
  if (base64Encoded != null) {
    document.getElementById("editor").value = atob(base64Encoded);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const runButton = document.querySelector("#run");
  const speedInput = document.querySelector("#speed");
  const stepButton = document.querySelector("#step");
  const shareButton = document.querySelector("#share");
  const tooltip = document.querySelector("#tooltip");

  runButton.addEventListener("click", function () {
    run();
  });

  stepButton.addEventListener("click", function () {
    step();
  });

  shareButton.addEventListener("click", function () {
    share();
    tooltip.classList.add("show-tooltip");
    shareButton.setAttribute("disabled", "disabled");

    setTimeout(() => {
      tooltip.classList.remove("show-tooltip");
      shareButton.removeAttribute("disabled");
    }, 1000);
  });

  speedInput.addEventListener("input", function (e) {
    speed = +e.target.value;
    console.log(`TODO: usar este valor de velocidad para el mainloop ${speed} FPS`);

    if (speed > 0) {
      stepButton.setAttribute("disabled", "disabled");
    } else {
      stepButton.removeAttribute("disabled");
    }
  });

});


window.run = run;
window.share = share;
loadCode();
