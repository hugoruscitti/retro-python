import { hasMainLoopInThisAST, createASTFromPython, replaceMainLoopWithFunction, generarJavaScript } from "../ast.js";

function assert(valor, motivo) {
  if (valor) {
    console.info("[OK]", motivo);
  } else {
    console.assert(valor, motivo);
  }
}

const fixtures = {
  linea: `linea(0, 0, 10, 10, 1)`,
  hola_mundo: `print("hola mundo!")`,
  bucle: `
x = 0
while True:
  x += 1
  borrar()
  circulo(azar(), azar(), x, azar())
`
}

// Creación de AST a partir de un código muy simple
const ast = createASTFromPython(fixtures.linea);
assert(ast.type == "Program", "produjo un ast de programa");
assert(ast.body.length == 1, "tiene una sola sentencia");
assert(ast.body[0].expression.callee.name == "linea", "la función a invocar es 'linea'");

// Puede crear un código JavaScript a partir del AST
const js = generarJavaScript(ast);
assert(js == 'linea(0, 0, 10, 10, 1);', "puede crear código JavaScript a partir del AST");

// Detecta si hay bucles en el código.
const astHolaMundo = createASTFromPython(fixtures.hola_mundo);
assert(hasMainLoopInThisAST(astHolaMundo) == false, "el código de hola mundo no tiene bucle")

// Prueba cómo reemplazar el bucle principal por
// una declaración de función.
const astBucle = createASTFromPython(fixtures.bucle);
assert(hasMainLoopInThisAST(astBucle) == true, "el código incluye un bucle")
const resultadoConBucle = generarJavaScript(astBucle)
assert(resultadoConBucle.includes("while (true)"), "una conversión directa genera un 'while (true)' ");
const astReemplazado = replaceMainLoopWithFunction(astBucle);

assert(astReemplazado.type == "Program", "reemplazó el bucle por una función")
assert(astReemplazado.body[0].type == "VariableDeclaration", "preservó la primer linea que hace una asignación")
assert(astReemplazado.body[1].type == "FunctionDeclaration", "reemplazó el bucle por una función nueva")

// Valida que el JavaScript generado efectivamente genera
// una función para sustutuir el bucle principal.
const lineasDeCodigoModificado = generarJavaScript(astReemplazado).split("\n");
assert(lineasDeCodigoModificado.length = 6, "el código JavaScript tiene que tener 6 lineas en total");
assert(lineasDeCodigoModificado[0] == "var x = 0;", "la primera tiene que ser la declaración de variable");
assert(lineasDeCodigoModificado[1] == "function __bloque_while() {", "la segunda tiene que ser la definición de la función");

