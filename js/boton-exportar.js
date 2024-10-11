import { sendMessage } from "./bus.js";

class ShareButton extends HTMLElement {

  connectedCallback() {
    this.createHTML();
    this.connectEvents();
  }

  createHTML() {
    this.innerHTML = `
      <button class="btn-icon btn-icon-share" id="share">
        <img class="icon" src="./static/icons/share.svg" alt="" />
      </button>
      <span id="tooltip" class="tooltip pixelart">URL saved to clipboard</span>
    `;
  }

  connectEvents() {
    const shareButton = document.querySelector("#share");

    shareButton.addEventListener("click", () => {
      const data = {
        callback: (data) => {
          this.saveProjectInURL(data.code);
          this.initShareButtonAnimationFeedback();
        }
      }

      sendMessage(this, "signal-get-code", data);
    });

  }

  initShareButtonAnimationFeedback() {
    const shareButton = document.querySelector("#share");
    tooltip.classList.add("show-tooltip");
    shareButton.setAttribute("disabled", "disabled");

    setTimeout(() => {
      tooltip.classList.remove("show-tooltip");
      shareButton.removeAttribute("disabled");
    }, 1000);
  }

  saveProjectInURL(code) {
    const project = {
      code: code
    }

    const base64Encoded = btoa(JSON.stringify(project));
    var url = new URL(window.location.origin);
    url.searchParams.append('code', base64Encoded);

    const newURL = url.toString();

    navigator.clipboard.writeText(newURL);
    window.history.replaceState({}, window.title, newURL)
  }
}

export default ShareButton;
