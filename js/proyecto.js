/*
#TODO


hacer que los ejemplos se carguen sin tener que recargar toda la página

*/




import { enviarMensaje, recibirMensaje } from "./bus.js";
const TEXTURA_FIXTURE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAoCAYAAAA2cfJIAAAAAXNSR0IArs4c6QAAAL5JREFUeF7t1bENgDAUxNCf/YcG0aAIiQXilwpKO9ZljZM2sNL04GcP4Jp5//dvmg428F2A5+KfYxkOvvQdTQCRi/7D9AQIIG4gju+tF0DcQBzfAgggbiCObwEEEDcQx7cAAogbiONbAAHEDcTxLYAA4gbi+BZAAHEDcXwLIIC4gTi+BRBA3EAc3wIIIG4gjm8BBBA3EMe3AAKIG4jjWwABxA3E8S2AAOIG4vgWQABxA3F8CyCAuIE4vgWIB3ADSE8GKcVCdx4AAAAASUVORK5CYII=";

class Proyecto {
  datos;

  iniciar() {
  }

  constructor() {
    this.datos = {
      "fecha": "2024-10-22T20:32:33Z",
      "version": "1",
      "screenshot": "una captura de pantalla",
      "textura": TEXTURA_FIXTURE,
      "codigo": '',
    }

    recibirMensaje(this, "señal-cargar-proyecto", (data) => {

      if (data.textura === "textura") {
        // Este es un hotfix porque muchos juegos cargados en el
        // servidor se guardaron sin textura.
        data.textura = TEXTURA_FIXTURE;
      }

      this.datos = data;
    });

    recibirMensaje(this, "señal-actualizar-textura-del-proyecto", (data) => {
      this.datos.textura = data.textura;
    });
  }

  actualizarCodigo(codigo) {
    /* se llama cuando se cambia el contenido del programa en
     * el editor de código. */
    this.datos['codigo'] = codigo;
  }

  obtenerProyectoCompleto() {
    return this.datos;
  }

}

let proyecto = new Proyecto();

window.ppp = proyecto;
export { proyecto };
