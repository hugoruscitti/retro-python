#!/bin/sh

NOMBRE=$1
CLASE=$2

echo "
import { enviarMensaje, recibirMensaje } from \"./bus.js\";

class $CLASE extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = \`
      <div id=\"$NOMBRE\">
      </div>
    \`;
  }

  conectarEventos() {
  }

  disconnectedCallback() {
  }
}

export default $CLASE;

" > js/$NOMBRE.js

echo ""
echo "Por favor agregar estas lineas en el archivo js/main.js"
echo ""
echo "import $CLASE from \"./$NOMBRE.js\""
echo ""
echo "customElements.define(\"$NOMBRE\", $CLASE);"
echo ""
echo ""
