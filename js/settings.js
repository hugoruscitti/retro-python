import { sendMessage, getMessage } from "./bus.js";


class Settings extends HTMLElement {

  connectedCallback() {
    this.createHTML();
    this.connectEvents();
  }

  createHTML() {
    this.innerHTML = `<div>
      Configuración: 
      <div id="config" class="no-user-select">
        <label>
          <input type="checkbox" id="live" checked="checked">
          Ejecutar automáticamente
        </label>

        <label>
          <input type="checkbox" id="vim" checked="checked">
          Modo VIM 
        </label>

      </div>
    </div>`;
  }

  connectEvents() {
    this.querySelector("#live").addEventListener("change", function(e) {
      sendMessage(this, "signal-setting-live", { enabled: e.target.checked });
    });

    this.querySelector("#vim").addEventListener("change", function(e) {
      sendMessage(this, "signal-setting-vim", { enabled: e.target.checked });
    });


  }

}

export default Settings;
