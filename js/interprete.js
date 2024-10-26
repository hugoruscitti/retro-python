import { enviarMensaje } from "./bus.js";
import { recibirMensaje } from "./bus.js";
import { hasMainLoopInThisAST, createASTFromPython, replaceMainLoopWithFunction, generarJavaScript } from "./ast.js";
import { proyecto } from "./proyecto.js";


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

    function print(args, color, x, y) {
      window.print(args, color, x, y);
      //console.log("FUNCIÓN PRINT: ", args);
    }

    filbert.pythonRuntime.functions.print = print;
  }

  conectarEventos() {

    // cuando llega el mensaje run, solicita el código como
    // string e inicia la ejecución
    recibirMensaje(this, "señal-comenzar-a-ejecutar", () => {
      const data = proyecto.obtenerProyectoCompleto();
      this.ejecutar(data.codigo, data.textura);
    });

    recibirMensaje(this, "señal-detener-la-ejecución", () => {
      this.detenerEjecucion();
    });
  }

  ejecutar(code, textura) {
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
      enviarMensaje(this, "señal-detener-la-ejecución", {});
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
      // marca el fin del programa, llamando a una función 'terminarPrograma'
      // para indicarle al editor que el programa terminó.
      const fin = filbert.parse("fin()")
      ast.body.push(fin.body[0])
    }

    const js = generarJavaScript(ast);
    let extra = "";

    if (hasMainLoop) {
      console.log("inyectando bloque while");
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

      var image = '${textura}';
      window.canvas.load.spritesheet("sprites", image, { frameWidth: 8, frameHeight: 8 } );
      window.canvas.load.start();
    `;

    console.log(evalString);
    console.groupEnd();

    // canvasCanvas es el objeto que representa la
    // escena y que contiene todas las funciones
    // de dibujado.
    const c = window.canvas;

    window.cuadro = 0;
    window.linea = c.linea.bind(c);

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
      this.terminarPrograma();
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
              if (window.__bloque_while) {
                window.cuadro += 1;
                window.__bloque_while();
              } else {
                console.log("warning to do: la función __bloque_while no existe aún")
              }
            } catch (e) {
              enviarMensaje(this, "señal-detener-la-ejecución", {});
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

  terminarPrograma() {
    setTimeout(() => {
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
