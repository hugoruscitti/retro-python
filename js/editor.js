import { getMessage, sendMessage } from "./bus.js";

class Editor extends HTMLElement {

  connectedCallback() {
    const initialCode = this.loadInitialCode();
    this.runOnChange = true;

    this.innerHTML = "<div id='editor'></div>";
    this.editor = this.createAceEditor(initialCode);
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
}

export default Editor;
