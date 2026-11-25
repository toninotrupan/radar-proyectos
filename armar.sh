#!/usr/bin/env bash
# Arma la carpeta que Vercel publica (_site). El código real de la plataforma (app/index.html) NO se publica:
# lo entrega api/app.js solo a cuentas con acceso. En su lugar va el cascarón app/entrada.html.
set -euo pipefail
rm -rf _site
mkdir _site
for f in * .nojekyll; do
  case "$f" in
    _site|api|node_modules|vercel.json|armar.sh|README.md|LICENSE|CNAME) continue ;;
  esac
  [ -e "$f" ] && cp -R "$f" _site/
done
rm -f _site/app/index.html
mv _site/app/entrada.html _site/app/index.html
echo "Sitio armado: $(find _site -type f | wc -l) archivos"
