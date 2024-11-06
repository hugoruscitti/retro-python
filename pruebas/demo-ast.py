import ast


codigo = """
while True:
    print(1)
    esperar(2)
    if a > 0:
        esperar(3)
"""

nodo = ast.parse(codigo)
#print(ast.dump(nodo, indent=2))


class Transformador(ast.NodeTransformer):

    def visit_While(self, node):
        fin = ast.parse("print('fin')")
        node.body.append(fin)
        self.generic_visit(node)
        return node

    def visit_Call(self, nodo):
        if isinstance(nodo.func, ast.Name):
            # solo si encuentra una llamada a la función 'esperar'
            # reemplazará la sentencia por 'await esperar...'
            if nodo.func.id == "esperar":
                nodo_await = ast.parse("await esperar(0)")
                nodo_await.body[0].value.value = nodo
                return nodo_await.body[0].value

        return nodo

nodo = Transformador().visit(nodo)
# Requiere pyton 3.9
print(ast.unparse(nodo))
