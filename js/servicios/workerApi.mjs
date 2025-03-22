import { enviarMensaje } from "../bus.js";

function getPromiseAndResolve() {
  let resolve;
  let promise = new Promise((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

let lastId = 1;

function getId() {
  return `ejecutar-id-${lastId++}`;
}

function requestResponse(worker, msg) {
  const { promise, resolve } = getPromiseAndResolve();
  const idWorker = getId();

  worker.addEventListener("message", function listener(event) {
    if (event.data?.id !== idWorker) {
      return;
    }
    worker.removeEventListener("message", listener);
    const { id, ...rest } = event.data;
    resolve(rest);
  });
  worker.postMessage({ id: idWorker, ...msg });
  return promise;
}

const pyodideWorker = new Worker("./webworker.mjs", { type: "module" });


pyodideWorker.addEventListener("message", function listener(event) {
  if (event.data && event.data.callback === "notificar-ejecucion-de-linea") {
    enviarMensaje(this, "señal-marcar-linea-como-ejecutada", {linea: event.data.numero});
  }

  
  if (event.data && event.data.callback === "sonido") {
    let indice = event.data.argumento;

    let tipo = "random";
    const tiposDeSonidos = [
      "pickupCoin",
      "laserShoot",
      "explosion",
      "powerUp",
      "hitHurt",
      "jump",
      "blipSelect",
      "synth",
      "tone",
      "click",
    ]

    if (indice !== undefined) {
      indice = Math.floor(Math.abs(indice)) % tiposDeSonidos.length;
      tipo = tiposDeSonidos[indice];
    }

    const sonido = sfxr.generate(tipo);
    sfxr.play(sonido);

  }
});

export function conectarCanvasAlWorker(canvas) {
  const offscreen = canvas.transferControlToOffscreen();
  pyodideWorker.postMessage({ id: "conectar-el-canvas", canvas: offscreen }, [offscreen]);
}

export function asyncRun(script, context) {
  return requestResponse(pyodideWorker, {
    context,
    python: script,
  });
}

export function detenerEjecucionDePython() {
  pyodideWorker.postMessage({ id: "detener" });
}

export function enviarEventoDelMouse(evento) {
  pyodideWorker.postMessage({ id: "evento-del-mouse", evento: evento });
}

export function actualizarEstadoDelTeclado(evento) {
  pyodideWorker.postMessage({ id: "actualizar-el-estado-del-teclado", evento: evento });
}

