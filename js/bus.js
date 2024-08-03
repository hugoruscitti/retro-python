window.DEBUG_BUS = true;

/*
 
Lista de mensajes con descripción:

- signal-get-code: Se envía para solicitar el código del editor, se usa para el botón share.
- signal-run: Inicia el programa.
- signal-setting-live: Define si tiene que ejecutar al editar o no.
- signal-stop: Define si tiene que ejecutar al editar o no.

*/



function sendMessage(sender, name, data) {
  if (window.DEBUG_BUS) {
    console.log(`💌 BUS::${name}`, "sending message from", sender, "with this data", data);
    //console.trace();
  }

  window.dispatchEvent(new CustomEvent(name, { detail: data }));
}

function getMessage(receiver, name, callback) {
  window.addEventListener(name, (e) => {
    if (window.DEBUG_BUS) {
      console.log(`   📬 BUS::${name}`, "receiving the message from", receiver, "with this data", e.detail);
    }

    callback.call(this, e.detail, e);
  });
}

export { sendMessage, getMessage };
