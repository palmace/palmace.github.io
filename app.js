// Asegúrate de cambiar la URL de la API a tu URL pública una vez que la despliegues.
// Por ahora, usaremos la URL local para probar.
const API_URL = 'https://url-redirector-api.onrender.com/get_url';; 

async function fetchAndRedirect() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.url) {
            window.location.href = data.url;
        } else {
            console.error('Error: No se encontró URL en la respuesta.');
            alert('No se pudo obtener la URL. Por favor, inténtalo de nuevo más tarde.');
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        alert('Hubo un problema al conectar con el servidor. Revisa tu conexión.');
    }
}

document.addEventListener('DOMContentLoaded', fetchAndRedirect);
