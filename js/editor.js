import { getMessage, sendMessage } from "./bus.js";
import { debounce } from "./utils.js";

class Editor extends HTMLElement {

  connectedCallback() {
    const initialCode = this.loadInitialCode();
    this.runOnChange = false;

    this.innerHTML = `
    <div style="position: fixed; opacity: 0.5; x-index: 999; top:0; ">
      <input type='range' id='control'></input>
    </div>

      <div id='editor'></div>
    `;
    this.editor = this.createAceEditor(initialCode);
    this.connectEvents();

    this.manual = document.createElement("div");
  }

  connectEvents() {
    getMessage(this, "signal-get-code", (data) => {
      const code = this.editor.getValue();
      data.callback.call(this, {code: code});
    });

    getMessage(this, "signal-setting-vim", (data) => {
      if (data.enabled) {
        this.editor.setKeyboardHandler("ace/keyboard/vim");
      } else {
        this.editor.setKeyboardHandler();
      }
    });

    getMessage(this, "signal-setting-live", (data) => {
      this.runOnChange = data.enabled;
    });

    getMessage(this, "señal-manual-cargado", (data) => {
      // NOTA: los elementos del autocompletado de texto
      // se obtienen del manual html, así que se tiene
      // que esperar esta señal para saber que el contenido
      // del manual se cargó por completo.
      this.activarAutocompletado(data.contenido);
    });

    this.querySelector("#control").addEventListener("input", (e) => {
      const valor = e.target.value; 
      const seleccion = {
        start: {
          row: 0,
          column: this.editor.session.doc.$lines[0].indexOf("(") + 1,
        }, 
        end: {
          row: 0,
          column: this.editor.session.doc.$lines[0].indexOf(")")
        }
      };

      this.editor.session.doc.replace(seleccion, valor);
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
      fontSize: "18pt"
    });

    //editor.setTheme("ace/theme/tomorrow");
    editor.setKeyboardHandler("ace/keyboard/vim");
    editor.setHighlightActiveLine(false);

    //editor.setOptions({
    //});
    
    editor.getSession().on('change', () => {

      // intenta autocompletar código
      //debounce(() => {
        //editor.execCommand("startAutocomplete");
      //}, 500);

      // Intenta ejecutar el código
      debounce(() => {
        if (this.runOnChange) {
          sendMessage(this, "señal-comenzar-a-ejecutar");
        }
      }, 500);

    });
      
    editor.commands.addCommand({
      name: "RUN",
      exec: () => {
        sendMessage(this, "señal-comenzar-a-ejecutar");
      },
      bindKey: {mac: "cmd-s", win: "ctrl-s"}
    });

    return editor;
  }

  loadInitialCode() {
    // intenta obtener el código del script desde la url
    const urlParams = new URLSearchParams(window.location.search);
    const codeInUrl = urlParams.get('code');

    if (codeInUrl !== null) {
      // si encuentra el código, retorna la versión en texto y
      // no serializada.
      //
      // Hoy hay un try porque se permite que la url tenga
      // el código como la primer versión o un objeto json
      // con varios atributos como en la versión nueva.
      try {
        const project = JSON.parse(atob(codeInUrl));
        return project.code;
      } catch {
        return atob(codeInUrl);
      }
    } else {
      // si el código no está en la url, retorna el código de ejemplo.
      return `linea(0, 0, 50, 25, 1)`;
    }
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
    })

    //this.editor.commands.off('afterExec', autocompletar);
    this.editor.commands.on('afterExec', window.doLiveAutocomplete);

    this.editor.completers = [{
      getCompletions: (editor, session, pos, prefix, callback) => {
        console.log(prefix);
        callback(null, completions);
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
