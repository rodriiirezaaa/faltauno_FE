// Inicialización básica del mapa centrado en Ourense
const mapa = L.map('mapa-pistas').setView([42.3367, -7.8637], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(mapa);

// Función para cargar solo las pistas (sin estado inteligente)
async function cargarPistasBasicas() {
    try {
        const response = await fetch('http://localhost:8080/api/pistas');
        const pistas = await response.json();

        pistas.forEach(pista => {
            // Marcador genérico azul para el prototipo 1
            L.marker([pista.latitud, pista.longitud])
             .addTo(mapa)
             .bindPopup(`<b>${pista.nombre}</b><br>Deporte: ${pista.deporte}`);
        });
    } catch (error) {
        console.error("Error cargando el mapa básico:", error);
    }
}

// Retraso de seguridad para evitar el fallo del "mapa gris"
setTimeout(() => {
    mapa.invalidateSize();
    cargarPistasBasicas();
}, 200);