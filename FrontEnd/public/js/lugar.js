function mostrarDatosLugares(data) {
  limpiarTabla("tblLugar");

  data.forEach((lugar) => {
    const fila = $("<tr>");
    fila.append(col(lugar.idlugar));
    fila.append(col(lugar.titulo));
    fila.append(col(lugar.descripcion));
    fila.append(col(lugar.ciudad));
    fila.append(col(`${lugar.precio} Bs`));
    fila.append(col(lugar.modalidad));
    $("#tblLugar tbody").append(fila);
  });
}

function cargarLugares() {
  const url = "/lugar/obtenerLugares";
  const tipo = "GET";
  const datos = {};
  const tipoDatos = "JSON";

  solicitudAjax(url, function (response) {
    if (response.Success) {
      toastr.success("Lugares cargados correctamente");
      mostrarDatosLugares(response.Data);
    } else {
      toastr.error(response.Mensaje);
    }
  }, datos, tipoDatos, tipo);
}

$(document).ready(function () {
  cargarLugares();
});
