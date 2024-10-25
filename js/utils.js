var temporizadores = {}

function debounce(nombre, callback, wait) {
  if (temporizadores[nombre]) {
    clearTimeout(temporizadores[nombre]);
    temporizadores[nombre] = null;
  }

  temporizadores[nombre] = setTimeout(callback, wait);
}

export { debounce }
