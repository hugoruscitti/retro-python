import Pantalla from "./pantalla.js";
import Editor from "./editor.js";
import Header from "./header.js";
import BotonPublicar from "./boton-publicar.js";
import BotonEjecutar from "./boton-ejecutar.js";
import Interprete from "./interprete.js";
import { Configuracion } from "./configuracion.js";
import Manual from "./manual.js";
import BarraDeBotones from "./retro-barra-de-botones.js"
import AcercaDe from "./retro-acerca-de.js"
import EditorPixelart from "./retro-editor-pixelart.js"
import PixelartCanvas from "./retro-pixelart-canvas.js"
import PixelartColores from "./retro-pixelart-colores.js"
import RetroPythonApp from "./retro-python-app.js"
import RetroEjemplos from "./retro-ejemplos.js"
import RetroComentarios from "./retro-comentarios.js"
import CuadrosDeTexturaPixelart from "./retro-cuadros-de-textura-pixelart.js"
import RetroBotonVolver from "./retro-boton-volver.js"

customElements.define("retro-boton-volver", RetroBotonVolver);
customElements.define("retro-cuadros-de-textura-pixelart", CuadrosDeTexturaPixelart);
customElements.define("retro-ejemplos", RetroEjemplos);
customElements.define("retro-comentarios", RetroComentarios);
customElements.define("retro-python-app", RetroPythonApp);
customElements.define("retro-pixelart-colores", PixelartColores);
customElements.define("retro-pixelart-canvas", PixelartCanvas);
customElements.define("retro-editor-pixelart", EditorPixelart);
customElements.define("retro-acerca-de", AcercaDe);
customElements.define("retro-barra-de-botones", BarraDeBotones);
customElements.define("retro-pantalla", Pantalla);
customElements.define("retro-editor", Editor);
customElements.define("retro-header", Header);
customElements.define("retro-boton-publicar", BotonPublicar);
customElements.define("retro-boton-ejecutar", BotonEjecutar);
customElements.define("retro-interprete", Interprete);
customElements.define("retro-configuracion", Configuracion);
customElements.define("retro-manual", Manual);
