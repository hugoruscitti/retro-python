import { sendMessage, getMessage } from "./bus.js";

class RunIndicator extends HTMLElement {

  connectedCallback() {
    this.createHTML();
    this.connectEvents();
  }

  createHTML() {
    this.innerHTML = `
      <div id="run-indicator" class="dib">Stopped</div>
    `;
  }

  connectEvents() {
    const indicator = this.querySelector("#run-indicator");

    getMessage(this, "signal-stop", () => {
      indicator.innerText = "Stopped";
    });

    getMessage(this, "signal-run", () => {
      indicator.innerText = "Playing";
    });

  }
}

export default RunIndicator;
