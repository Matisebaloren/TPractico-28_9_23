window.onload = function () {
  GraficoCarreraAlumno();
};

function GraficoCarreraAlumno() {
  $.ajax({
    url: "../../Carreras/GraficoCarreraAlumno",
    data: {},
    type: "GET",
    dataType: "json",

    success: function (resultado) {
      const ctx = document.getElementById("CarreraAlumnos");

      function generateRandomColor() {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      var labels = resultado.labels;
      
      var data = resultado.data;
      var backgroundColors = labels.map(function () {
        return generateRandomColor();
      });

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "# de Estudiantes",
              data: data,
              borderWidth: 1,
              backgroundColor: backgroundColors,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },

    error: function (xhr, status) {
      alert("Error al cargar carreras");
    },
  });
}



var escondido = true;
$("#CarreraAlumnos").css({
  opacity: 0,
  "z-index": -1,
});

function esconder() {
  if (escondido == true) {
    escondido = false;
    $("#CarreraAlumnos").css({
      opacity: 1,
      "z-index": 1,
    });
    $("#tabla-carreras").css({
      opacity: 0,
      "z-index": -1,
    });
  } else {
    escondido = true;
    $("#CarreraAlumnos").css({
      opacity: 0,
      "z-index": -1,
    });
    $("#tabla-carreras").css({
      opacity: 1,
      "z-index": 1,
    });
  }
}