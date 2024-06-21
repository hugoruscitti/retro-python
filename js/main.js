import Canvas from "./canvas.js";

customElements.define("retro-canvas", Canvas);

// indica si el código está en un loop ejecutando.
var running = false;

function updateButton() {
  const runButton = document.querySelector("#run");

  if (running) {
    runButton.innerText = "STOP";
  } else {
    runButton.innerText = "RUN";
  }

}

function run() {
  const textarea = document.querySelector("textarea");
  filbert.defaultOptions.runtimeParamName = "py";

  if (running) {
    console.log("TODO: detener el mainloop");
    running = false;
    updateButton();
  } else {


    running = true;
    updateButton();

    const opciones = {
      locations: false, 
      ranges: false,
    }

    const codigo = textarea.value;
    const ast = filbert.parse(codigo, opciones);


    // debug log para mostrar el programa original
    console.log("%cPrograma original:", "color: #389aff; font-size: large")
    console.log(escodegen.generate(ast))
    console.log(ast);

    //console.log(JSON.stringify(ast, null, 2));


    // Agrega una llamada a la función 'clear()' automáticamente
    // al principio del programa
    const inicio = filbert.parse("clear()")
    ast.body.splice(0, 0, inicio.body[0])

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


    const hasMainLoop = ast.body
      .filter(e => e.type == "FunctionDeclaration")
      .map(e => e.id.name == "__bloque_while")
      .length > 0;

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
    }

    filbert.pythonRuntime.functions.print = print;

    const dibujar = canvas.dibujar.bind(canvas);
    const clear = canvas.clear.bind(canvas);

    let eval_string = "(function(py){" + js + "})(filbert.pythonRuntime);"
    eval(eval_string);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const runButton = document.querySelector("#run");
  const speed = document.querySelector("#speed");

  runButton.addEventListener("click", function() {
    run();
  });

  speed.addEventListener("input", function(e) {
    const speed = +e.target.value;
    console.log(`TODO: usar este valor de velocidad para el mainloop ${speed} FPS`);
  });

});
