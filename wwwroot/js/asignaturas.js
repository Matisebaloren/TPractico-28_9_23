window.onload = BuscarAsignaturas();

function BuscarAsignaturas() {
  VaciarFormulario();
  $("#tbody-asignaturas").empty();

  $.ajax({
    url: "../../Asignaturas/BuscarAsignaturas",
    data: {},
    type: "GET",
    dataType: "json",

    success: function (asignaturas) {
      $("#tbody-asignaturas").empty();
      let tr = "";
      console.log(asignaturas);
      $.each(asignaturas, function (index, asignatura) {
        let deshabilitar = "", editar ="";
        let danger = "text-danger";

        if (asignatura.carreraEliminada != true) {
          if (asignatura.eliminado == false) {
            danger = "";
            deshabilitar = `<button type="button" onclick="Deshabilitar(${asignatura.asignaturaID})" class="btn btn-danger">Deshabilitar</button>`;
          } else {
            deshabilitar = `<button type="button" onclick="Deshabilitar(${asignatura.asignaturaID})" class="btn btn-success">Habilitar</button>`;
          }
          editar = `<button type="button" onclick="BuscarAsignatura(${asignatura.asignaturaID})" class="btn btn-primary">Editar</button>`
        }
        else{
          editar = "<p>Carrera Eliminada</p>"
        }

        tr = `
            <tr class="${danger}">
                <td>${asignatura.nombre} </td>
                <td>${asignatura.carreraNombre}</td>
                <td>${asignatura.nombreProfesor}</td>
                <td class="text-end">
                ${deshabilitar}
                ${editar}
                  
                </td>
            </tr>
            `;
        $("#tbody-asignaturas").append(`${tr}`);
      });
    },

    error: function (xhr, status) {
      alert("Error al cargar asignaturas");
    },

    complete: function (xhr, status) {
      console.log("Petición realizada");
    },
  });
}

function VaciarFormulario() {
  $("#Nombre").val("");
  $("#AsignaturaID").val(0);
  $("#CarreraID").val(0);
  document.getElementById("tituloModal").innerHTML = "Agregar Asignatura";
}

function editar(id) {
  console.log("gasd");
}

function BuscarAsignatura(asignaturaID) {
  $.ajax({
    // la URL para la petición
    url: "../../Asignaturas/BuscarAsignaturas",
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data: { asignaturaID: asignaturaID },
    // especifica si será una petición POST o GET
    type: "GET",
    // el tipo de información que se espera de respuesta
    dataType: "json",
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success: function (asignaturas) {
      if (asignaturas.length == 1) {
        asignatura = asignaturas[0];
        console.log(asignatura);
        $("#Nombre").val(asignatura.nombre);
        $("#AsignaturaID").val(asignatura.asignaturaID);
        $("#CarreraID").val(asignatura.carreraID);
        document.getElementById("tituloModal").innerHTML = "Editar Asignatura";
        $("#Modal").modal("show");
      }
    },

    error: function (xhr, status) {
      alert("Error al cargar servicios");
      document.getElementById("alerta").innerHTML =
        "Error al cargar asignatura";
    },
    // código a ejecutar sin importar si la petición falló o no
    complete: function (xhr, status) {
      //alert('Petición realizada');
    },
  });
}

function GuardarAsignatura() {
  //JAVASCRIPT
  let nombre = $("#Nombre").val();
  let carreraID = $("#CarreraID").val();
  let asignaturaID = $("#AsignaturaID").val();

  $.ajax({
    url: "../../Asignaturas/GuardarAsignatura",
    data: {
      asignaturaID: asignaturaID,
      nombre: nombre,
      carreraID: carreraID,
    },
    type: "POST",
    dataType: "json",
    success: function (resultado) {
      console.log(resultado);

      if (resultado == "Crear") {
        $("#Modal").modal("hide");
        BuscarAsignaturas();
      }
      if (resultado == "Repetir") {
        alert("instancia ya existente");
      }
    },
    error: function (xhr, status) {
      alert("Disculpe, existió un problema");
    },
  });
}

function Deshabilitar(asignaturaID) {
  $.ajax({
    url: "../../Asignaturas/Deshabilitar",
    data: { asignaturaID: asignaturaID },
    type: "GET",
    dataType: "json",

    success: function (resultado) {
      console.log(resultado);

      BuscarAsignaturas();
    },

    error: function (xhr, status) {
      alert("Error al cargar asignaturas");
    },
  });
}
