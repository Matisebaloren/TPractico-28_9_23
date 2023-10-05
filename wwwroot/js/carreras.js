window.onload = BuscarCarreras();

function BuscarCarreras() {
  $("#tbody-carreras").empty();
  VaciarFormulario();
  $.ajax({
    url: "../../Carreras/BuscarCarreras",
    data: {},
    type: "GET",
    dataType: "json",

    success: function (carreras) {
      $("#tbody-carreras").empty();
      let tr = "";
      $.each(carreras, function (index, carrera) {
        let deshabilitar;
        let danger="text-danger";
        if (carrera.eliminado == false) {
          danger="";
          deshabilitar = `<button type="button" onclick="Deshabilitar(${carrera.carreraID})" class="btn btn-danger">Deshabilitar</button>`;
        } else {
          deshabilitar = `<button type="button" onclick="Deshabilitar(${carrera.carreraID})" class="btn btn-success">Habilitar</button>`;
        }
        tr = `
            <tr class="${danger}">
                <td class="" >${carrera.nombre} </td>
                <td class="justify-content-end" >${carrera.duracion} años</td>
                <td class="" >
                  <button type="button" onclick="BuscarAlumno(${carrera.carreraID})" class="btn btn-primary">Editar</button>
                  ${deshabilitar}
                </td>
            </tr>
            `;
        $("#tbody-carreras").append(`${tr}`);
      });
    },

    error: function (xhr, status) {
      alert("Error al cargar carreras");
    },

    complete: function (xhr, status) {
      console.log("Petición realizada");
    },
  });
}

function VaciarFormulario() {
  $("#Nombre").val("");
  $("#CarreraID").val("");
  $("#Duracion").val(0);
  document.getElementById("tituloModal").innerHTML = "Agregar Carrera";
}

function GuardarCarrera() {
  //JAVASCRIPT
  let nombre = $("#Nombre").val();
  let duracion = $("#Duracion").val();
  let carreraID = $("#CarreraID").val();
  console.log(nombre + " " + duracion);
  $.ajax({
    url: "../../Carreras/GuardarCarrera",
    data: { carreraID: carreraID, nombre: nombre, duracion: duracion },
    type: "POST",
    dataType: "json",
    success: function (resultado) {
      console.log(resultado);

      if (resultado == "Crear") {
        $("#ModalCategoria").modal("hide");
        BuscarCarreras();
      }
      if (resultado == "Repetir") {
        alert("No repita nombre");
      }
    },
    error: function (xhr, status) {
      alert("Disculpe, existió un problema");
    },
  });
}

function BuscarAlumno(carreraID) {
  $.ajax({
    url: "../../Carreras/BuscarCarreras",
    data: { carreraID: carreraID },
    type: "GET",
    dataType: "json",
    success: function (carreras) {
      if (carreras.length == 1) {
        let carrera = carreras[0];
        $("#Nombre").val(carrera.nombre);
        $("#CarreraID").val(carrera.carreraID);
        $("#Duracion").val(carrera.duracion);
        document.getElementById("tituloModal").innerHTML = "Editar Carrera";
        $("#ModalCategoria").modal("show");
      }
    },

    error: function (xhr, status) {
      alert("Error al cargar servicios");
      document.getElementById("alerta").innerHTML = "Error al cargar alumno";
    },

    complete: function (xhr, status) {
    },
  });
}

function Deshabilitar(carreraID) {
  $.ajax({
    url: "../../Carreras/Deshabilitar",
    data: { carreraID: carreraID },
    type: "GET",
    dataType: "json",

    success: function (resultado) {
      console.log(resultado);

      BuscarCarreras();
    },

    error: function (xhr, status) {
      alert("Error al cargar carreras");
    },
  });
}
