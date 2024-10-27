import { enviarMensaje, recibirMensaje } from "./bus.js";

class Proyecto {
  datos;

  iniciar() {
    console.log("iniciando");
  }

  constructor() {
    //console.log("Se ha creado el proyecto");
    
    this.datos = {
      "fecha": "2024-10-22T20:32:33Z",
      "version": "1",
      "screenshot": "una captura de pantalla",
      "textura": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAoCAYAAAA2cfJIAAAAxXpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVDBDcMgDPwzRUcA2wE8Dmmo1A06fg9sqiTqSRy2zxzg0D/vV3gMUJIgW6lZc46AqCg1BDUa2uQUZfLEkpBf6oGWQigxdvYD2ftXPf0MbGuItpNRfbqwXwUV9683I7+Ix4sIweFG6kZMJiQ3aPatmLWW8xf2Hq+otsKgZ5/eMflt91wKpndsKDJRZ5TBzGIP4LEkcBsCmLigMbIiFmTNW5MN5N+cFsIXUJpZ4QAjkvMAAAGEaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX1ulUioOdhB1yFB1sSAq4lirUIQKoVZo1cHk0i9o0pCkuDgKrgUHPxarDi7Oujq4CoLgB4izg5Oii5T4v6TQIsaD4368u/e4ewf4GxWmml1xQNUsI51MCNncqhB8RQhDCGMMExIz9TlRTMFzfN3Dx9e7GM/yPvfn6FXyJgN8AnGc6YZFvEE8s2npnPeJI6wkKcTnxOMGXZD4keuyy2+ciw77eWbEyKTniSPEQrGD5Q5mJUMlniaOKqpG+f6sywrnLc5qpcZa9+QvDOe1lWWu0xxGEotYgggBMmooowILMVo1UkykaT/h4R90/CK5ZHKVwcixgCpUSI4f/A9+d2sWpibdpHAC6H6x7Y8RILgLNOu2/X1s280TIPAMXGltf7UBzH6SXm9r0SOgbxu4uG5r8h5wuQMMPOmSITlSgKa/UADez+ibckD/LRBac3tr7eP0AchQV6kb4OAQGC1S9rrHu3s6e/v3TKu/H/GDctlwGrLNAAANemlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgIHhtcE1NOkRvY3VtZW50SUQ9ImdpbXA6ZG9jaWQ6Z2ltcDozZGZkZDU1ZS04ZWI1LTQ1MjEtYTAxNS1jNDBkZDI4YzQzOWQiCiAgIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZGRkMmEyZDktYzNjZS00YzFiLTgxN2ItODk2Y2ZiZDZhNDA1IgogICB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZmRmYzU0ZTMtZWY1OC00NmIxLTgwNDgtMDI5MDBiMjlhYjUwIgogICBHSU1QOkFQST0iMi4wIgogICBHSU1QOlBsYXRmb3JtPSJNYWMgT1MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNzMwMDMyOTU2Mjk1MTYzIgogICBHSU1QOlZlcnNpb249IjIuMTAuMzQiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICB0aWZmOk9yaWVudGF0aW9uPSIxIgogICB4bXA6Q3JlYXRvclRvb2w9IkdJTVAgMi4xMCIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNDoxMDoyN1QwOTo0MjozNC0wMzowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQ6MTA6MjdUMDk6NDI6MzQtMDM6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiODdmYTcxMi0yYzcxLTRjNWQtYjNkMC01ZjhjMjhiYjk1OGQiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoTWFjIE9TKSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0xMC0yN1QwOTo0MjozNi0wMzowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz6mL+W1AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH6AobDCokoRkq7QAAAaNJREFUeNrt2z1uwjAUwPHnqjsjXCE5ADMDN+hAbxKJA1TiJmHIDRgqdcvYIR27hjEneB3Are04H0BVVPj/pIjEzyRR7Gc7Q4yIiDa1iuvlVUREzObZjInH6pjJzLjHNp7uplIt953xof+fG0c/1SxXEVFtam01+ED8eKya5V49N+5uSaGtePjbFQ/rjomj2+M1Llot9+0eONBw2tRqszqsk+6mXtYnhWq6o3HHp3+QoafGLz2HZrkmhXrbcSQZjNv9pNDoOe1+634iZffIfD+M9cLLqKrcenO8fZg2e905VptabRZ6WX5cK8h6IbG4m7Gxm/t4MsbG7L5bZstpxl+YAsIG8hZ4Wa6piFTlVqQUSecraS0KgzJvEbY5NHJVbg/Xmq9+OscJbGOHnQCXTgFZruFCKjps9k0BzjDdNQXEhnd3hHG3WKzvuK8+zukQQSPZsjFz56lzbnje2PHYNYK7Ljj3fgAAAAAAAAAAAAAAAAAAAAAAAP4Dvqu7cX2fyZvJ7Dqfh+Nvvb1/dsYeeDz3jQ5ABwAdAHQA8BqIG30T7At+AfHg/0HIfoxbAAAAAElFTkSuQmCC",
      "codigo": ""
    }

    recibirMensaje(this, "señal-cargar-proyecto", (data) => {
      this.datos = data;
    });
  }


  actualizarCodigo(codigo) {
    /* se llama cuando se cambia el contenido del programa en
     * el editor de código. */
    this.datos['codigo'] = codigo;
  }

  obtenerProyectoCompleto() {
    return this.datos;
  }

}

let proyecto = new Proyecto();

window.ppp = proyecto;
export { proyecto };
