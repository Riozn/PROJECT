document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE = "/lugar";
  const params = new URLSearchParams(window.location.search);
  const lugarId = params.get("id");

  if (!lugarId) {
    alert("No se especificó un lugar para ver los detalles.");
    window.location.href = "/";
    return;
  }

  const token = localStorage.getItem("token");

  const bloqueResena = document.getElementById("nuevaResena");
  if (!token && bloqueResena) bloqueResena.classList.add("hidden");

  try {
    const lugarRes = await fetch(`${API_BASE}/${encodeURIComponent(lugarId)}`);
    if (!lugarRes.ok) throw new Error(`Error ${lugarRes.status}`);
    const lugar = await lugarRes.json();

    mostrarDatosLugar(lugar);
    inicializarMapa(lugar);
    configurarBotonReserva(lugar.id);
    await cargarResenas(lugar.id);
  } catch (error) {
    console.error("Error al cargar los datos del lugar:", error);
    alert("No se pudo cargar la información del lugar.");
    window.location.href = "/";
  }

  // Formulario de reseña
  const form = document.getElementById("formResena");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!token) {
        alert("Debes iniciar sesión para dejar una reseña.");
        return;
      }

      const puntuacion = document.getElementById("puntuacion").value;
      const comentario = document.getElementById("comentario").value.trim();

      if (!puntuacion || !comentario) {
        alert("Completa ambos campos.");
        return;
      }

      const resp = await fetch(`${API_BASE}/${lugarId}/resena`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ puntuacion, comentario })
      });

      if (resp.ok) {
        form.reset();
        await cargarResenas(lugarId);
      } else {
        let err = "Error desconocido";
        try {
          const json = await resp.json();
          err = json.error || JSON.stringify(json);
        } catch {
          err = await resp.text();
        }
        alert("Error: " + err);
      }
    });
  }
});

function mostrarDatosLugar(lugar) {
  document.getElementById("tituloLugarHeader").textContent = lugar.titulo || "Detalle del Lugar";
  document.getElementById("imagenPrincipal").src = lugar.url || "https://via.placeholder.com/800x400?text=Sin+imagen";
  document.getElementById("textoDescripcion").textContent = lugar.descripcion;
  document.getElementById("propietarioNombre").textContent = lugar.propietario;
  document.getElementById("propietarioTelefono").textContent = lugar.propietario_telefono || "-";
  document.getElementById("ciudadLugar").textContent = lugar.ciudad;
  document.getElementById("direccionLugar").textContent = `${lugar.calle || ""} ${lugar.numero || ""}`.trim();
  document.getElementById("capacidadLugar").textContent = lugar.capacidad || "-";
  document.getElementById("tamanoLugar").textContent = lugar.tamano_m2 || "-";
}

function inicializarMapa(lugar) {
  const mapEl = document.getElementById("map");
  if (lugar.latitud && lugar.longitud) {
    const mapa = L.map(mapEl).setView([lugar.latitud, lugar.longitud], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(mapa);
    L.marker([lugar.latitud, lugar.longitud]).addTo(mapa);
  } else {
    mapEl.innerHTML = "<p class='text-gray-500'>No hay coordenadas disponibles.</p>";
  }
}

function configurarBotonReserva(lugarId) {
  const btn = document.getElementById("btnReservar");
  if (btn) {
    btn.onclick = () => {
      window.location.href = `reserva.html?id=${encodeURIComponent(lugarId)}`;
    };
  }
}

async function cargarResenas(lugarId) {
  const res = await fetch(`/lugar/${encodeURIComponent(lugarId)}/resenas`);
  const reseñas = res.ok ? await res.json() : [];

  const lista = document.getElementById("listaReseñas");
  const estrellasProm = document.getElementById("estrellasPromedio");
  const valorProm = document.getElementById("valorPromedio");

  lista.innerHTML = "";
  estrellasProm.innerHTML = "";
  valorProm.textContent = "–";

  if (reseñas.length === 0) {
    lista.innerHTML = "<p class='text-gray-500'>Aún no hay reseñas.</p>";
    return;
  }

  const suma = reseñas.reduce((acc, r) => acc + r.puntuacion, 0);
  const promedio = (suma / reseñas.length).toFixed(1);
  valorProm.textContent = promedio;
  estrellasProm.innerHTML = generarEstrellasVisuales(promedio);

  reseñas.forEach(r => {
    const cont = document.createElement("div");
    cont.className = "border-b pb-4";
    cont.innerHTML = `
      <div class="flex items-center gap-1">${generarEstrellasVisuales(r.puntuacion)}</div>
      <p class="mt-2 text-gray-700">${r.comentario}</p>
      <p class="mt-1 text-sm text-gray-500">— ${r.usuario}, ${new Date(r.fecha).toLocaleDateString()}</p>
    `;
    lista.appendChild(cont);
  });
}

function generarEstrellasVisuales(valor) {
  const full = Math.floor(valor);
  const half = valor - full >= 0.5;
  let html = "";

  for (let i = 0; i < full; i++) {
    html += `<svg class='w-5 h-5 text-yellow-500' fill='currentColor' viewBox='0 0 20 20'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.176c.969 0 1.371 1.24.588 1.81l-3.375 2.455a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.538 1.118l-3.375-2.455a1 1 0 00-1.175 0l-3.375 2.455c-.783.57-1.838-.197-1.538-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.049 9.397c-.783-.57-.38-1.81.588-1.81h4.176a1 1 0 00.95-.69l1.286-3.97z'/></svg>`;
  }
  if (half) {
    html += `<svg class='w-5 h-5 text-yellow-500' fill='currentColor' viewBox='0 0 20 20'><path d='M9.049 2.927c.17-.522.961-.522 1.131 0l1.286 3.97a1 1 0 00.95.69h4.176c.488 0 .775.526.504.982l-3.375 2.455a1 1 0 00-.364 1.118l1.286 3.97c.17.522-.432.954-.867.636l-3.375-2.455a1 1 0 00-1.175 0l-3.375 2.455c-.435.318-1.037-.114-.867-.636l1.286-3.97a1 1 0 00-.364-1.118L2.049 9.397c-.271-.456.016-.982.504-.982h4.176a1 1 0 00.95-.69l1.286-3.97z'/></svg>`;
  }
  return html;
}
