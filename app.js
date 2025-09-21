// app.js - Versión MEJORADA (mantiene toda la funcionalidad)
async function redirectToLatestTunnel() {
    try {
        console.log('🔄 Iniciando redirección...');
        
        // Leer la URL MÁS RECIENTE de GitHub (con timestamp para evitar cache)
        const response = await fetch('https://raw.githubusercontent.com/palmace/palmace.github.io/main/url.txt?' + Date.now());
        
        if (!response.ok) {
            throw new Error('Error al leer URL de GitHub: ' + response.status);
        }
        
        const tunnelURL = (await response.text()).trim();
        console.log('🔗 URL obtenida:', tunnelURL);
        
        // Verificar que sea una URL válida de Cloudflare
        if (tunnelURL && tunnelURL.startsWith('https://') && tunnelURL.includes('.trycloudflare.com')) {
            console.log('✅ URL válida - Redirigiendo...');
            
            // Actualizar el estado en la página
            if (document.getElementById('status')) {
                document.getElementById('status').textContent = 'Estado: Redirigiendo...';
                document.getElementById('currentUrl').textContent = 'Destino: ' + tunnelURL;
            }
            
            // Redirigir después de breve pause para que el usuario vea el estado
            setTimeout(() => {
                window.location.href = tunnelURL;
            }, 1500);
            
        } else {
            throw new Error('URL inválida o mal formada: ' + tunnelURL);
        }
        
    } catch (error) {
        console.error('❌ Error en redirección:', error);
        
        // Mostrar mensaje de error en la interfaz
        if (document.getElementById('status')) {
            document.getElementById('status').textContent = 'Estado: Error - Reconectando en 5s...';
            document.getElementById('currentUrl').textContent = 'Error: ' + error.message;
        }
        
        // Recargar después de 5 segundos para reintentar
        setTimeout(() => {
            window.location.reload();
        }, 5000);
    }
}

// Función de emergencia: Redirección directa si todo falla
function emergencyRedirect() {
    const fallbackURL = 'https://productive-advise-relationship-public.trycloudflare.com';
    console.log('🚨 Redirección de emergencia a:', fallbackURL);
    window.location.href = fallbackURL;
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏁 PWA cargada - Iniciando proceso de redirección');
    
    // Iniciar redirección principal
    redirectToLatestTunnel();
    
    // Backup: Si después de 10 segundos no ha redirigido, forzar redirección
    setTimeout(() => {
        if (window.location.href.includes('palmace.github.io')) {
            console.log('⏰ Timeout - Forzando redirección de emergencia');
            emergencyRedirect();
        }
    }, 10000);
});

// También redirigir si el usuario vuelve atrás
window.addEventListener('pageshow', function(event) {
    if (event.persisted && window.location.href.includes('palmace.github.io')) {
        console.log('↩️ Usuario volvió atrás - Re-redirigiendo');
        redirectToLatestTunnel();
    }
});
