import Canvas from "./canvas.js";
import { hasMainLoopInThisAST, createASTFromPython, replaceMainLoopWithFunction }  from "./ast.js";

customElements.define("retro-canvas", Canvas);

// indica si el código está en un loop ejecutando.
var running = false;
var timer = null;
var speed = 30; // velocidad en cuadros por segundo

function updateButtons() {
  const runButton = document.querySelector("#run");
  const stopButton = document.querySelector("#stop");

  if (running) {
    runButton.innerText = "UPDATE";
    stopButton.removeAttribute("disabled");
  } else {
    runButton.innerText = "RUN";
    stopButton.setAttribute("disabled", "disabled");
  }

}

function stopTimer() {
  timer.destroy()
  timer = null;
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

/*
 * Toma el código en python, extrae el mainloop en una
 * función llamada `__bloque_while` y sobre-escribe la
 * función.
 */
function updateMainLoop(code) {
  const ast = createASTFromPython(code);
  const newAst = replaceMainLoopWithFunction(ast);
  const functionAST = newAst.filter(e => e.id).filter(e => e.id.name === "__bloque_while")[0];

  const js = escodegen.generate(functionAST);
  const exportAsGlobal = "window.__bloque_while = __bloque_while";

  let eval_string = "(function(py){" + js + exportAsGlobal + "})(filbert.pythonRuntime);"
  eval(eval_string);
}

function run() {
  const textarea = document.querySelector("textarea");
  const code = textarea.value;
  filbert.defaultOptions.runtimeParamName = "py";

  if (running) {
    updateMainLoop(code);
  } else {
    running = true;
    updateButtons();

    const ast = createASTFromPython(code);
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
            __bloque_while();
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

    const clear = canvas.clear.bind(canvas);
    const drawLine = canvas.drawLine.bind(canvas);

    let eval_string = "(function(py){" + js + "})(filbert.pythonRuntime);"
    eval(eval_string);

    // Caso particular, si está usando el modo manual para avanzar paso
    // a paso, se ejecuta el primer cuadro para que la pantalla no se
    // vea completamente vacía.
    if (hasMainLoop && speed == 0) {
      step();
    }
  }
}

function share() {
  const textarea = document.querySelector("textarea");
  const code = textarea.value;

  const base64Encoded = btoa(code);
  var url = new URL(window.location.origin);
  url.searchParams.append('code', base64Encoded);
  
  navigator.clipboard.writeText(url.toString());
  alert("coppied url to clipboard");
}

function loadCode() {
  const urlParams = new URLSearchParams(window.location.search);
  const base64Encoded = urlParams.get('code');
  if (base64Encoded != null) {
    document.querySelector("textarea").value = atob(base64Encoded);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const runButton = document.querySelector("#run");
  const speedInput = document.querySelector("#speed");
  const stepButton = document.querySelector("#step");
  const shareButton = document.querySelector("#share");
  const stopButton = document.querySelector("#stop");

  runButton.addEventListener("click", function () {
    run();
  });

  stepButton.addEventListener("click", function () {
    step();
  });

  shareButton.addEventListener("click", function () {
    share();
  });

  speedInput.addEventListener("input", function (e) {
    speed = +e.target.value;
    console.log(`TODO: usar este valor de velocidad para el mainloop ${speed} FPS`);

    if (speed > 0) {
      stepButton.setAttribute("disabled", "disabled")
    } else {
      stepButton.removeAttribute("disabled")
    }

  });

  stopButton.addEventListener("click", function () {
    stop();
  });
});


window.run = run;
window.share = share;
loadCode();
