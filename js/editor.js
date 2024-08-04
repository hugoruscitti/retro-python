import { getMessage, sendMessage } from "./bus.js";

class Editor extends HTMLElement {

  connectedCallback() {
    const initialCode = this.loadInitialCode();
    this.runOnChange = true;

    this.innerHTML = "<div id='editor'></div>";
    this.editor = this.createAceEditor(initialCode);
    this.activarAutocompletado();
    this.connectEvents();
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
      if (this.runOnChange) {
        sendMessage(this, "signal-run");
      }
    });
      
    editor.commands.addCommand({
      name: "RUN",
      exec: () => {
        sendMessage(this, "signal-run");
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
      return `print("hola mundo")`
    }
  }

  activarAutocompletado() {
    this.editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    });

    this.editor.completers = [{
      getCompletions: function(editor, session, pos, prefix, callback) {
        var completions = [
          {
            caption: "limpiar",
            snippet: "limpiar()",
            meta: "snippet",
            type: "snippet",
          },
          {
            caption: "linea",
            snippet: "linea(0, 0, 200, 200, 1)",
            meta: "snippet",
            type: "snippet",
            doc: `Dibuja una de color entre dos puntos

            <pre>linea(x, y, x2, y2, color)</pre>

            Por ejemplo, si se llama a la función de esta forma:

            <pre>linea(5, 5, 200, 200, 2)</pre>

            Se dibujará esta linea:

            <img class="imagen-ejemplo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAmUlEQVRYR+3Xuw2AMAwEUDICHXsxJ3vRMYIRJQISf+4ciniCJ+vOkouIyNRxygD8ZgPLdkz7Oqen4ZaBHohHCLMRry3IRHzWMAtRvQMZiOYhYiOagKuXTIQKwESoASyECcBAmAFohAuARLgBKEQIgECEAVEEBBBBwABeBBTgQcABVgQFYEHQAFoEFaBB0AEtRAqg9mwMQPcNnLrmx6EmqR7BAAAAAElFTkSuQmCC"></img>
          `
          }
        ];
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
