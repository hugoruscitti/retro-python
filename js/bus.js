window.DEBUG_BUS = false;
window.DEBUG_BUS_ELEMENT = false;

const EVENTOS = [
  "signal-get-code",     // Pide el código del editor, se usa para el botón share.
  "señal-comenzar-a-ejecutar",          // Inicia el programa.
  "señal-activar-modo-live", // Define si tiene que ejecutar al editar o no.
  "señal-detener-la-ejecución",         // Define si tiene que ejecutar al editar o no.
  "señal-activar-el-modo-vim",  // indica si se activó o no el modo vim
  "señal-manual-cargado", // cuando el iframe del manual se carga por completo
  "señal-activar-modo-oscuro", // cuando se quiere cambiar el tema del editor.
  "señal-en-el-editor-de-pixelart-se-elige-un-color", // cuando en el editor se selecciona un color nuevo.
  "señal-cargar-proyecto",              // cuando termina de hacer el request para cargar el proyecto.
]

function enviarMensaje(sender, name, datos) {
  if (!EVENTOS.includes(name)) {
    throw Error(`No se ha declarado la señal '${name}' previamente`);
  }

  if (window.DEBUG_BUS) {
    console.log(`💌 BUS::${name}`);
    console.log("    emisor:", sender);
    console.log("    datos:", datos);
  }

  window.dispatchEvent(new CustomEvent(name, { detail: datos }));
}

function recibirMensaje(receiver, name, callback) {

  if (!EVENTOS.includes(name)) {
    throw Error(`No se ha declarado la señal '${name}' previamente`);
  }

  window.addEventListener(name, (e) => {
    if (window.DEBUG_BUS) {
      console.log(`       📬 BUS::${name}`);
      console.log("           receptor:", receiver);
    }

    callback.call(this, e.detail, e);
  });
}

export { enviarMensaje, recibirMensaje };
