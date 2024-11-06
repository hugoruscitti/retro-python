all:
	@echo ""
	@echo "Comandos:"
	@echo ""
	@echo "  make iniciar"
	@echo "  make ejecutar"
	@echo "  make crear-imagenes-de-fuentes"
	@echo ""

iniciar:
	npm install

ejecutar:
	npm run dev

crear-imagenes-de-fuentes:
	python utils/crear-imagenes-de-fuentes.py
