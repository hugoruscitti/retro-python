import { sendMessage } from "./bus.js";
import { getMessage } from "./bus.js";
import { hasMainLoopInThisAST, createASTFromPython, replaceMainLoopWithFunction } from "./ast.js";

//window.frameCallback = function () {
  //console.log("frame");
//};

//setInterval(function() {
  //console.log(window.frameCallback.call(this));
//}, 1000);


class Interprete extends HTMLElement {

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
    getMessage(this, "señal-comenzar-a-ejecutar", () => {
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
    const inicio = filbert.parse("borrar()")
    ast.body.splice(0, 0, inicio.body[0])


    // marca el fin del programa, llamando a una función 'done'
    // para indicarle al editor que el programa terminó.
    if (!hasMainLoop) {
      const fin = filbert.parse("fin()")
      ast.body.push(fin.body[0])
    }

    const js = escodegen.generate(ast);

    //let eval_string = js + exportAsGlobal;
    console.group("Código JavaScript");
    console.log(js);
    console.groupEnd();

    let evalString = js;

    // canvasCanvas es el objeto que representa la
    // escena y que contiene todas las funciones
    // de dibujado.
    const c = window.canvas;

    window.linea = c.linea.bind(c);
    window.borrar = c.borrar.bind(c);
    window.pintar = c.pintar.bind(c);
    window.circulo = c.circulo.bind(c);
    //const dibujar = c.dibujar.bind(c);
    window.rectangulo = c.rectangulo.bind(c);
    window.azar = c.azar.bind(c);

    window.seno = c.seno.bind(c);
    window.coseno = c.coseno.bind(c);
    window.tangente = c.tangente.bind(c);
    window.arcotangente = c.arcotangente.bind(c);
    window.arcotangente2 = c.arcotangente2.bind(c);

    window.pixel = c.pixel.bind(c);
    window.flip = c.flip.bind(c);

    window.fin = () => {
      this.done();
    }

    // Dejar esta función porque es importante
    // el ; al final antes de hacer eval. 
    function __() {};

    try {
      (0, eval)(evalString);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  done() {
    setTimeout(() => {
      //stopTimer();
      this.running = false;
      sendMessage(this, "señal-detener-la-ejecución", {});
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

export default Interprete;
