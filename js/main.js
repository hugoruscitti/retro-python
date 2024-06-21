import Canvas from "./canvas.js";

customElements.define("retro-canvas", Canvas);

// indica si el código está en un loop ejecutando.
var running = false;
var timer = null;
var speed = 30; // velocidad en cuadros por segundo

function updateButton() {
  const runButton = document.querySelector("#run");

  if (running) {
    runButton.innerText = "STOP";
  } else {
    runButton.innerText = "RUN";
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

function run() {
  const textarea = document.querySelector("textarea");
  filbert.defaultOptions.runtimeParamName = "py";

  if (running) {
    running = false;
    updateButton();
    stopTimer();
  } else {

    running = true;
    updateButton();

    const opciones = {
      locations: false,
      ranges: false,
    }

    const codigo = textarea.value;
    const ast = filbert.parse(codigo, opciones);
    const hasMainLoop = ast.body.filter(e => e.type === "WhileStatement").length > 0


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
            //draw_step();
          }

        }
      });
    }

    if (hasMainLoop) {
      ast.body = ast.body.map(nodo => {

        // si encuentra un bloque while asume que
        // es el mainloop y lo reemplaza por una
        // declaración de función.
        // 
        // por ejemplo:
        //
        // while True:
        //    1 + 1
        //    print("test")
        //
        // se tiene que transformar en:
        //
        // def __bloque_while():
        //    1 + 1
        //    print("test")
        //
        if (nodo.type === "WhileStatement") {
          const nodo_funcion = filbert.parse("def __bloque_while():\n\tpass");
          const declaracion = nodo_funcion.body[0];
          const cuerpo_while = nodo.body;

          declaracion.body.body = cuerpo_while.body
          return declaracion;
        }

        return nodo;
      });
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
      alert(args);
    }

    function done() {
      running = false;
      updateButton();
      stopTimer();
    }

    filbert.pythonRuntime.functions.print = print;

    const clear = canvas.clear.bind(canvas);
    const drawLine = canvas.drawLine.bind(canvas);
    const fill = canvas.fill.bind(canvas);

    let eval_string = "(function(py){" + js + "})(filbert.pythonRuntime);"
    eval(eval_string);
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
});


window.run = run;
window.share = share;
loadCode();
