all:
	@echo ""
	@echo "Comandos:"
	@echo ""
	@echo "  make ejecutar"
	@echo "  make compilar"
	@echo "  make nwjs"
	@echo "  make crear-imagenes-de-fuentes"
	@echo ""


ejecutar:
	parcel serve index.html --open

compilar:
	rm -rf dist
	mkdir dist
	cp utils/package.json dist/
	parcel build index.html editor.html --no-cache --dist-dir dist

crear-imagenes-de-fuentes:
	python utils/crear-imagenes-de-fuentes.py

nwjs:
	open -a "nwjs" --args $(realpath dist)
