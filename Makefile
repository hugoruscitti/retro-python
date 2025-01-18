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
	npm run dev

binarios:
	@echo "Para generar binarios primero se tiene que crear un nuevo tag"
	@echo "siguiendo estos pasos:"
	@echo " "
	@echo " cat package.json | grep version"
	@echo " "
	@echo " (incrementar esta versión)"
	@echo " "
	@echo " ejecutar un comando como:"
	@echo " "
	@echo " git tag 0.0.3"
	@echo " git push --tags"
	@echo " "
	@echo " make crear-binarios"
	@echo " "
	@echo " y por último subirlos al sitio que indica el comando anterior."
	@echo " "

crear-binarios:
	@echo "${Y}Este comando demorará unos 10 o 15 minutos ...${N}"
	@sleep 2
	@echo "Borrando binarios anteriores..."
	rm dist/retro-python*
	@sleep 1
	CSC_IDENTITY_AUTO_DISCOVERY=false time ./node_modules/.bin/electron-builder -mwl
	@echo "${Y}los archivos generados están en el directorio 'dist'${N}"
	ls dist/retro-python* | grep -v block
	@echo "${Y}el siguiente paso es subirlos como release aquí https://github.com/hugoruscitti/retro-python/tags${N}"

electron:
	./node_modules/.bin/electron .
