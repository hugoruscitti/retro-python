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

  console.log(ast);
  console.log(JSON.stringify(ast, null, 2));
  
  const js = escodegen.generate(ast);
  console.log(js)

  function print(args) {
    alert(args);
  }

  filbert.pythonRuntime.functions.print = print;

  const dibujar = canvas.dibujar.bind(canvas);
  const clear = canvas.clear.bind(canvas);

  let eval_string = "(function(py){" + js + "})(filbert.pythonRuntime);"
  eval(eval_string);
}

window.run = run;
