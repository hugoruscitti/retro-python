import { HOST } from "./configuracion.js";
var temporizadores = {}

function debounce(nombre, callback, wait) {
  if (temporizadores[nombre]) {
    clearTimeout(temporizadores[nombre]);
    temporizadores[nombre] = null;
  }

  temporizadores[nombre] = setTimeout(callback, wait);
}

async function cargarProyecto(hashDeProyecto) {
  return new Promise((success, error) => {
    const url = `${HOST}/obtener/${hashDeProyecto}`;
    fetch(url)
      .then(resolve => resolve.json())
      .then(data => {
        data.anchoDeTextura = data.anchoDeTextura || 128;
        data.altoDeTextura = data.altoDeTextura || 40;
        success(data);
      })
      .catch((err) => {
        error(err);
      });
  });
}

async function cargarEjemplo(nombre) {
  return new Promise((success, error) => {

    const url = `ejemplos/${nombre}/proyecto.json`;
    fetch(url)
      .then(resolve => resolve.json())
      .then(data => {
        success(data);
      })
      .catch((err) => {
        error(err);
      });
  });
}

async function esperar(segundos) {
  return new Promise((success) => {
    setTimeout(success, segundos * 1000);
  })
}

export { esperar, debounce, cargarProyecto, cargarEjemplo };
