import { sendMessage, getMessage } from "./bus.js";

class RunButton extends HTMLElement {

  connectedCallback() {
    this.createHTML();
    this.connectEvents();
  }

  createHTML() {
    this.innerHTML = `
      <button class="btn-icon btn-icon-play" id="run">
        <img id="play-icon" class="icon" src="./static/icons/play.svg" alt="" />
        <img id="stop-icon" class="icon dn" src="./static/icons/stop.svg" alt="" />
      </button>
    `;
  }

  connectEvents() {
    const shareButton = document.querySelector("#run");
    const playIcon = document.querySelector("#play-icon");
    const stopIcon = document.querySelector("#stop-icon");

    shareButton.addEventListener("click", () => {
      sendMessage(this, "signal-run");
      playIcon.classList.add("dn");
      stopIcon.classList.remove("dn");
    });

    getMessage(this, "signal-stop", () => {
      playIcon.classList.remove("dn");
      stopIcon.classList.add("dn");
    });

  }

}

export default RunButton;
