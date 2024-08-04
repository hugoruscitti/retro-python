import { sendMessage } from "./bus.js";
import { getMessage } from "./bus.js";
import { hasMainLoopInThisAST, createASTFromPython, replaceMainLoopWithFunction } from "./ast.js";

//window.frameCallback = function () {
  //console.log("frame");
//};

//setInterval(function() {
  //console.log(window.frameCallback.call(this));
//}, 1000);


class Interpreter extends HTMLElement {

  connectedCallback() {
    this.running = false;

    this.createHTML();
    this.connectEvents();
    this.installCustomFunctions();
  }

  createHTML() {
    this.innerHTML = `<div>
      <div id="error">
      </div>
    </div>`;
    this.clearError();
  }

  installCustomFunctions() {

    function print(args) {
      console.log("FUNCIÓN PRINT", args);
    }

    filbert.pythonRuntime.functions.print = print;
  }

  connectEvents() {

    // cuando llega el mensaje run, solicita el código como
    // string e inicia la ejecución
    getMessage(this, "signal-run", () => {
      const data = {
        callback: (result) => {
          this.runCode(result.code);
        }
      };
      
      sendMessage(this, "signal-get-code", data);
    });
  }

  runCode(code) {
    filbert.defaultOptions.runtimeParamName = "filbert.pythonRuntime"

    if (this.running) {
      console.log("El código ya está en ejecución");
      return;
    }

    // TODO: tengo validar que no esté running.
    let ast = null;
    this.clearError();

    try {
      ast = createASTFromPython(code);
    } catch (e) {
      this.showError(e);
      return;
    }

    const hasMainLoop = hasMainLoopInThisAST(ast);

    // Agrega una llamada a la función 'clear()' automáticamente
    // al principio del programa
    const inicio = filbert.parse("limpiar()")
    ast.body.splice(0, 0, inicio.body[0])


    // marca el fin del programa, llamando a una función 'done'
    // para indicarle al editor que el programa terminó.
    if (!hasMainLoop) {
      const fin = filbert.parse("this.done()")
      ast.body.push(fin.body[0])
    }

    const js = escodegen.generate(ast);

    //let eval_string = js + exportAsGlobal;
    console.log(js);

    let evalString = js;

    // canvasScene es el objeto que representa la
    // escena y que contiene todas las funciones
    // de dibujado.
    const c = window.canvasScene;

    const linea = c.linea.bind(c);
    const borrar = c.borrar.bind(c);
    const limpiar = c.borrar.bind(c);

    eval(evalString);
  }

  done() {
    setTimeout(() => {
      //stopTimer();
      this.running = false;
      sendMessage(this, "signal-stop", {});
    }, 500);
  }

  clearError() {
    const errorContainer = document.querySelector("#error");
    errorContainer.innerText = "";
    errorContainer.style.display = "none";
  }

  showError(error) {
    const errorContainer = document.querySelector("#error");
    errorContainer.innerText = error;
    errorContainer.style.display = "block";
    throw error;
  }
}

export default Interpreter;
