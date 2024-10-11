import { enviarMensaje } from "./bus.js";

class Header extends HTMLElement {

  connectedCallback() {
    this.createHTML();
    this.connectEvents();
  }

  createHTML() {
    this.innerHTML = `
      <div class="header">
        <div class="header-1">
          <div class="logo">
            RETRO PYTHON
          </div>

          <div class="expandir-flex">
          </div>
            
          <div>
            <a href="/index.html">Visitar el sitio web</a>
          </div>
        </div>
      </div>
    `;
  }

  connectEvents() {
  }

  disconnectedCallback() {
  }
}

export default Header;
