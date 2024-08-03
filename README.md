# retro-python

El emulador de la mejor computadora creativa que nunca existió

Puedes ver la versión más reciente online acá:

https://retro-python.com.ar

Si queres usar este proyecto de forma local, tendrías que ejecutar
el comando `make ejecutar` y luego visitar la web http://localhost:8000

Si este comando no funciona, puedes ejecutar `python -m http.server` y listo.

También puedes ver las tareas que estamos desarrollando aquí:

https://trello.com/b/4refIscc/retro-python


# Sprites

retro-python tiene varios sprites para dibujar llamando a la función
`drawSprite(x, y, index)`, donde index es el número de sprite.

Para cargar más sprites, se tiene que incrementar el valor del atributo
`spriteCount` dentro del archivo `js/scene.js` y crear una imágen dentro
del directorio `static/sprites`.
