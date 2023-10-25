window.onload = BuscarProfesores();

function BuscarProfesores() {
  $("#FiltroProfe").empty();

  $.ajax({
    url: "../../Profesores/BuscarProfesores",
    data: {},
    type: "GET",
    dataType: "json",

    success: function (profesores) {
      console.log("Profesores: " + JSON.stringify(profesores));
      let tr = "";
      $("#FiltroProfe").append(
        `<option selected value="">Selecciona un profesor</option>`
      );
      $.each(profesores, function (index, profesor) {
        if (profesor.eliminado != true) {
          tr = `
            <option value="${profesor.profesorID}">${profesor.nombreCompleto}</option>
            `;
          $("#FiltroProfe").append(`${tr}`);
        }
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

var profeID;

function BuscarTareas(profesorID) {
  profeID = profesorID;
  $("#tbody-tareas2").empty();

  $.ajax({
    url: "../../Tareas/BuscarTareas",
    data: { profesorID: profesorID },
    type: "GET",
    dataType: "json",

    success: function (resultado) {
      $("#tbody-tareas2").empty();
      $("#AsignaturaSelect").empty();
      $("#btn-Nuevo").prop("disabled", true);
      $.each(resultado.asignaturas, function (index, asignatura) {
        var op = `<option selected value="${asignatura.asignaturaID}">${asignatura.nombre}</option>;`;
        $("#AsignaturaSelect").append(op);
        $("#btn-Nuevo").prop("disabled", false);
      });

      console.log(resultado);
      let tr = "";
      $.each(resultado.tareas, function (index, tarea) {
        let partesFechaCarga = tarea.fechaCarga.split("T")[0].split("-");
        let fechaCarga = `${partesFechaCarga[2]}-${partesFechaCarga[1]}-${partesFechaCarga[0]}`;
        let partesFechaVenci = tarea.fechaVencimiento.split("T")[0].split("-");
        let fechaVencimiento = `${partesFechaVenci[2]}-${partesFechaVenci[1]}-${partesFechaVenci[0]}`;
        var nombreAsignatura = "";
        $.each(resultado.asignaturas, function (index, asignatura) {
          if (tarea.asignaturaID == asignatura.asignaturaID) {
            nombreAsignatura = asignatura.nombre;
          }
        });
        let deshabilitar, danger, letra;
        console.log(tarea);
        if (tarea.eliminada == false) {
          deshabilitar = `<button type="button" onclick="Deshabilitar(${tarea.tareaID})" class="btn btn-danger">Deshabilitar</button>`;
        } else {
          danger = "card-delete";
          letra = "grey-text";
          deshabilitar = `<button type="button" onclick="Deshabilitar(${tarea.tareaID})" class="btn btn-success">Habilitar</button>`;
        }
        tr = `
            
            
    <div class="row card-papel mx-1 ${danger}">
      <div class="col-md-9 col-12">
        <h3>${tarea.titulo}</h3>
        <div class="descripcion ${letra}">
        ${tarea.descripcion}
        </div>
      </div>
      <div class="col-md-3 col-12 mb-2">
        <span class="d-flex align-items-center">
          <h4>Asignatura:</h4>${nombreAsignatura}</span>
        <span class="d-flex align-items-center">
          <h4>De: </h4> ${tarea.profesorNombre}
        </span>
        <span class="d-flex align-items-center">
          <h4>Carga: </h4> ${fechaCarga}
        </span>
        <span class="d-flex align-items-center">
          <h4>Vence: </h4> ${fechaVencimiento}
        </span>
        <button type="button" onclick="BuscarTarea(${tarea.tareaID})" class="btn btn-warning">Editar</button>
              ${deshabilitar}
      </div>
    </div>
 
            `;

        var existe = resultado.asignaturas.some(
          (item) => item.asignaturaID === tarea.asignaturaID
        );
        if (existe) {
          $("#tbody-tareas2").append(`${tr}`);
        }
      });
    },

    error: function (xhr, status) {
      alert("Error al cargar tareas");
    },

    complete: function (xhr, status) {
      console.log("Petición realizada");
    },
  });
}
// let partesFecha = tarea.fechaNac.split("T")[0].split("-");
// let fechaFormateada = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;
function VaciarFormulario() {
  const fechaHoy = new Date().toISOString().slice(0, 10);

  $("#Titulo").val("");
  $("#Descripcion").val("");
  $("#FechaCarga").val(fechaHoy);
  $("#FechaVencimiento").val(fechaHoy);
  document.getElementById("tituloModal").innerHTML = "Agregar Tarea";
  $("#Modal").modal("show");
}

function GuardarTarea() {
  //JAVASCRIPT
  let titulo = $("#Titulo").val();
  let descripcion = $("#Descripcion").val();
  let fechaCarga = $("#FechaCarga").val();
  let fechaVencimiento = $("#FechaVencimiento").val();
  let tareaID = $("#TareaID").val();
  let asignaturaID = $("#AsignaturaSelect").val();
  $.ajax({
    url: "../../Tareas/GuardarTarea",
    data: {
      titulo: titulo,
      descripcion: descripcion,
      fechaCarga: fechaCarga,
      fechaVencimiento: fechaVencimiento,
      asignaturaID: asignaturaID,
      tareaID: tareaID,
      profesorID: profeID,
    },
    type: "POST",
    dataType: "json",
    success: function (resultado) {
      console.log(resultado);

      if (resultado == "Crear") {
        $("#Modal").modal("hide");
        BuscarTareas(profeID);
      }
      if (resultado == "Faltas") {
        $("#alerta").html("Completa todos los campos");
      }
      if (resultado == "Repetir") {
        $("#alerta").html("Decripcion Repetida");
      }
    },
    error: function (xhr, status) {
      alert("Disculpe, existió un problema");
    },
  });
}

function BuscarTarea(tareaID) {
  $("#alerta").html("");
  $.ajax({
    url: "../../Tareas/BuscarTareas",
    data: { tareaID: tareaID },
    type: "GET",
    dataType: "json",
    success: function (tareas) {
      if (tareas.length == 1) {
        let tarea = tareas[0];
        console.log("buscado: " + tarea.tareaID);
        let partesFecha = tarea.fechaCarga.split("T")[0].split("-");
        let fechaFormateada = `${partesFecha[0]}-${partesFecha[1]}-${partesFecha[2]}`;
        let partesFechaV = tarea.fechaCarga.split("T")[0].split("-");
        let fechaFormateadaV = `${partesFechaV[0]}-${partesFechaV[1]}-${partesFechaV[2]}`;
        console.log(fechaFormateada);
        $("#Titulo").val(tarea.descripcion);
        $("#Descripcion").val(tarea.descripcion);
        $("#FechaCarga").val(fechaFormateada);
        $("#FechaVencimiento").val(fechaFormateadaV);
        $("#TareaID").val(tarea.tareaID);
        $("#AsignaturaSelect").val(tarea.asignaturaID);
        document.getElementById("tituloModal").innerHTML = "Editar Tarea";
        $("#Modal").modal("show");
      }
    },

    error: function (xhr, status) {
      alert("Error al cargar servicios");
      document.getElementById("alerta").innerHTML = "Error al cargar alumno";
    },

    complete: function (xhr, status) {},
  });
}

function Deshabilitar(tareaID) {
  $.ajax({
    url: "../../Tareas/Deshabilitar",
    data: { tareaID: tareaID },
    type: "GET",
    dataType: "json",

    success: function (resultado) {
      console.log(resultado);

      BuscarTareas(profeID);
    },

    error: function (xhr, status) {
      alert("Error");
    },
  });
}
