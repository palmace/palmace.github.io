const MAX_RETRIES = 2;
const RETRY_DELAY = 3000; // 3 segundos

async function healthCheck(url, retries = MAX_RETRIES) {
    try {
        // Usar mode: 'no-cors' para evitar problemas CORS
        const response = await fetch(url, { 
            method: 'HEAD',
            mode: 'no-cors'
        });
        return true; // Si no hay error, asumimos que funciona
    } catch (error) {
        console.log('Intento fallido:', retries);
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return healthCheck(url, retries - 1);
        }
        return false;
    }
}

async function smartRedirect() {
    console.log('🔍 Iniciando redirección inteligente...');
    
    // URL actual del túnel (cambia esta según tu tunnel actual)
    const currentTunnelURL = 'https://properly-expression-sampling-mls.trycloudflare.com';
    
    try {
        console.log('🔄 Verificando estado del túnel...');
        const isTunnelActive = await healthCheck(currentTunnelURL);
        
        if (isTunnelActive) {
            console.log('✅ Túnel activo - Redirigiendo...');
            window.location.href = currentTunnelURL;
        } else {
            console.log('❌ Túnel inactivo - Recargando en 5s...');
            // Mostrar mensaje al usuario
            document.body.innerHTML = `
                <div style="text-align: center; padding: 50px; font-family: sans-serif;">
                    <h2>⏳ Túnel en reinicio</h2>
                    <p>El servidor se está reconectando. Esto tomará 30-60 segundos.</p>
                    <p>La página se recargará automáticamente.</p>
                    <p>URL: ${currentTunnelURL}</p>
                </div>
            `;
            setTimeout(() => window.location.reload(), 5000);
        }
    } catch (error) {
        console.error('Error crítico:', error);
        // Redirección directa como último recurso
        window.location.href = currentTunnelURL;
    }
}

// Versión SIMPLE y directa (alternativa)
function redirectSimple() {
    const tunnelURL = 'https://properly-expression-sampling-mls.trycloudflare.com';
    console.log('🚀 Redirección directa a:', tunnelURL);
    window.location.href = tunnelURL;
}

// Iniciar inmediatamente
console.log('🏁 PWA cargada - Iniciando redirección');
document.addEventListener('DOMContentLoaded', redirectSimple); // Usar esta para probar
