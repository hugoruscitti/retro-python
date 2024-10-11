import { enviarMensaje } from "./bus.js";
import { recibirMensaje } from "./bus.js";
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
    recibirMensaje(this, "señal-comenzar-a-ejecutar", () => {
      const data = {
        callback: (result) => {
          this.runCode(result.code);
        }
      };
      
      enviarMensaje(this, "signal-get-code", data);
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

    let evalString = `
      function main() {
        ${js};
      }

      window.canvas.load.once(Phaser.Loader.Events.COMPLETE, () => {
        main();
      })

      var image =  'data:image/png;base64,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'
      window.canvas.load.spritesheet("sprites", image, { frameWidth: 8, frameHeight: 8 } );
      window.canvas.load.start();
    `;

    console.log(evalString);
    console.groupEnd();

    // canvasCanvas es el objeto que representa la
    // escena y que contiene todas las funciones
    // de dibujado.
    const c = window.canvas;

    window.linea = c.linea.bind(c);

    //funcion interna, para cargar las imagenes del juego
    //que están en base64
    window.__cargar_imagenes = c.cargar_imagenes.bind(c);

    window.borrar = c.borrar.bind(c);
    window.pintar = c.pintar.bind(c);
    window.circulo = c.circulo.bind(c);
    window.dibujar = c.dibujar.bind(c);
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
      enviarMensaje(this, "señal-detener-la-ejecución", {});
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
