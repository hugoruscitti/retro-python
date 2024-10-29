all:
	@echo ""
	@echo "Comandos:"
	@echo ""
	@echo "  make ejecutar"
	@echo "  make crear-imagenes-de-fuentes"
	@echo ""


ejecutar:
	npm run dev

crear-imagenes-de-fuentes:
	python utils/crear-imagenes-de-fuentes.py
