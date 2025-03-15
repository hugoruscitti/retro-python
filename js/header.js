import { enviarMensaje } from "./bus.js";

class Header extends HTMLElement {

  connectedCallback() {
    this.crearHTML();
    this.conectarEventos();
  }

  crearHTML() {
    this.innerHTML = `
      <div class="header">
        <div class="header-1">
          <div>
            <a href="/"><div class="logo"></div></a>
          </div>

          <div class="expandir-flex">
          </div>


          <retro-editor-pixelart></retro-editor-pixelart>
          <retro-ejemplos></retro-ejemplos>
          <retro-comentarios></retro-comentarios>
        <retro-acerca-de></retro-acerca-de>
            
        </div>
      </div>
    `;
  }

  conectarEventos() {
  }

  disconnectedCallback() {
  }
}

export default Header;
