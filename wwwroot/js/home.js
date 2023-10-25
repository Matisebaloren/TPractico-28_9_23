
var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
var type = connection.effectiveType;

// Definir los tipos de conexión que consideras "buenos"
var conexionesBuenas = ["4g", "wifi"];

// Si la conexión es buena, activa el video
if (conexionesBuenas.includes(type)) {
  console.log("consexion nice");
  var miVideo = document.getElementById("miVideo");

  miVideo.addEventListener("timeupdate", function () {
    var tiempoRestante = miVideo.duration - miVideo.currentTime;
    var umbral = 1; // 3 segundos antes de que se termine desaparece.
    if (tiempoRestante <= umbral) {
      miVideo.style.opacity = "0";
    }
  });

  miVideo.addEventListener("canplaythrough", function () {
    console.log("El video se ha cargado completamente.");
    // Hacer el video visible con una transición
    miVideo.style.opacity = "1";
    // Reproducir el video
    miVideo.play();
  });

  miVideo.addEventListener("ended", function () {
    // Cuando el video llega al final, restaura la opacidad a 1
    miVideo.style.opacity = "1";
  });
}
