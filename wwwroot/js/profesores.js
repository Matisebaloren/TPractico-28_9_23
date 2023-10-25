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
                <td  class="text-end">
                  ${deshabilitar}
                  <button type="button" onclick="BuscarProfesor(${profesor.profesorID})" class="btn btn-primary">Editar</button>
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
          // check = `<input type="checkbox" onchange="AsignaturaChange(${asignatura.asignaturaID}, this.checked)"></input>`;
          check =`<div>
            <input class="styled-checkbox" onchange="AsignaturaChange(${asignatura.asignaturaID}, this.checked)" id="styled-checkbox-${index}" type="checkbox" value="">
            <label for="styled-checkbox-${index}">Checkbox</label>
          </div>`
        } 
        else if(asignatura.valido == 2){
          // check = `<input type="checkbox" checked onchange="AsignaturaChange(${asignatura.asignaturaID}, this.checked)"></input>`;
          check =`
            <input checked class="styled-checkbox" onchange="AsignaturaChange(${asignatura.asignaturaID}, this.checked)" id="styled-checkbox-${index}" type="checkbox" value="">
            <label for="styled-checkbox-${index}">${asignatura.nombre}</label>
          `
        }
        else {
          check = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-lock" viewBox="0 0 16 16">
          <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 5.996V14H3s-1 0-1-1 1-4 6-4c.564 0 1.077.038 1.544.107a4.524 4.524 0 0 0-.803.918A10.46 10.46 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h5ZM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2Zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1Z"/>
        </svg>
        ${asignatura.nombre}`;
        }
        tr = `
            <li>
            ${check}
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
