import { sendMessage, getMessage } from "./bus.js";

class RunButton extends HTMLElement {

  connectedCallback() {
    this.createHTML();
    this.connectEvents();
  }

  createHTML() {
    this.innerHTML = `
      <button id="ejecutar">

        <div id="icono-ejecutar" class="icono">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
          </svg>
        </div>

        <div id="icono-detener" class="icono dn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
          </svg>
        </div>

        Ejecutar

      </button>
    `;
  }

  connectEvents() {
    const shareButton = document.querySelector("#ejecutar");
    const playIcon = document.querySelector("#icono-ejecutar");
    const stopIcon = document.querySelector("#icono-detener");

    shareButton.addEventListener("click", () => {
      sendMessage(this, "señal-comenzar-a-ejecutar");
      playIcon.classList.add("dn");
      stopIcon.classList.remove("dn");
    });

    getMessage(this, "señal-detener-la-ejecución", () => {
      playIcon.classList.remove("dn");
      stopIcon.classList.add("dn");
    });

  }

}

export default RunButton;
