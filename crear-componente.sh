#!/bin/sh

NOMBRE=$1
CLASE=$2

echo "
import { sendMessage, getMessage } from \"./bus.js\";

class $CLASE extends HTMLElement {

  connectedCallback() {
    this.createHTML();
    this.connectEvents();
  }

  createHTML() {
    this.innerHTML = \`
      <div id=\"$NOMBRE\">
      </div>
    \`;
  }

  connectEvents() {
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
