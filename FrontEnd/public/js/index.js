
function mostrarDatosLugares(data) {
  const contenedor = document.getElementById('lista-lugares');
  contenedor.innerHTML = '';

  if (!Array.isArray(data) || data.length === 0) {
    contenedor.innerHTML = '<p class="col-span-full text-center text-gray-500">No hay lugares disponibles.</p>';
    return;
  }

  data.forEach((lugar) => {
    const card = document.createElement('a');
    card.href = `lugar.html?id=${encodeURIComponent(lugar.id)}`;
    card.className = 'tarjeta-lugar group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition';

    card.setAttribute('data-ciudad', lugar.ciudad || '');
    card.setAttribute('data-categoria', lugar.categoria || '');
    card.setAttribute('data-precio', lugar.precio != null ? lugar.precio : '0');

    const imagenSrc = lugar.url && lugar.url.trim() !== ''
      ? lugar.url
      : 'https://via.placeholder.com/400x250?text=Sin+imagen';

    card.innerHTML = `
      <img
        src="${imagenSrc}"
        alt="${lugar.titulo}"
        class="w-full h-40 object-cover group-hover:scale-105 transition"
      />
      <div class="p-4">
        <h4 class="text-lg font-semibold mb-2">${lugar.titulo}</h4>
        <p class="text-gray-600 mb-1">${lugar.descripcion}</p>
        <p class="text-gray-800 font-semibold">
          ${parseFloat(lugar.precio).toFixed(2)} Bs / ${lugar.modalidad.replace('_', ' ')}
        </p>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function configurarFiltros() {
  const ciudadInput = document.getElementById("filtroCiudad");
  const categoriaSelect = document.getElementById("filtroCategoria");
  const precioMinInput = document.getElementById("filtroPrecioMin");
  const precioMaxInput = document.getElementById("filtroPrecioMax");

  const aplicarFiltros = () => {
    const ciudad = ciudadInput.value.trim().toLowerCase();
    const categoria = categoriaSelect.value.trim().toLowerCase();
    const precioMin = isNaN(parseFloat(precioMinInput.value)) ? 0 : parseFloat(precioMinInput.value);
    const precioMax = isNaN(parseFloat(precioMaxInput.value)) ? Infinity : parseFloat(precioMaxInput.value);

    const tarjetas = document.querySelectorAll("#lista-lugares .tarjeta-lugar");

    tarjetas.forEach((card) => {
      const ciudadLugar = (card.dataset.ciudad || '').trim().toLowerCase();
      const categoriaLugar = (card.dataset.categoria || '').trim().toLowerCase();
      const precioLugar = parseFloat(card.dataset.precio);

      const coincideCiudad = ciudad === "" || ciudadLugar.includes(ciudad);
      const coincideCategoria = categoria === "" || categoriaLugar === categoria;
      const coincidePrecioMin = precioLugar >= precioMin;
      const coincidePrecioMax = precioLugar <= precioMax;

      if (coincideCiudad && coincideCategoria && coincidePrecioMin && coincidePrecioMax) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  };

  ciudadInput.addEventListener("input", aplicarFiltros);
  categoriaSelect.addEventListener("change", aplicarFiltros);
  precioMinInput.addEventListener("input", aplicarFiltros);
  precioMaxInput.addEventListener("input", aplicarFiltros);
}

document.addEventListener('DOMContentLoaded', () => {
  cargarLugares();
  configurarFiltros();
});


function cargarLugares() {
  fetch('/lugar/obtenerLugares')
    .then(res => {
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return res.json();
    })
    .then(response => {
      mostrarDatosLugares(response.data || []);
    })
    .catch(err => {
      console.error('Error al cargar lugares:', err);
      const contenedor = document.getElementById('lista-lugares');
      contenedor.innerHTML = '<p class="col-span-full text-center text-red-500">No se pudieron cargar los lugares.</p>';
    });
}

function configurarFiltros() {
  const ciudadInput = document.getElementById("filtroCiudad");
  const categoriaSelect = document.getElementById("filtroCategoria");
  const precioMinInput = document.getElementById("filtroPrecioMin");
  const precioMaxInput = document.getElementById("filtroPrecioMax");

  const aplicarFiltros = () => {
    const ciudad = ciudadInput.value.trim().toLowerCase();
    const categoria = categoriaSelect.value.trim().toLowerCase();
    const precioMin = isNaN(parseFloat(precioMinInput.value)) ? 0 : parseFloat(precioMinInput.value);
    const precioMax = isNaN(parseFloat(precioMaxInput.value)) ? Infinity : parseFloat(precioMaxInput.value);

    const tarjetas = document.querySelectorAll("#lista-lugares .tarjeta-lugar");

    tarjetas.forEach((card) => {
      const ciudadLugar = (card.dataset.ciudad || '').trim().toLowerCase();
      const categoriaLugar = (card.dataset.categoria || '').trim().toLowerCase();
      const precioLugar = parseFloat(card.dataset.precio);

      const coincideCiudad = ciudad === "" || ciudadLugar.includes(ciudad);
      const coincideCategoria = categoria === "" || categoriaLugar === categoria;
      const coincidePrecioMin = precioLugar >= precioMin;
      const coincidePrecioMax = precioLugar <= precioMax;

      if (coincideCiudad && coincideCategoria && coincidePrecioMin && coincidePrecioMax) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  };

  ciudadInput.addEventListener("input", aplicarFiltros);
  categoriaSelect.addEventListener("change", aplicarFiltros);
  precioMinInput.addEventListener("input", aplicarFiltros);
  precioMaxInput.addEventListener("input", aplicarFiltros);
}

document.addEventListener('DOMContentLoaded', () => {
  cargarLugares();
  configurarFiltros();
});


function cargarLugares() {
  fetch('/lugar/obtenerLugares')
    .then((res) => {
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return res.json();
    })
    .then((lugares) => {
      mostrarDatosLugares(lugares);
    })
    .catch((err) => {
      console.error('Error al cargar lugares:', err);
      const contenedor = document.getElementById('lista-lugares');
      contenedor.innerHTML =
        '<p class="col-span-full text-center text-red-500">No se pudieron cargar los lugares.</p>';
    });
}

function configurarFiltros() {
  const ciudadInput = document.getElementById("filtroCiudad");
  const categoriaSelect = document.getElementById("filtroCategoria");
  const precioMinInput = document.getElementById("filtroPrecioMin");
  const precioMaxInput = document.getElementById("filtroPrecioMax");

  const aplicarFiltros = () => {
    const ciudad = ciudadInput.value.toLowerCase();
    const categoria = categoriaSelect.value.toLowerCase();
    const precioMin = parseFloat(precioMinInput.value);
    const precioMax = parseFloat(precioMaxInput.value);

    const tarjetas = document.querySelectorAll("#lista-lugares .tarjeta-lugar");

    tarjetas.forEach((card) => {
      const ciudadLugar = card.dataset.ciudad.toLowerCase();
      const categoriaLugar = card.dataset.categoria.toLowerCase();
      const precioLugar = parseFloat(card.dataset.precio);

      const coincideCiudad = ciudad === "" || ciudadLugar.includes(ciudad);
      const coincideCategoria = categoria === "" || categoriaLugar === categoria;
      const coincidePrecioMin = isNaN(precioMin) || precioLugar >= precioMin;
      const coincidePrecioMax = isNaN(precioMax) || precioLugar <= precioMax;

      if (coincideCiudad && coincideCategoria && coincidePrecioMin && coincidePrecioMax) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  };

  ciudadInput.addEventListener("input", aplicarFiltros);
  categoriaSelect.addEventListener("change", aplicarFiltros);
  precioMinInput.addEventListener("input", aplicarFiltros);
  precioMaxInput.addEventListener("input", aplicarFiltros);
}

document.addEventListener('DOMContentLoaded', () => {
  cargarLugares();
  configurarFiltros();
});
