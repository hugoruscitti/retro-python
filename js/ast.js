function hasMainLoopInThisAST(ast) {
  return ast.body.filter(e => e.type === "WhileStatement").length > 0;
}


function createASTFromPython(code) {
  const options = {
    locations: false,
    ranges: false,
  }
  return filbert.parse(code, options);
}

function replaceMainLoopWithFunction(ast) {
  let aux = createASTFromPython("");
  aux.body = ast.body.map(nodo => {

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

      // todo: acá sería útil poder poner una llamada a flip cuando
      // se termina de ejecutar el código del loop.
      
      return declaracion;
    }

    return nodo;
  });

  return aux;
}

function generarJavaScript(ast) {
  return escodegen.generate(ast);
}

export {
  hasMainLoopInThisAST,
  createASTFromPython,
  replaceMainLoopWithFunction,
  generarJavaScript,
};
