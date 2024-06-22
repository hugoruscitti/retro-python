# retro-python
 
El emulador de la mejor computadora creativa que nunca existió

Puedes ver la versión más reciente online acá:

https://hugoruscitti.github.io/retro-python/

Si queres usar este proyecto de forma local, tendrías que ejecutar
el comando `make ejecutar` y luego visitar la web http://localhost:8000

Si este comando no funciona, puedes ejecutar `python -m http.server` y listo.

También puedes ver las tareas que estamos desarrollando aquí:

https://trello.com/b/4refIscc/retro-python


# Como generar codemirror bundle.

Iniciar un directorio desde cero, hacer un paquete npm, instalar rollup y
tener un entry point para que rollup sepa qué módulos incluir en el bundle:


```
mkdir codemirror
cd codemirror
npm init
npm i codemirror @codemirror/lang-python
npm i rollup @rollup/plugin-node-resolve
```

Luego creamos el archivo editor.mjs con este contenido:


```
import {EditorView, basicSetup} from "codemirror"
import {python} from "@codemirror/lang-python"

window.EditorView = EditorView;
window.python = python;
window.basicSetup = basicSetup;
```

luego, hay que compilar:

```
node_modules/.bin/rollup editor.mjs -f iife -o editor.bundle.js \\n  -p @rollup/plugin-node-resolve\n
```

Esto crea el archivo editor.bundle.js, este es el archivo que se
tiene que agregar al repositorio y es el que se va a utilizar
desde el archivo index.html, por ejemplo así:

```html
<script src="editor.bundle.js"></script>
```

y luego, desde el componente o cualquier otra parte de javascript, se puede
iniciar una instancia del editor así:


```
let editor = new EditorView({
  extensions: [basicSetup, python()],
  parent: document.body
})
```


