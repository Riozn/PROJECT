window.cargarModuloLugares = async function() {
  const contenedor = document.getElementById('moduloContenido');
  contenedor.innerHTML = `<div class="text-center text-gray-500">Cargando lugares...</div>`;

  try {
    const res = await fetch('/lugar/obtenerLugares');
    const result = await res.json();
    if (!result.success) throw new Error(result.message || 'Error desconocido');
    const lugares = result.data;

    contenedor.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-blue-700">Lugares</h2>
        <button id="btnNuevoLugar" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Nuevo Lugar
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full border text-sm mb-6">
          <thead class="bg-blue-100">
            <tr>
              <th class="px-4 py-2">Título</th>
              <th class="px-4 py-2">Ciudad</th>
              <th class="px-4 py-2">Categoría</th>
              <th class="px-4 py-2">Propietario</th>
              <th class="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${lugares.map(l => `
              <tr>
                <td class="border px-4 py-2">${l.titulo}</td>
                <td class="border px-4 py-2">${l.ciudad}</td>
                <td class="border px-4 py-2">${l.categoria}</td>
                <td class="border px-4 py-2">${l.propietario || '—'}</td>
                <td class="border px-4 py-2">
                  <button class="bg-amber-500 px-2 py-1 rounded text-white" onclick="editarLugar('${l.id}')">Editar</button>
                  <button class="bg-red-600 px-2 py-1 rounded text-white ml-2" onclick="eliminarLugar('${l.id}')">Eliminar</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div id="formLugarAdmin"></div>
      </div>
    `;

    document.getElementById('btnNuevoLugar').onclick = mostrarFormularioNuevoLugar;
  } catch (err) {
    contenedor.innerHTML = `<div class="text-red-600 text-center">Error: ${err.message}</div>`;
  }
};

window.mostrarFormularioNuevoLugar = function() {
  const formHtml = `
    <form id="formAdminNuevoLugar" class="bg-white p-6 rounded-lg shadow space-y-4 max-w-md mx-auto mt-4">
      <h3 class="text-xl font-semibold text-blue-600">Nuevo Lugar</h3>
      <input type="text"    name="titulo"       placeholder="Título"       required class="w-full px-4 py-2 border rounded"/>
      <input type="text"    name="ciudad"       placeholder="Ciudad"       required class="w-full px-4 py-2 border rounded"/>
      <input type="text"    name="descripcion"  placeholder="Descripción"  required class="w-full px-4 py-2 border rounded"/>
      <input type="number"  name="capacidad"     placeholder="Capacidad"    required class="w-full px-4 py-2 border rounded"/>
      <input type="number"  name="tamano_m2"     placeholder="Tamaño (m²)"  required class="w-full px-4 py-2 border rounded"/>
      <input type="text"    name="categoria_id" placeholder="ID Categoría" required class="w-full px-4 py-2 border rounded"/>
      <input type="text"    name="usuario_id"   placeholder="ID Propietario" required class="w-full px-4 py-2 border rounded"/>
      <div class="flex justify-end">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar</button>
      </div>
    </form>
  `;
  document.getElementById('formLugarAdmin').innerHTML = formHtml;

  document.getElementById('formAdminNuevoLugar').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      titulo:      form.titulo.value,
      ciudad:      form.ciudad.value,
      descripcion: form.descripcion.value,
      capacidad:   +form.capacidad.value,
      tamano_m2:   +form.tamano_m2.value,
      categoria_id: form.categoria_id.value,
      propietario_id: form.usuario_id.value
    };
    const res = await fetch('/lugar', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      alert('Lugar creado');
      window.cargarModuloLugares();
    } else {
      alert(result.message);
    }
  };
};

window.eliminarLugar = async function(id) {
  if (!confirm("¿Seguro que deseas eliminar este lugar?")) return;
  const res = await fetch(`/lugar/${id}`, { method: 'DELETE' });
  const result = await res.json();
  if (result.success) {
    alert('Lugar eliminado');
    window.cargarModuloLugares();
  } else {
    alert(result.message);
  }
};

window.editarLugar = function (id) {
  alert('Función de edición aún no implementada (ejemplo).');
};
