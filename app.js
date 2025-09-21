// app.js - Versión CORREGIDA
async function redirectToLatestTunnel() {
    try {
        // Leer la URL MÁS RECIENTE de GitHub
        const response = await fetch('https://raw.githubusercontent.com/palmace/palmace.github.io/main/url.txt?' + Date.now());
        const tunnelURL = await response.text();
        
        console.log('🔗 URL del túnel:', tunnelURL);
        
        // Verificar que sea una URL válida
        if (tunnelURL && tunnelURL.startsWith('https://') && tunnelURL.includes('.trycloudflare.com')) {
            window.location.href = tunnelURL;
        } else {
            throw new Error('URL inválida');
        }
    } catch (error) {
        console.error('Error obteniendo URL:', error);
        
        // Fallback: Recargar la página después de 5 segundos
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px; font-family: sans-serif;">
                <h2>🔄 Reconectando...</h2>
                <p>El sistema se recargará automáticamente en 5 segundos</p>
                <p><small>Si persiste, visita: https://palmace.github.io</small></p>
            </div>
        `;
        
        setTimeout(() => window.location.reload(), 5000);
    }
}

// Iniciar inmediatamente
document.addEventListener('DOMContentLoaded', redirectToLatestTunnel);
