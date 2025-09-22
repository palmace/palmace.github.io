// app.js - Versión DEFINITIVA sin bucles
console.log('🔧 app.js iniciado - Redirección inteligente');

// Bandera GLOBAL para evitar múltiples ejecuciones
if (window.redirectCompleted) {
    console.log('⏩ Redirección ya completada - Evitando re-ejecución');
} else {
    window.redirectCompleted = true;
    
    async function smartDynamicRedirect() {
        console.log('🔄 Iniciando proceso de redirección...');
        
        try {
            // Actualizar UI inmediatamente
            if (document.getElementById('status')) {
                document.getElementById('status').textContent = 'Estado: Obteniendo URL actualizada...';
            }
            
            // Leer URL dinámica de GitHub (con cache-busting)
            const timestamp = Date.now();
            const githubUrl = `https://raw.githubusercontent.com/palmace/palmace.github.io/main/url.txt?t=${timestamp}`;
            
            console.log('📡 Conectando a GitHub...', githubUrl);
            const response = await fetch(githubUrl);
            
            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }
            
            const tunnelURL = (await response.text()).trim();
            console.log('🌐 URL obtenida:', tunnelURL);
            
            // Validación robusta de la URL
            if (tunnelURL && 
                tunnelURL.startsWith('https://') && 
                tunnelURL.includes('.trycloudflare.com') &&
                tunnelURL.length > 30) {
                
                console.log('✅ URL válida detectada');
                
                // Actualizar UI
                if (document.getElementById('status')) {
                    document.getElementById('status').textContent = 'Estado: Redirigiendo...';
                    document.getElementById('currentUrl').textContent = `Destino: ${tunnelURL}`;
                }
                
                // Redirigir después de breve pausa visual
                setTimeout(() => {
                    console.log('🚀 Ejecutando redirección final');
                    // Usar location.replace() para NO guardar en historial
                    window.location.replace(tunnelURL);
                }, 1500);
                
            } else {
                throw new Error(`URL inválida o mal formada: "${tunnelURL}"`);
            }
            
        } catch (error) {
            console.error('❌ Error en redirección:', error);
            
            // Mostrar error en UI
            if (document.getElementById('status')) {
                document.getElementById('status').textContent = 'Estado: Error - Reconectando...';
                document.getElementById('currentUrl').textContent = `Error: ${error.message}`;
            }
            
            // Recargar después de 5 segundos (solo si aún estamos en palmace.github.io)
            setTimeout(() => {
                if (window.location.href.includes('palmace.github.io')) {
                    console.log('🔄 Recargando página...');
                    window.location.reload();
                }
            }, 5000);
        }
    }
    
    // Control de ejecución - Solo ejecutar si estamos en la página principal
    if (window.location.href === 'https://palmace.github.io/' || 
        window.location.href === 'https://palmace.github.io' ||
        window.location.href.includes('palmace.github.io/index')) {
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', smartDynamicRedirect);
        } else {
            smartDynamicRedirect();
        }
        
    } else {
        console.log('📍 No en página principal - No redirigir');
    }
}
