const navUser = document.getElementById("nav-user");
const usuario = JSON.parse(localStorage.getItem("usuario"));

if (navUser) {
  if (usuario) {
    let botones = '';

    if (usuario.rol === 'cliente') {
      botones += `
        <a href="publicar.html" class="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition">
          📌 Publicar Lugar
        </a>
        <a href="misReservas.html" class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition">
          📅 Mis Reservas (como Propietario)
        </a>
        <a href="misReservasCliente.html" class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition">
          🕓 Reservas Hechas
        </a>
      `;
    }

    navUser.innerHTML = `
      <div class="flex items-center gap-2">
        ${botones}
        <div class="relative">
          <button id="perfilBtn" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            👤 ${usuario.nombre}
          </button>
          <div id="menuPerfil" class="hidden absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
            <button onclick="cerrarSesion()" class="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    `;

    document.addEventListener("click", (e) => {
      const btn = document.getElementById("perfilBtn");
      const menu = document.getElementById("menuPerfil");
      if (btn && btn.contains(e.target)) {
        menu.classList.toggle("hidden");
      } else if (menu && !menu.contains(e.target)) {
        menu.classList.add("hidden");
      }
    });

  } else {
    navUser.innerHTML = `
      <a href="auth.html" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Registrarse / Iniciar Sesión
      </a>
    `;
  }
}

function cerrarSesion() {
  localStorage.clear();
  location.reload();
}
