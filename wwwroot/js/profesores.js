window.onload = BuscarProfesores();

function BuscarProfesores() {
  $("#tbody-profesores").empty();

  $.ajax({
    url: "../../Profesores/BuscarProfesores",
    data: {},
    type: "GET",
    dataType: "json",

    success: function (profesores) {
      $("#tbody-profesores").empty();
      let tr = "";
      $.each(profesores, function (index, profesor) {
        let partesFecha = profesor.fechaNac.split("T")[0].split("-");
        let fechaFormateada = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;
        let deshabilitar;
        let danger = "text-danger";
        if (profesor.eliminado == false) {
          danger = "";
          deshabilitar = `<button type="button" onclick="Deshabilitar(${profesor.profesorID})" class="btn btn-danger">Deshabilitar</button>`;
        } else {
          deshabilitar = `<button type="button" onclick="Deshabilitar(${profesor.profesorID})" class="btn btn-success">Habilitar</button>`;
        }
        tr = `
            <tr class="a ${danger}" >
                <td class="profesor" onclick="BuscarAsignaturas(${profesor.profesorID})"> ${profesor.nombreCompleto} </td>
                <td class="" >${profesor.dni} </td>
                <td class="justify-content-end" >${fechaFormateada}</td>
                <td class="" >${profesor.direccion} </td>
                <td class="" >${profesor.email} </td>
                
                <td class="" >
                  <button type="button" onclick="BuscarProfesor(${profesor.profesorID})" class="btn btn-primary">Editar</button>
                  ${deshabilitar}
                </td>
            </tr>
            `;
        $("#tbody-profesores").append(`${tr}`);
      });
    },

    error: function (xhr, status) {
      alert("Error al cargar profesores");
    },

    complete: function (xhr, status) {
      console.log("Petición realizada");
    },
  });
}

function VaciarFormulario() {
  const fechaHoy = new Date().toISOString().slice(0, 10);
  $("#NombreCompleto").val("");
  $("#FechaNac").val(fechaHoy);
  $("#DNI").val("");
  $("#direccion").val("");
  $("#email").val("");
  $("#ProfesorID").val("");
  document.getElementById("tituloModal").innerHTML = "Agregar Profesor";
}

function GuardarProfesor() {
  //JAVASCRIPT
  let nombreCompleto = $("#NombreCompleto").val();
  let fecha = $("#FechaNac").val();
  let dni = $("#DNI").val();
  let direccion = $("#direccion").val();
  let email = $("#email").val();
  let profesorID = $("#ProfesorID").val();
  console.log(nombreCompleto + " " + dni);
  $.ajax({
    url: "../../Profesores/GuardarProfesor",
    data: {
      profesorID: profesorID,
      nombreCompleto: nombreCompleto,
      fecha: fecha,
      direccion: direccion,
      email: email,
      dni: dni,
    },
    type: "POST",
    dataType: "json",
    success: function (resultado) {
      console.log(resultado);

      if (resultado == "Crear") {
        $("#ModalCategoria").modal("hide");
        BuscarProfesores();
      }
      if (resultado == "Repetir") {
        alert("No repita dni");
      }
    },
    error: function (xhr, status) {
      alert("Disculpe, existió un problema");
    },
  });
}

function BuscarProfesor(profesorID) {
  $.ajax({
    url: "../../Profesores/BuscarProfesores",
    data: { profesorID: profesorID },
    type: "GET",
    dataType: "json",
    success: function (profesores) {
      if (profesores.length == 1) {
        let profesor = profesores[0];
        let fechaFormateada = profesor.fechaNac.split("T")[0];
        $("#NombreCompleto").val(profesor.nombreCompleto);
        $("#FechaNac").val(fechaFormateada);
        $("#DNI").val(profesor.dni);
        $("#direccion").val(profesor.direccion);
        $("#email").val(profesor.email);
        $("#ProfesorID").val(profesor.profesorID);
        document.getElementById("tituloModal").innerHTML = "Editar Profesor";
        $("#ModalCategoria").modal("show");
      }
    },

    error: function (xhr, status) {
      alert("Error al cargar servicios");
      document.getElementById("alerta").innerHTML = "Error al cargar alumno";
    },

    complete: function (xhr, status) {},
  });
}
var ListaAsignaturas;
var profesorSelect = 0;
function BuscarAsignaturas(profesorID) {
  profesorSelect = profesorID;
  console.log("BuscarAsignaturas");
  $.ajax({
    url: "../../Profesores/BuscarAsignaturas",
    data: { profesorID: profesorID },
    type: "GET",
    dataType: "json",
    success: function (asignaturas) {
      ListaAsignaturas = asignaturas;
      $("#modalBodyAsignaturas").empty();
      let tr = "";

      $.each(asignaturas, function (index, asignatura) {
        console.log(asignaturas);
        ulID = asignatura.carreraID;
        if ($("#" + ulID).length == 0) {
          console.log("El elemento no existe.");
          $("#modalBodyAsignaturas").append(
            `<ul id="${ulID}"><h4>${asignatura.carreraNombre}</h4></ul>`
          );
        }
        var check;
        if (asignatura.valido == 1) {
          check = `<input type="checkbox" onchange="AsignaturaChange(${asignatura.asignaturaID}, this.checked)"></input>`;
        } 
        else if(asignatura.valido == 2){
          check = `<input type="checkbox" checked onchange="AsignaturaChange(${asignatura.asignaturaID}, this.checked)"></input>`;
        }
        else {
          check = `<i class="bi bi-person-fill-lock"></i>`;
        }
        tr = `
       
            <li>
            ${check} ${asignatura.nombre}
            </li>
            `;
        console.log(tr);

        $("#modalBodyAsignaturas #" + ulID).append(tr);
        $("#ModalAsignatura").modal("show");
      });
    },

    error: function (xhr, status) {
      alert("Error al cargar servicios");
      document.getElementById("alerta").innerHTML =
        "Error al cargar asignaturas";
    },
    complete: function (xhr, status) {},
  });
}

function AsignaturaChange(asignaturaID, check) {
  console.log(check);
  $.ajax({
    url: "../../Profesores/AsignarAsignatura",
    data: {
      profesorID: profesorSelect,
      asignaturaID: asignaturaID,
      check: check,
    },
    type: "POST",
    dataType: "json",
    success: function (resultado) {
      console.log(resultado);

      if (resultado == "Crear") {
        $("#ModalCategoria").modal("hide");
        BuscarProfesores();
      }
      if (resultado == "Repetir") {
        alert("No repita dni");
      }
    },
    error: function (xhr, status) {
      alert("Disculpe, existió un problema");
    },
  });
}

function Deshabilitar(profesorID) {
  $.ajax({
    url: "../../Profesores/Deshabilitar",
    data: { profesorID: profesorID },
    type: "GET",
    dataType: "json",

    success: function (resultado) {
      console.log(resultado);

      BuscarProfesores();
    },

    error: function (xhr, status) {
      alert("Error al cargar profesores");
    },
  });
}
