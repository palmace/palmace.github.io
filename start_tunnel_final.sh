#!/bin/bash

REPO_PATH="/data/data/com.termux/files/home/palmace.github.io"
OUTPUT_FILE="/data/data/com.termux/files/home/tunnel_output.txt"

echo "🔍 Verificando servidor local..."
if ! curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "❌ ERROR: Servidor local no responde en puerto 8000"
    echo "💡 Ejecuta en otra terminal: cd ~/palmace.github.io && python -m http.server 8000 &"
    exit 1
fi

echo "✅ Servidor local funcionando"

# Detener tunnels previos
pkill cloudflared 2>/dev/null
sleep 2

echo "🌐 Iniciando túnel Cloudflare..."
cloudflared tunnel --url http://localhost:8000 > "$OUTPUT_FILE" 2>&1 &

echo "⏳ Esperando 20 segundos para estabilización..."
sleep 20

# Extraer URL
URL=$(grep -o 'https://[^ ]*\.trycloudflare\.com' "$OUTPUT_FILE" 2>/dev/null | head -1)

if [ -n "$URL" ]; then
    echo "✅ URL del túnel obtenida: $URL"
    
    cd "$REPO_PATH" || { echo "❌ Error: No se pudo acceder al repositorio"; exit 1; }
    
    # Actualizar archivo
    echo "$URL" > url.txt
    
    # Configurar Git (solo una vez)
    git config --global user.email "tu-email@gmail.com"
    git config --global user.name "Tu Nombre"
    
    echo "📤 Subiendo a GitHub..."
    
    # Primero prueba si podemos hacer fetch (verifica autenticación)
    if git fetch origin main 2>/dev/null; then
        # Autenticación OK, proceder con push
        if git add url.txt && \
           git commit -m "Actualizar URL: $(date '+%Y-%m-%d %H:%M')" && \
           git push origin main; then
            echo "🎉 ¡ÉXITO! URL actualizada: $URL"
            echo "🌍 Tu PWA está en: https://palmace.github.io"
        else
            echo "❌ Error en git push (después de autenticación exitosa)"
        fi
    else
        echo "❌ Error de autenticación con GitHub"
        echo "💡 Solución:"
        echo "   1. Ve a https://github.com/settings/tokens"
        echo "   2. Crea nuevo token con permisos 'repo'"
        echo "   3. Ejecuta:"
        echo "      git remote set-url origin https://palmace:TU_NUEVO_TOKEN@github.com/palmace/palmace.github.io.git"
    fi
else
    echo "❌ No se pudo obtener URL. Errores:"
    cat "$OUTPUT_FILE"
fi

rm -f "$OUTPUT_FILE"
