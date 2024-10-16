from PIL import Image

COLORES = [
    "0x000000",
    "0x1D2B53",
    "0x7E2553",
    "0x008751",
    "0xAB5236",
    "0x5F574F",
    "0xC2C3C7",
    "0xFFF1E8",
    "0xFF004D",
    "0xFFA300",
    "0xFFEC27",
    "0x00E436",
    "0x29ADFF",
    "0x83769C",
    "0xFF77A8",
    "0xFFCCAA",
]

def convertir_color_en_tupla(color_hex):
    r = color_hex[2:4]
    g = color_hex[4:6]
    b = color_hex[6:8]
    return(int(r, 16), int(g, 16), int(b, 16),)

def crear_imagen(imagen, indice, color):
    nombre_de_archivo = f"static/recursos/fuente-{indice}.png"
    r, g, b = convertir_color_en_tupla(color)
    pixels = list(imagen.getdata())

    pixels_resultado = [
            (r, g, b, 255) if pixel == (255, 255, 255, 255) else pixel for pixel in pixels
    ]

    imagen_nueva = Image.new(imagen.mode, imagen.size)
    imagen_nueva.putdata(pixels_resultado)
    print(f"creando imagen {nombre_de_archivo}")
    imagen_nueva.save(nombre_de_archivo)

def main():
    IMAGEN_ORIGINAL = "static/recursos/fuente-original.png"
    imagen = Image.open(IMAGEN_ORIGINAL)

    for indice, color in enumerate(COLORES):
        crear_imagen(imagen, indice, color)

if __name__ == "__main__":
    main()
