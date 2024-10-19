import { enviarMensaje } from "./bus.js";
import { recibirMensaje } from "./bus.js";
import { hasMainLoopInThisAST, createASTFromPython, replaceMainLoopWithFunction, generarJavaScript } from "./ast.js";

//window.frameCallback = function () {
  //console.log("frame");
//};

//setInterval(function() {
  //console.log(window.frameCallback.call(this));
//}, 1000);


/* NOTA
 *
 * El intérprete se encarga de tener guarda la información
 * del proyecto, y las imágenes.
 * 
 */
class Interprete extends HTMLElement {

  connectedCallback() {
    this.ejecutando = false;
    this.temporizador = null;

    this.crearHTML();
    this.conectarEventos();
    this.vincularFuncionesPersonalizadas();
  }

  crearHTML() {
    this.innerHTML = `<div>
      <div id="error">
      </div>
    </div>`;
    this.limpiarErrores();
  }

  vincularFuncionesPersonalizadas() {

    function print(args, color) {
      window.print(args, color);
      console.log("FUNCIÓN PRINT: ", args);
    }

    filbert.pythonRuntime.functions.print = print;
  }

  conectarEventos() {

    // cuando llega el mensaje run, solicita el código como
    // string e inicia la ejecución
    recibirMensaje(this, "señal-comenzar-a-ejecutar", () => {
      const data = {
        callback: (result) => {
          this.ejecutar(result.code);
        }
      };
      
      enviarMensaje(this, "signal-get-code", data);
    });

    recibirMensaje(this, "señal-detener-la-ejecución", () => {
      this.detenerEjecucion();
    });
  }

  ejecutar(code) {
    filbert.defaultOptions.runtimeParamName = "filbert.pythonRuntime"
    
    if (this.ejecutando) {
      alert("el programa aún se está ejecutando");
      return;
    }

    // TODO: tengo validar que no esté ejecutando.
    let ast = null;
    this.limpiarErrores();

    try {
      ast = createASTFromPython(code);
    } catch (e) {
      this.detenerEjecucion();
      this.mostrarError(e);
      return;
    }

    const hasMainLoop = hasMainLoopInThisAST(ast);

    // Agrega una llamada a la función 'clear()' automáticamente
    // al principio del programa
    const inicio = filbert.parse("borrar()")
    ast.body.splice(0, 0, inicio.body[0])

    
    if (hasMainLoop) {
      console.log("Este programa tiene mainloop");
      // la siguiente función, genera la función __bloque_while para que
      // el temporizador creado anteriormente pueda ejecutar el bloque
      // que está dentro del bucle constántemente.
      ast = replaceMainLoopWithFunction(ast);
      //debugger;
    } else {
      // marca el fin del programa, llamando a una función 'done'
      // para indicarle al editor que el programa terminó.
      const fin = filbert.parse("fin()")
      ast.body.push(fin.body[0])
    }

    const js = generarJavaScript(ast);
    let extra = "";

    if (hasMainLoop) {
      extra = "window.__bloque_while = __bloque_while;";
    }

    //let eval_string = js + exportAsGlobal;
    console.group("Código JavaScript");

    let evalString = `
      function main() {
        ${js};
        
        ${extra};
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

    window.pintar = c.pintar.bind(c);
    window.borrar = c.borrar.bind(c);
    window.pintar = c.pintar.bind(c);
    window.circulo = c.circulo.bind(c);
    window.dibujar = c.dibujar.bind(c);
    window.rectangulo = c.rectangulo.bind(c);
    window.azar = c.azar.bind(c);
    window.print = c.print.bind(c);

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

    if (hasMainLoop) {
      // el temporizador ejecutará regularmente el cuerpo del
      // bucle principal.
      this.iniciarTemporizadorDeBuclePrincipal();
    }


    
  }

  iniciarTemporizadorDeBuclePrincipal() {
    this.temporizador = window.canvas.time.addEvent({
        delay: 1000 / 30,
        loop: true,
        callback: () => {
          // esta función la genera la función replaceMainLoopWithFunction
          // solamente si el programa tiene un bucle principal.
            try {
              window.__bloque_while();
            } catch (e) {
              alert("un error!");
              this.detenerEjecucion();
              this.mostrarError(e);
            }
          /*

          acumulador += 33;

          if (acumulador >= 1000 / speed) {
            acumulador = 0;
          }
          */

        }
      });
  }

  detenerEjecucion() {
    if (this.temporizador) {
      this.temporizador.destroy()
      this.temporizador = null;
      this.ejecutando = false;
      enviarMensaje(this, "señal-detener-la-ejecución", {});
    }
  }

  done() {
    setTimeout(() => {
      //stopTimer();
      this.ejecutando = false;
      enviarMensaje(this, "señal-detener-la-ejecución", {});
    }, 500);
  }

  limpiarErrores() {
    const errorContainer = document.querySelector("#error");
    errorContainer.innerText = "";
    errorContainer.style.display = "none";
  }

  mostrarError(error) {
    const errorContainer = document.querySelector("#error");
    errorContainer.innerText = error;
    errorContainer.style.display = "block";
    console.error(error);
  }
}

export default Interprete;
