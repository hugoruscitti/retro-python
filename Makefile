N=[0m
G=[01;32m
Y=[01;33m
B=[01;34m

all:
	@echo ""
	@echo "${Y}Comandos:${N}"
	@echo ""
	@echo "  ${G}make iniciar${N}"
	@echo "  ${G}make ejecutar${N}"
	@echo "  ${G}make electron${N}"
	@echo "  ${G}make binarios${N}"
	@echo ""

iniciar:
	npm install

ejecutar:
	@echo " "
	@echo "${G}Iniciando http://localhost:8000${N}"
	@echo " "
	python -m http.server

binarios:
	@echo "Para generar binarios primero se tiene que crear un nuevo tag"
	@echo "siguiendo estos pasos:"
	@echo " "
	@echo " 1) cat package.json | grep version"
	@echo " "
	@echo " (incrementar esta versión)"
	@echo " "
	@echo " 2) ejecutar un comando como:"
	@echo " "
	@echo " git tag 0.0.3"
	@echo " git push --tags"
	@echo " "
	@echo " 3) make crear-binarios"
	@echo " "
	@echo " y por último subirlos al sitio que indica el comando anterior."
	@echo " "

crear-binarios:
	@echo "${Y}Este comando demorará unos 10 o 15 minutos ...${N}"
	@sleep 2
	@echo "Borrando binarios anteriores..."
	rm -rf dist/retro-python*
	@sleep 1
	CSC_IDENTITY_AUTO_DISCOVERY=false time ./node_modules/.bin/electron-builder -mwl --win=portable
	@echo "${Y}los archivos generados están en el directorio 'dist'${N}"
	zip --junk-paths -r dist/retro-python-windows-portable.zip dist/win-unpacked
	ls dist/retro-python* | grep -v block
	@echo "${Y}el siguiente paso es subirlos como release aquí https://github.com/hugoruscitti/retro-python/tags${N}"

electron:
	./node_modules/.bin/electron .
