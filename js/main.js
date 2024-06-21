import Canvas from "./canvas.js";

customElements.define("retro-canvas", Canvas);

function run() {
  const textarea = document.querySelector("textarea");
  filbert.defaultOptions.runtimeParamName = "py";

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

  // expone la función __bloque_while
  // para indicarle al editor que el programa terminó.
  const bloque_while = filbert.parse("window.__bloque_while = __bloque_while")
  ast.body.push(bloque_while.body[0])

  // marca el fin del programa, llamando a una función 'done'
  // para indicarle al editor que el programa terminó.
  const fin = filbert.parse("done()")
  ast.body.push(fin.body[0])


  const js = escodegen.generate(ast);

  console.log("%cPrograma modificado:", "color: #389aff; font-size: large")
  console.log(js)
  console.log(ast)

  function print(args) {
    alert(args);
  }

  function done() {
    console.log("Finalizó la ejecución del código");
  }

  filbert.pythonRuntime.functions.print = print;

  const dibujar = canvas.dibujar.bind(canvas);
  const clear = canvas.clear.bind(canvas);

  let eval_string = "(function(py){" + js + "})(filbert.pythonRuntime);"
  eval(eval_string);
}

window.run = run;
