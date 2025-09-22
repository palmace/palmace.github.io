#!/bin/bash

REPO_PATH="/data/data/com.termux/files/home/palmace.github.io"
LOG_FILE="/data/data/com.termux/files/home/tunnel_log.txt"

echo "🚀 Iniciando sistema de túnel permanente..."
echo "📱 Servidor: Android Phone"
echo "🌍 PWA: https://palmace.github.io"
echo "⏰ Iniciado: $(date)"

# Función para reiniciar el túnel
restart_tunnel() {
    echo "🔄 Reiniciando túnel..."
    pkill cloudflared 2>/dev/null
    sleep 5
    
    # Iniciar tunnel y capturar URL
    cloudflared tunnel --url http://localhost:8000 > "$LOG_FILE" 2>&1 &
    sleep 30
    
    # Extraer nueva URL
    NEW_URL=$(grep -o 'https://[^ ]*\.trycloudflare\.com' "$LOG_FILE" | grep -v api.trycloudflare.com | head -1)
    
    if [ -n "$NEW_URL" ]; then
        echo "✅ Nuevo túnel: $NEW_URL"
        
        # Actualizar GitHub
        cd "$REPO_PATH"
        echo "$NEW_URL" > url.txt
        git add url.txt
        git commit -m "Túnel reiniciado: $(date '+%Y-%m-%d %H:%M')" > /dev/null 2>&1
        git push origin main > /dev/null 2>&1
        
        echo "📊 URL actualizada en GitHub"
    fi
}

# Primer inicio
restart_tunnel

# Monitoreo continuo
echo "🔄 Monitoreando túnel (reinicio automático cada 30min)..."
while true; do
    sleep 1800  # 30 minutos
    
    # Verificar si el tunnel sigue activo
    if ! pgrep cloudflared > /dev/null; then
        echo "❌ Tunnel caído - Reiniciando..."
        restart_tunnel
    else
        echo "✅ Tunnel activo - $(date)"
    fi
done
