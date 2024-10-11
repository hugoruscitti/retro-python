
import { enviarMensaje, recibirMensaje } from "./bus.js";

class Ejemplos extends HTMLElement {

  connectedCallback() {
    this.createHTML();
    this.connectEvents();
  }

  createHTML() {
    this.innerHTML = `
      <div id="retro-ejemplos" class="dn">

            <div class="examples">
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

            </div>
      </div>
    `;
  }

  connectEvents() {
  }

  disconnectedCallback() {
  }
}

export default Ejemplos;


