using TPractico.Models;
using System.ComponentModel.DataAnnotations;

namespace TPractico.Models
{
    public class Carrera
    {
        [Key]
        public int CarreraID { get; set; }

        public int Duracion { get; set; }
        public string? Nombre { get; set; }
        // public virtual ICollection<Alumno>? Alumnos { get; set; }

        public bool Eliminado { get; set; }
    }

}

