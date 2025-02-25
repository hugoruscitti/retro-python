import { recibirMensaje, enviarMensaje } from "./bus.js";
import { debounce } from "./utils.js";
import { proyecto } from "./proyecto.js";

class Editor extends HTMLElement {

  connectedCallback() {
    this.runOnChange = false;

    this.innerHTML = `<div id="editor"></div>`;
    this.editor = this.createAceEditor();
    this.conectarEventos();

    this.manual = document.createElement("div");
  }

  conectarEventos() {

    recibirMensaje(this, "señal-cargar-proyecto", (data) => {
      this.editor.setValue(data.codigo);
      this.editor.clearSelection();
    });

    recibirMensaje(this, "señal-activar-el-modo-vim", (data) => {
      if (data.enabled) {
        this.editor.setKeyboardHandler("ace/keyboard/vim");

        ace.config.loadModule("ace/keybinding/vim", function() {
          const Vim = require("ace/keyboard/vim").Vim
          // space en modo normal no avanza, esto es útil
          // para el atajo de dos space para guardar.
          Vim.map("<Space>", "lh", "normal")
        });

      } else {
        this.editor.setKeyboardHandler();
      }
    });

    recibirMensaje(this, "señal-comenzar-a-ejecutar", () => {
      console.log(this.editor);
      this.editor.setReadOnly(true);

      const editor = document.querySelector("#editor");
      editor.style.opacity = "0.75";

      const canvas = document.querySelector("canvas#gameCanvas");
      canvas.focus();
      canvas.click();
    });

    recibirMensaje(this, "señal-detener-la-ejecución", () => {
      this.editor.setReadOnly(false);

      function hacerFocoEnElEditor() {
        const error = document.querySelector("#error");

        // Intenta hacer foco de nuevo en el editor, excepto
        // que exista un error.
        if (error.style.display == "none") {
          this.editor.focus();
        }
      }

      setTimeout(hacerFocoEnElEditor.bind(this), 100);
      setTimeout(hacerFocoEnElEditor.bind(this), 200);
      setTimeout(hacerFocoEnElEditor.bind(this), 500);

      const editor = document.querySelector("#editor");
      editor.style.opacity = "1";
    });

    recibirMensaje(this, "señal-manual-cargado", (data) => {
      // NOTA: los elementos del autocompletado de texto
      // se obtienen del manual html, así que se tiene
      // que esperar esta señal para saber que el contenido
      // del manual se cargó por completo.
      this.activarAutocompletado(data.contenido);
    });

  }


  disconnectedCallback() {
  }

  createAceEditor(initialCode) {
    const editor = ace.edit("editor", {
      mode: "ace/mode/python",
      value: initialCode,
      theme: "ace/theme/dracula",
      showGutter: true,
      behavioursEnabled: false,
      fontFamily: "code",
      fontSize: "12pt"
    });

    //editor.setKeyboardHandler("ace/keyboard/vim");
    editor.setHighlightActiveLine(false);
    editor.setShowPrintMargin(false);

    recibirMensaje(this, "señal-activar-modo-oscuro", (data) => {
      if (data.activado) {
        editor.setTheme("ace/theme/dracula");
      } else {
        editor.setTheme("ace/theme/tomorrow");
      }
    });
    
    editor.getSession().on('change', () => {

      const codigo = this.editor.getValue();
      proyecto.actualizarCodigo(codigo);

    });
      
    editor.commands.addCommand({
      name: "RUN",
      exec: () => {
        enviarMensaje(this, "señal-pulsa-ctrl-s");
      },
      bindKey: {mac: "cmd-s", win: "ctrl-s"}
    });

    return editor;
  }

  obtener(idManual) {
    const contenedor = this.manual.querySelector(idManual);
    return contenedor.parentNode.innerHTML;
  }

  activarAutocompletado(manualEnFormatoHTML) {
    this.editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: false
    });

    const parser = new DOMParser();
    const documento = parser.parseFromString(manualEnFormatoHTML, "text/html");
    const headers = Array.from(documento.querySelectorAll("h3"))
    const divs = headers.map(e => e.parentNode);

    const completions = divs.map(div => {
      return {
        caption: div.querySelector("h3").innerText,
        snippet: div.querySelector("#ejemplo").innerText,
        meta: "snippet",
        type: "snippet",
        doc: div.innerHTML,
      }
    });

    this.editor.commands.on('afterExec', window.doLiveAutocomplete);

    this.editor.completers = [{
      getCompletions: (editor, session, pos, prefix, callback) => {
        //const lineaActual = editor.session.getLine(pos.row);

        // solo autocompleta a partir del 3er caracter
        if (prefix.length > 2) {
          callback(null, completions);
        } else {
          callback(null, []);
        }

      },
      getDocTooltip: function(item) {
        if (item.doc) {
          item.docHTML = item.doc;
        }
      }
    }];
  }
}

export default Editor;
