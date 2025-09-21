const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 segundos

async function healthCheck(url, retries = MAX_RETRIES) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return healthCheck(url, retries - 1);
        }
        return false;
    }
}

async function smartRedirect() {
    try {
        // Primero verificar si el túnel está activo
        const currentTunnelURL = 'https://properly-expression-sampling-mls.trycloudflare.com';
        const isTunnelActive = await healthCheck(currentTunnelURL);
        
        if (isTunnelActive) {
            window.location.href = currentTunnelURL;
        } else {
            // Si el túnel está caído, esperar y recargar
            await new Promise(resolve => setTimeout(resolve, 5000));
            window.location.reload();
        }
    } catch (error) {
        console.error('Error en redirección:', error);
        // Recargar después de 5 segundos
        setTimeout(() => window.location.reload(), 5000);
    }
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', smartRedirect);
