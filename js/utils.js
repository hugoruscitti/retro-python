var timeout = null;

function debounce(callback, wait) {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(callback, wait);
}

export { debounce }
