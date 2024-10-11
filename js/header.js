import { sendMessage } from "./bus.js";

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
          SECCION 1
          |
          SECCION 2
        </div>
      </div>
    </div>

          <div class="buttons">
            <div>
              <retro-run-button></retro-run-button>

              <button class="btn-icon btn-icon-stop" id="stop">
                <img class="icon" src="./static/icons/stop.svg" alt="" />
              </button>

              <retro-boton-exportar></retro-boton-exportar>
              <retro-run-indicator></retro-run-indicator>
            </div>
            <div>
              <retro-settings></retro-settings>
            </div>

            <!--div class="examples">
              examples: 
              <a href="https://hugoruscitti.github.io/retro-python/?code=ZHJhd19zcHJpdGUoNTAsIDUwLCAwKQpkcmF3X2xpbmUoMTAsIDEwLCAyMCwgMjAsIDEpCmRyYXdfY2lyY2xlKDEwMCwgMTAwLCAxMCwgNCk%3D">1</a>
              <a href="https://hugoruscitti.github.io/retro-python/?code=ZmlsbCgzKQoKZm9yIHggaW4gcmFuZ2UoLTY0LCA2NCwgNCk6CiAgZHJhd19saW5lKHggKyA2NCwgNjQsIDY0ICsgeCoyLCAxMjgsIDExKQ%3D%3D">2</a>
              <a href="https://hugoruscitti.github.io/retro-python/?code=YSA9IDQ1Cgpmb3IgeCBpbiByYW5nZSgwLCAxMjgsIDUpOgogIGRyYXdfbGluZSgwLCA2NCwgeCwgNjQgKyBzaW4oeC8xMjgqcGkpKmEsIDEyKQogIGRyYXdfbGluZSgxMjgsIDY0LCAxMjgteCwgNjQgKyBzaW4oeC8xMjgqcGkpKmEsIDE0KQogIGRyYXdfbGluZSgxMjgsIDY0LCAxMjgteCwgNjQgLSBzaW4oeC8xMjgqcGkpKmEsIDEwKQogIGRyYXdfbGluZSgwLCA2NCwgeCwgNjQgLSBzaW4oeC8xMjgqcGkpKmEsIDExKQ%3D%3D">3</a>
              <a href="https://hugoruscitti.github.io/retro-python/?code=bGlzdGEgPSBbXQpmaWxsKDUpCmZvciB4IGluIHJhbmdlKDAsIDEyOCwgMTYpOgogIGxpc3RhLnB1c2goKHgsIDAsIDAsIDEyOC14KSkKICBsaXN0YS5wdXNoKCh4LCAxMjgsIDEyOCwgMTI4LXgpKQoKd2hpbGUgbGlzdGE6CiAgaXRlbSA9IGxpc3RhLnBvcCgpCiAgaWYgaXRlbToKICAgIGRyYXdfbGluZShpdGVtWzBdLCBpdGVtWzFdLCBpdGVtWzJdLCBpdGVtWzNdLCA5KQogIA%3D%3D">4</a>
              <a href="https://hugoruscitti.github.io/retro-python/?code=dCA9IDAKCndoaWxlIFRydWU6CiAgdCArPSAxCiAgZmlsbCgwLCAwLjI1KQogIHggPSBzaW4odCpwaS8xMCkqNjUKICBkcmF3X2xpbmUoNjQsIDAsIHggKyA2NSwgMTI4LCB0KQoK">5</a>
              <a href="https://hugoruscitti.github.io/retro-python/?code=eCA9IDY0CnkgPSAyMApzID0gNQp2eCA9IHMKdnkgPSBzCgp3aGlsZSBUcnVlOgogIGZpbGwoMTMpCiAgCiAgeCArPSB2eAogIHkgKz0gdnkKICAKICBkcmF3X3Nwcml0ZSh4LCB5LCAwKQogIAogIGlmIHggPiAxMjA6CiAgICB2eCA9IC1zCiAgZWxpZiB4IDwgMDoKICAgIHZ4ID0gcwoKICBpZiB5ID4gMTIwOgogICAgdnkgPSAtcwogIGVsaWYgeSA8IDA6CiAgICB2eSA9IHMKICA%3D">6</a>
              <a href="https://hugoruscitti.github.io/retro-python/?code=c3RhcnMgPSBbKDUwLCA1MCldCgpkZWYgY3JlYXRlX3N0YXJzKHN0YXJzKToKICBmb3IgbiBpbiByYW5nZSgyMDApOgogICAgeCA9IHJhbmRpbnQoMCwgMTI4KQogICAgeSA9IHJhbmRpbnQoMCwgMTI4KQogICAgdiA9IHJhbmRpbnQoMiwgNSkKICAgIHN0YXJzLnB1c2goKHgsIHksIHYpKQogICAgCmNyZWF0ZV9zdGFycyhzdGFycykKdCA9IDAKY29sb3JzID0gWzYsNiw2LDYsNiw2LCA3LCA3XQp3aGlsZSBUcnVlOgogIGNsZWFyKCkKICBmaWxsKDApCiAgdCArPSAxCgogIGZvciBzdGFyIGluIHN0YXJzOgogICAgdiA9IHN0YXJbMl0KICAgIHggPSBzdGFyWzBdCiAgICBzdGFyWzBdICs9IHYKICAgIGlmIHN0YXJbMF0gPiAxMjg6CiAgICAgIHN0YXJbMF0gPSAwCiAgICB5ID0gc3RhclsxXQogICAgI2RyYXdfbGluZSgwLCAwLCB4LCB5LCA0KQogICAgI2RyYXdfc3ByaXRlKHgsIHksIDIpCiAgICBwdXRfcGl4ZWwoeCwgeSwgdikgI2NvbG9yc1t4JWxlbihjb2xvcnMpXSk%3D">7</a>
              <a href="https://hugoruscitti.github.io/retro-python/?code=dCA9IDAKCndoaWxlIFRydWU6CiAgY2xlYXIoKQogIHQgKz0gMQogIHggPSBjb3ModCpwaS8xMCkgKiA0MCArIDUwCiAgeSA9IHNpbih0KnBpLzUpICogMzAgKyA1MAogIGRyYXdfc3ByaXRlKHgsIHksIDApCiAg">8</a>
              <a href="https://hugoruscitti.github.io/retro-python/?code=eCA9IDUwCnkgPSA4MAp2ID0gMApydW5uaW5nID0gWzMsIDRdCnQgPSAwCnN0ZXAgPSAzCmZsb29yID0gODAKCndoaWxlIFRydWU6CiAgdCs9MQogIHYtPTEKICBjbGVhcigpCiAgc3RlcCA9IHJ1bm5pbmdbdCUyXQoKICAjIGRpYnVqYSBsYSBzb21icmEKICBkaXN0YW5jZSA9IGZsb29yIC0geQogIGRyYXdfY2lyY2xlKHgrMTIsIGZsb29yKzIwLCA2LU1hdGguYWJzKGRpc3RhbmNlLzEwKSwgMCkKCiAgIyBkaWJ1amEgYWwgcGVyc29uYWplCiAgZHJhd19zcHJpdGUoeCwgeSwgc3RlcCkKCiAgeSAtPSB2CgogIGlmIHkgPiBmbG9vcjoKICAgIHkgPSBmbG9vcgogICAgdiA9IDAKCgogIGlmIGdldF9tb3VzZSgpWyJsZWZ0Il0gYW5kIHYgPD0gMDoKICAgICBwbGF5X3NvdW5kKDE0KQogICAgIHY9MTA%3D">9</a>
              <a href="https://hugoruscitti.github.io/retro-python/?code=dCA9IDAKCndoaWxlIFRydWU6CiAgdCArPSAxCiAgZmlsbCg2LCAwLjA1KQogIHBsYXlfc291bmQodCkKICB4ID0gcmFuZGludCgwLCA5MCkKICB5ID0gcmFuZGludCgwLCA5MCkKICBkcmF3X3Nwcml0ZSh4LCB5LCB0KQogIA%3D%3D">10</a>

            <--/div>

            <div>
              <a class="repository-link" href="https://github.com/hugoruscitti/retro-python" target="_black">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m0 0h24v24h-24z" fill="#fff" opacity="0"/>
                  <path d="m16.24 22a1 1 0 0 1 -1-1v-2.6a2.15 2.15 0 0 0 -.54-1.66 1 1 0 0 1 .61-1.67c2.44-.29 4.69-1.07 4.69-5.3a4 4 0 0 0 -.67-2.22 2.75 2.75 0 0 1 -.41-2.06 3.71 3.71 0 0 0 0-1.41 7.65 7.65 0 0 0 -2.09 1.09 1 1 0 0 1 -.84.15 10.15 10.15 0 0 0 -5.52 0 1 1 0 0 1 -.84-.15 7.4 7.4 0 0 0 -2.11-1.09 3.52 3.52 0 0 0 0 1.41 2.84 2.84 0 0 1 -.43 2.08 4.07 4.07 0 0 0 -.67 2.23c0 3.89 1.88 4.93 4.7 5.29a1 1 0 0 1 .82.66 1 1 0 0 1 -.21 1 2.06 2.06 0 0 0 -.55 1.56v2.69a1 1 0 0 1 -2 0v-.57a6 6 0 0 1 -5.27-2.09 3.9 3.9 0 0 0 -1.16-.88 1 1 0 1 1 .5-1.94 4.93 4.93 0 0 1 2 1.36c1 1 2 1.88 3.9 1.52a3.89 3.89 0 0 1 .23-1.58c-2.06-.52-5-2-5-7a6 6 0 0 1 1-3.33.85.85 0 0 0 .13-.62 5.69 5.69 0 0 1 .33-3.21 1 1 0 0 1 .63-.57c.34-.1 1.56-.3 3.87 1.2a12.16 12.16 0 0 1 5.69 0c2.31-1.5 3.53-1.31 3.86-1.2a1 1 0 0 1 .63.57 5.71 5.71 0 0 1 .33 3.22.75.75 0 0 0 .11.57 6 6 0 0 1 1 3.34c0 5.07-2.92 6.54-5 7a4.28 4.28 0 0 1 .22 1.67v2.54a1 1 0 0 1 -.94 1z" fill="color"/>
                </svg>
              </a>
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
