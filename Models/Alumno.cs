using TPractico.Models;
using System.ComponentModel.DataAnnotations;

namespace TPractico.Models
{
    public class Alumno
    {
        [Key]
        public int AlumnoID { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime Fecha { get; set; }
        public string? NombreCompleto { get; set; }
        public string? Direccion { get; set; }
        public string? Email { get; set; }
        public int DNI { get; set; }
        public int CarreraID { get; set; }
        public virtual Carrera? Carrera { get; set; }
        public bool Eliminado { get; set; }

    }

}

