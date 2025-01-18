window.DEBUG_BUS = true;

const EVENTOS = [
  "señal-comenzar-a-ejecutar",          // Inicia el programa.
  "señal-activar-modo-live", // Define si tiene que ejecutar al editar o no.
  "señal-detener-la-ejecución",         // Define si tiene que ejecutar al editar o no.
  "señal-activar-el-modo-vim",  // indica si se activó o no el modo vim
  "señal-manual-cargado", // cuando el iframe del manual se carga por completo
  "señal-activar-modo-oscuro", // cuando se quiere cambiar el tema del editor.
  "señal-en-el-editor-de-pixelart-se-elige-un-color", // cuando en el editor se selecciona un color nuevo.
  "señal-cargar-proyecto",              // cuando termina de hacer el request para cargar el proyecto.
  "señal-pulsa-ctrl-s",
  "señal-mostrar-error",
  "señal-selecciona-sprite-en-canvas-textura", // cuando pulsa un cuadro de animación en el editor pixelart, y este debe dibujarse en el canvas grandes para modificar.
  "señal-alternar-fondo-transparente",
  "señal-pixelart-cambia-pixel",
  "señal-pixelart-borra-pixel",
  "señal-actualizar-textura-del-proyecto",
  "señal-cambia-el-cuadro-en-la-grilla",
  "señal-carga",
]

function enviarMensaje(sender, name, datos) {
  if (!EVENTOS.includes(name)) {
    throw Error(`No se ha declarado la señal '${name}' previamente`);
  }

  if (window.DEBUG_BUS) {
    console.groupCollapsed("BUS :: " + name);
    console.log("Emisor →", sender);
    console.log("Detalle →", {datos});
  }

  window.dispatchEvent(new CustomEvent(name, { detail: datos }));

  if (window.DEBUG_BUS) {
    console.groupEnd();
  }
}

function recibirMensaje(receiver, name, callback) {

  if (!EVENTOS.includes(name)) {
    throw Error(`No se ha declarado la señal '${name}' previamente`);
  }

  window.addEventListener(name, (e) => {
    if (window.DEBUG_BUS) {
      console.log("Receptor →", receiver);
    }

    callback.call(this, e.detail, e);
  });
}

export { enviarMensaje, recibirMensaje };
