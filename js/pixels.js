function hex(numero) {
  if (numero) {
    let tmp = numero.toString(16);

    if (tmp.length === 1) {
      return "0" + tmp;
    } else {
      return tmp;
    }
  } else {
    return "00";
  }
}

export { hex };
