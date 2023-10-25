window.onload = function () {
  BuscarAlumnos();
  GraficoAlumnoEdades();
};

// window.onload = BuscarAlumnos();

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
        let deshabilitar = "",
          editar;
        let danger = "text-danger";

        if (alumno.carrera.eliminado == false) {
          if (alumno.eliminado == false) {
            danger = "";
            deshabilitar = `<button type="button" onclick="Deshabilitar(${alumno.alumnoID})" class="btn btn-danger">Deshabilitar</button>`;
          } else {
            deshabilitar = `<button type="button" onclick="Deshabilitar(${alumno.alumnoID})" class="btn btn-success">Habilitar</button>`;
          }
          editar = `<button type="button" onclick="BuscarAlumno(${alumno.alumnoID})" class="btn btn-primary">Editar</button>`;
        } else {
          editar = `<p>Carrera Eliminada</p>`;
        }
        tr = `
            <tr class="${danger}">
                <td>${alumno.nombreCompleto} </td>
                <td>${alumno.direccion} </td>
                <td>${fechaFormateada}</td>
                <td>${alumno.dni} </td>
                <td>${alumno.email} </td>
                <td>${alumno.carrera.nombre}</td>
                <td class="text-end">
                  ${deshabilitar}
                  ${editar}
                </td>
            </tr>
            `;
        let trImprimir = `
            <tr class="${danger}">
                <td>${alumno.nombreCompleto} </td>
                <td>${alumno.direccion} </td>
                <td>${fechaFormateada}</td>
                <td>${alumno.dni} </td>
                <td>${alumno.email} </td>
                <td>${alumno.carrera.nombre}</td>
            </tr>
            `;

        $("#tbody-alumnos").append(`${tr}`);
        $("#tbody-alumnos-imprimir").append(`${trImprimir}`);
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

function GraficoAlumnoEdades() {
  console.log("Alumno");
  $.ajax({
    url: "../../Alumnos/GraficoAlumnoEdades",
    data: {},
    type: "GET",
    dataType: "json",

    success: function (resultado) {
      console.log();
      const ctx = document.getElementById("AlumnosEdades");

      function generateRandomColor() {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      // var labels = resultado.labels;
      var data = resultado.data;
      console.log(data);
      var labels = [
        "Menor de 20",
        "21 a 25",
        "26 a 30",
        "30 a 35",
        "Mayor de 35",
      ];
      console.log(labels);
      var backgroundColors = labels.map(function () {
        return generateRandomColor();
      });

      new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "# de Estudiantes",
              data: data,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.2,
            },
          ],
        },
        options: {
          // scales: {
          //   2:0
          // },
          elements: {
            line: {
              tension: 0.3,
              // fill: true,
              borderWidth: 6,
              backgroundColor: "#666",
            },
          },
        },
      });
    },

    error: function (xhr, status) {
      alert("Error al cargar alumnos");
    },
  });
}

var escondido = true;
$("#AlumnosEdades").css({
  opacity: 0,
  "z-index": -1,
});

function esconder() {
  if (escondido == true) {
    escondido = false;
    $("#AlumnosEdades").css({
      opacity: 1,
      "z-index": 1,
    });
    $("#tabla-alumnos").css({
      opacity: 0,
      "z-index": -1,
    });
  } else {
    escondido = true;
    $("#AlumnosEdades").css({
      opacity: 0,
      "z-index": -1,
    });
    $("#AlumnosEdades").show();
    $("#tabla-alumnos").css({
      opacity: 1,
      "z-index": 1,
    });
  }
}

function Imprimir() {
  var doc = new jsPDF();
  //var doc = new jsPDF('l', 'mm', [297, 210]);

  var totalPagesExp = "{total_pages_count_string}";
  var pageContent = function (data) {
    var pageHeight =
      doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth =
      doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    // FOOTER
    var str = "Pagina " + data.pageCount;
    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages == "function") {
      str = str + " de " + totalPagesExp;
    }

    doc.setLineWidth(8);
    doc.setDrawColor(238, 238, 238);
    doc.line(14, pageHeight - 11, 196, pageHeight - 11);

    doc.setFontSize(10);

    doc.setFontStyle("bold");

    doc.text(str, 17, pageHeight - 10);
  };

  var table = doc.autoTableHtmlToJson(
    document.getElementById("tabla-imprimir")
  );

  doc.text('Estudiantes', 15, 10);

  doc.autoTable({
    head: [table.columns],
    body: table.data,
    didDrawPage: function (data) {
      // Agrega tu función de pie de página aquí
    },
    headStyles: {
      fillColor: [255, 231, 124], // Amarillo
      textColor: [0, 0, 0] // Texto en negro
    },
    styles: {
      fillColor: [240, 240, 240], // Gris claro
      textColor: [0, 0, 0], // Texto en negro
      valign: 'middle'
    }
  });

  // ESTO SE LLAMA ANTES DE ABRIR EL PDF PARA QUE MUESTRE EN EL PDF EL NRO TOTAL DE PAGINAS. ACA CALCULA EL TOTAL DE PAGINAS.
  if (typeof doc.putTotalPages === "function") {
    doc.putTotalPages(totalPagesExp);
  }

  //doc.save('InformeSistema.pdf')

  var string = doc.output("datauristring");
  var iframe =
    "<iframe width='100%' height='100%' src='" + string + "'></iframe>";

  var x = window.open();
  if (x) {
    x.document.open();
    // Resto del código...
  } else {
    console.log("La ventana no se pudo abrir");
  }
  x.document.open();
  x.document.write(iframe);
  x.document.close();
}
