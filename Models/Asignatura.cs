using TPractico.Models;
using System.ComponentModel.DataAnnotations;

namespace TPractico.Models
{
    public class Asignatura
    {
        [Key]
        public int AsignaturaID { get; set; }
        public string? Nombre { get; set; }
        public int CarreraID { get; set; }
        public bool Eliminado { get; set; }
    }

}

public class VistaAsignatura
{
    public int AsignaturaID { get; set; }
    public string? Nombre { get; set; }

    public string? NombreProfesor { get; set; }
    public string? CarreraNombre { get; set; }
    public int CarreraID { get; set; }
    public bool CarreraEliminada { get; set; }

    public bool Eliminado { get; set; }
    public int Valido { get; set; }
}

