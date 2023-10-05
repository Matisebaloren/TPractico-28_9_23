using TPractico.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace TPractico.Models
{
    public class Tarea
    {
        [Key]
        public int TareaID { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime FechaCarga { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime FechaVencimiento { get; set; }
        public string? Titulo { get; set; }
        public string? Descripcion { get; set; }
        public int AsignaturaID { get; set; }
        public bool Eliminada { get; set; }
        public int ProfesorID { get; set; }
    }
}

public class VistaTarea
    {
        public int TareaID { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime FechaCarga { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime FechaVencimiento { get; set; }
        public string? Titulo { get; set; }
        public string? Descripcion { get; set; }
        public int AsignaturaID { get; set; }
        public bool Eliminada { get; set; }
        public int ProfesorID { get; set; }
        public string? ProfesorNombre { get; set; }
    }