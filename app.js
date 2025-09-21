// URL DIRECTA - Ignorar la API de Render
const TUNNEL_URL = 'https://properly-expression-sampling-mls.trycloudflare.com';

// Redirigir inmediatamente
function redirectToTunnel() {
    // Verificar si estamos en la página principal
    if (window.location.href === 'https://palmace.github.io/' || 
        window.location.href === 'https://palmace.github.io') {
        window.location.href = TUNNEL_URL;
    }
}

// Redirigir inmediatamente al cargar la página
document.addEventListener('DOMContentLoaded', redirectToTunnel);

// También redirigir si el usuario vuelve atrás
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        redirectToTunnel();
    }
});
