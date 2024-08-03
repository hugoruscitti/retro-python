all:
	@echo ""
	@echo "Comandos:"
	@echo ""
	@echo "  make ejecutar-live"
	@echo "  make ejecutar"
	@echo ""

ejecutar-live:
	@echo "Visita http://localhost:5555"
	@httpwatcher

ejecutar:
	@echo "Visita http://localhost:8000"
	python -m http.server
