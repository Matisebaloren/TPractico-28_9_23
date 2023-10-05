window.onload = BuscarAlumnos();

function BuscarAlumnos() {
  VaciarFormulario();
  $("#tbody-alumnos").empty();

  $.ajax({
    url: "../../Alumnos/BuscarAlumnos",
    data: {},
    type: "GET",
    dataType: "json",

    success: function (alumnos) {
      $("#tbody-alumnos").empty();
      let tr = "";
      console.log(alumnos);
      $.each(alumnos, function (index, alumno) {
        let partesFecha = alumno.fecha.split("T")[0].split("-");
        let fechaFormateada = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;
        let deshabilitar = "", editar;
        let danger = "text-danger";
        
        if(alumno.carrera.eliminado == false){
          if (alumno.eliminado == false) {
            danger = "";
            deshabilitar = `<button type="button" onclick="Deshabilitar(${alumno.alumnoID})" class="btn btn-danger">Deshabilitar</button>`;
          } else {
            deshabilitar = `<button type="button" onclick="Deshabilitar(${alumno.alumnoID})" class="btn btn-success">Habilitar</button>`;
          }
          editar = `<button type="button" onclick="BuscarAlumno(${alumno.alumnoID})" class="btn btn-primary">Editar</button>`;
        }
        else{
          editar = `<p>Carrera Eliminada</p>`
        }
        tr = `
            <tr class="${danger}">
                <td>${alumno.nombreCompleto} </td>
                <td>${alumno.direccion} </td>
                <td>${fechaFormateada}</td>
                <td>${alumno.dni} </td>
                <td>${alumno.email} </td>
                <td>${alumno.carrera.nombre}</td>
                <td>
                ${editar}
                  ${deshabilitar}
                </td>
            </tr>
            `;
        $("#tbody-alumnos").append(`${tr}`);
      });
    },

    error: function (xhr, status) {
      alert("Error al cargar alumnos");
    },

    complete: function (xhr, status) {
      console.log("Petición realizada");
    },
  });
}

function VaciarFormulario() {
  const fechaHoy = new Date().toISOString().slice(0, 10);
  $("#NombreCompleto").val("");
  $("#AlumnoID").val(0);
  $("#Fecha").val(fechaHoy);
  $("#Direccion").val("");
  $("#DNI").val("");
  $("#Email").val("");
  $("#CarreraID").val($("#CarreraID option:first").val());
  document.getElementById("tituloModal").innerHTML = "Agregar Alumno";
}

function editar(id) {
  console.log("gasd");
}

function BuscarAlumno(alumnoID) {
  $.ajax({
    // la URL para la petición
    url: "../../Alumnos/BuscarAlumnos",
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data: { alumnoID: alumnoID },
    // especifica si será una petición POST o GET
    type: "GET",
    // el tipo de información que se espera de respuesta
    dataType: "json",
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success: function (alumnos) {
      console.log(alumnos);
      if (alumnos.length == 1) {
        let alumno = alumnos[0];
        let fechaFormateada = alumno.fecha.split("T")[0];
        $("#NombreCompleto").val(alumno.nombreCompleto);
        $("#AlumnoID").val(alumno.alumnoID);
        $("#Fecha").val(fechaFormateada);
        $("#CarreraID").val(alumno.carreraID);
        $("#Direccion").val(alumno.direccion);
        $("#DNI").val(alumno.dni);
        $("#Email").val(alumno.email);
        console.log(alumno.fecha);
        document.getElementById("tituloModal").innerHTML = "Editar Alumno";
        $("#ModalCategoria").modal("show");
      }
    },
    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error: function (xhr, status) {
      alert("Error al cargar servicios");
      document.getElementById("alerta").innerHTML = "Error al cargar alumno";
    },
    // código a ejecutar sin importar si la petición falló o no
    complete: function (xhr, status) {
      //alert('Petición realizada');
    },
  });
}

function GuardarAlumno() {
  let nombreCompleto = $("#NombreCompleto").val();
  let carreraID = $("#CarreraID").val();
  let alumnoID = $("#AlumnoID").val();
  let direccion = $("#Direccion").val();
  let dni = $("#DNI").val();
  let email = $("#Email").val();
  let fecha = $("#Fecha").val();

  $.ajax({
    url: "../../Alumnos/GuardarAlumno",
    data: {
      alumnoID: alumnoID,
      nombreCompleto: nombreCompleto,
      carreraID: carreraID,
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
        BuscarAlumnos();
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

function Deshabilitar(alumnoID) {
  $.ajax({
    url: "../../Alumnos/Deshabilitar",
    data: { alumnoID: alumnoID },
    type: "GET",
    dataType: "json",

    success: function (resultado) {
      console.log(resultado);

      BuscarAlumnos();
    },

    error: function (xhr, status) {
      alert("Error al cargar alumnos");
    },
  });
}
