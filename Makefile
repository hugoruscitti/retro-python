all:
	@echo ""
	@echo "Comandos:"
	@echo ""
	@echo "  make iniciar"
	@echo "  make ejecutar"
	@echo "  make electron"
	@echo "  make binarios"
	@echo ""

iniciar:
	npm install

ejecutar:
	npm run dev

binarios:
	@echo "este comando demorará unos 10 o 15 minutos ..."
	CSC_IDENTITY_AUTO_DISCOVERY=false time ./node_modules/.bin/electron-builder -mwl
	@echo "los archivos generados están en el directorio 'dist'"
	ls dist/retro-python* | grep -v block

electron:
	./node_modules/.bin/electron .
