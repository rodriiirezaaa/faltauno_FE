const mapa = L.map('mapa-inteligente').setView([42.3367, -7.8637], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapa);

// Definición de iconos personalizados
const iconoLibre = L.icon({ iconUrl: 'img/pin-verde.png', iconSize: [25, 41] });
const iconoAlerta = L.icon({ iconUrl: 'img/pin-naranja.png', iconSize: [25, 41] });

async function cargarDashboardCompleto() {
    try {
        // 1. Cargamos pistas y alertas a la vez
        const resPistas = await fetch('http://localhost:8080/api/pistas');
        const pistas = await resPistas.json();
        
        const resAlertas = await fetch('http://localhost:8080/api/alertas');
        const alertas = await resAlertas.json();

        const contenedorTablon = document.getElementById('lista-alertas');
        contenedorTablon.innerHTML = '';

        pistas.forEach(pista => {
            // Buscamos si esta pista tiene una alerta activa
            const alertaActiva = alertas.find(a => a.idPista === pista.id && a.estado === 'ABIERTO');
            
            // Lógica inteligente de colores
            const iconoUsado = alertaActiva ? iconoAlerta : iconoLibre;
            const estadoTexto = alertaActiva ? `¡Faltan ${alertaActiva.jugadoresFaltantes} jugadores!` : "Pista Libre";

            L.marker([pista.latitud, pista.longitud], { icon: iconoUsado })
             .addTo(mapa)
             .bindPopup(`<b>${pista.nombre}</b><br>${estadoTexto}`);

            // Si hay alerta, pintamos el ticket en el tablón
            if (alertaActiva) {
                const claseDeporte = pista.deporte.toLowerCase() === 'futbol' ? 'futbol' : '';
                contenedorTablon.innerHTML += `
                    <div class="ticket ${claseDeporte}">
                        <h4>${pista.deporte.toUpperCase()}</h4>
                        <p>📍 ${pista.nombre}</p>
                        <p>Faltan: <strong>${alertaActiva.jugadoresFaltantes}</strong></p>
                        <button onclick="unirseAlerta(${alertaActiva.id})">Apuntarse</button>
                    </div>
                `;
            }
        });
    } catch (error) {
        console.error("Error cargando el dashboard:", error);
    }
}

function unirseAlerta(idAlerta) {
    alert("Procesando unión al partido " + idAlerta + "...");
    // Aquí iría el fetch POST a /api/alertas/unirse
}

setTimeout(() => {
    mapa.invalidateSize();
    cargarDashboardCompleto();
}, 200);