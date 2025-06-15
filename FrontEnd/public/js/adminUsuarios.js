window.cargarModuloUsuarios = async function() {
  const contenedor = document.getElementById('moduloContenido');
  contenedor.innerHTML = `<div class="text-center text-gray-500">Cargando usuarios...</div>`;
  try {
    const res = await fetch('/api/usuarios/listar');
    const result = await res.json();
    if (!result.success) throw new Error(result.message);
    const usuarios = result.data;

    contenedor.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-blue-700">Usuarios</h2>
        <button id="btnNuevoUsuario" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Nuevo Usuario
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full border text-sm mb-6">
          <thead class="bg-blue-100">
            <tr>
              <th class="px-4 py-2">Nombre</th>
              <th class="px-4 py-2">Email</th>
              <th class="px-4 py-2">Teléfono</th>
              <th class="px-4 py-2">Rol</th>
              <th class="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${usuarios.map(u => `
              <tr>
                <td class="border px-4 py-2">${u.nombre}</td>
                <td class="border px-4 py-2">${u.email}</td>
                <td class="border px-4 py-2">${u.telefono}</td>
                <td class="border px-4 py-2">${u.rol}</td>
                <td class="border px-4 py-2">
                  <button class="bg-amber-500 px-2 py-1 rounded text-white" onclick="window.editarUsuario('${u.id}')">Editar</button>
                  <button class="bg-red-600 px-2 py-1 rounded text-white ml-2" onclick="window.eliminarUsuario('${u.id}')">Eliminar</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div id="formUsuarioAdmin"></div>
      </div>
    `;

    document.getElementById('btnNuevoUsuario').onclick = mostrarFormularioNuevoUsuario;
  } catch (err) {
    contenedor.innerHTML = `<div class="text-red-600 text-center">Error: ${err.message}</div>`;
  }
};

function mostrarFormularioNuevoUsuario() {
  const formHtml = `
    <form id="formAdminNuevoUsuario" class="bg-white p-6 rounded-lg shadow space-y-4 max-w-md mx-auto mt-4">
      <h3 class="text-xl font-semibold text-blue-600">Nuevo Usuario</h3>
      <input type="text" name="nombre" placeholder="Nombre" required class="w-full px-4 py-2 border rounded"/>
      <input type="email" name="email" placeholder="Email" required class="w-full px-4 py-2 border rounded"/>
      <input type="text" name="telefono" placeholder="Teléfono" required class="w-full px-4 py-2 border rounded"/>
      <input type="password" name="contrasena" placeholder="Contraseña" required class="w-full px-4 py-2 border rounded"/>
      <select name="rol" required class="w-full px-4 py-2 border rounded">
        <option value="cliente">Cliente</option>
        <option value="admin">Admin</option>
      </select>
      <div class="flex justify-end">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar</button>
      </div>
    </form>
  `;
  document.getElementById('formUsuarioAdmin').innerHTML = formHtml;

  document.getElementById('formAdminNuevoUsuario').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      nombre: form.nombre.value,
      email: form.email.value,
      telefono: form.telefono.value,
      contrasena: form.contrasena.value,
      rol: form.rol.value
    };
    const res = await fetch('/api/usuarios/crear', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      alert('Usuario creado');
      window.cargarModuloUsuarios();
    } else {
      alert(result.message);
    }
  };
}

window.eliminarUsuario = async function(id) {
  if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
  const res = await fetch(`/api/usuarios/eliminar/${id}`, { method: 'DELETE' });
  const result = await res.json();
  if (result.success) {
    alert('Usuario eliminado');
    window.cargarModuloUsuarios();
  } else {
    alert(result.message);
  }
};

window.editarUsuario = async function(id) {
  const res = await fetch('/api/usuarios/listar');
  const result = await res.json();
  const usuario = result.data.find(u => u.id === id);
  if (!usuario) return alert('Usuario no encontrado');

  const formHtml = `
    <form id="formAdminEditarUsuario" class="bg-white p-6 rounded-lg shadow space-y-4 max-w-md mx-auto mt-4">
      <h3 class="text-xl font-semibold text-blue-600">Editar Usuario</h3>
      <input type="text" name="nombre" placeholder="Nombre" value="${usuario.nombre}" required class="w-full px-4 py-2 border rounded"/>
      <input type="email" name="email" placeholder="Email" value="${usuario.email}" required class="w-full px-4 py-2 border rounded"/>
      <input type="text" name="telefono" placeholder="Teléfono" value="${usuario.telefono}" required class="w-full px-4 py-2 border rounded"/>
      <select name="rol" required class="w-full px-4 py-2 border rounded">
        <option value="cliente" ${usuario.rol === "cliente" ? "selected" : ""}>Cliente</option>
        <option value="admin" ${usuario.rol === "admin" ? "selected" : ""}>Admin</option>
      </select>
      <div class="flex justify-end">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Actualizar</button>
      </div>
    </form>
  `;
  document.getElementById('formUsuarioAdmin').innerHTML = formHtml;

  document.getElementById('formAdminEditarUsuario').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      nombre: form.nombre.value,
      email: form.email.value,
      telefono: form.telefono.value,
      rol: form.rol.value
    };
    const res = await fetch(`/api/usuarios/actualizar/${id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      alert('Usuario actualizado');
      window.cargarModuloUsuarios();
    } else {
      alert(result.message);
    }
  };
};
