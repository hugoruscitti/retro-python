# retro-python

El emulador de la mejor computadora creativa que nunca existió.

Puedes ver la versión más reciente online acá:

https://retro-python.com.ar

Si queres usar este proyecto de forma local, invocá al comando `make ejecutar`
y luego visitá está dirección con el navegador http://localhost:8000

Si este comando no te funciona, también podés ejecutar el comando `python -m
http.server` y listo. Retro-python no tiene un proceso de compilación ni nada
parecido, es proyecto JavaScript puro.


# Sprites

retro-python tiene varios sprites para dibujar llamando a la función
`drawSprite(x, y, index)`, donde index es el número de sprite.

Para cargar más sprites, se tiene que incrementar el valor del atributo
`spriteCount` dentro del archivo `js/canvas.js` y crear una imágen dentro
del directorio `static/sprites`.

# Colaboración

Podés ver las tareas que estamos desarrollando aquí:

https://trello.com/b/4refIscc/retro-python

