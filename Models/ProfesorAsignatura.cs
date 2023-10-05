using TPractico.Models;
using System.ComponentModel.DataAnnotations;

namespace TPractico.Models
{
    public class ProfesorAsignatura
    {
        [Key]
        public int ProfesorAsignaturaID { get; set; }
        public int ProfesorID { get; set; }
        public int AsignaturaID { get; set; }

        public bool Eliminado { get; set; }
    }

}

