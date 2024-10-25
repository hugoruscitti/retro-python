import { enviarMensaje, recibirMensaje } from "./bus.js";

class Proyecto {
  datos;

  iniciar() {
    console.log("iniciando");
  }

  constructor() {
    //console.log("Se ha creado el proyecto");
    
    this.datos = {
      "fecha": "2024-10-22T20:32:33Z",
      "version": "1",
      "screenshot": "una captura de pantalla",
      "textura": "textura",
      "codigo": "print(\"hola placeholder mundo!!\")\r\nwhile True:\r\n  print(\"que tal?\")"
    }

    recibirMensaje(this, "señal-cargar-proyecto", (data) => {
      this.datos = data;
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
