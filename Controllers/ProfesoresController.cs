using System.Diagnostics;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TPractico.Data;
using TPractico.Models;

namespace TPractico.Controllers;
[Authorize]


public class ProfesoresController : Controller
{
    private readonly ILogger<ProfesoresController> _logger;
    private ApplicationDbContext _contexto;

    public ProfesoresController(ILogger<ProfesoresController> logger, ApplicationDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    public IActionResult Index()
    {
        return View();
    }

    public JsonResult BuscarProfesores(int profesorID = 0)
    {
        var profesores = _contexto.Profesores.OrderBy(p => p.NombreCompleto).ToList();

        if (profesorID > 0)
        {
            profesores = profesores.Where(p => p.ProfesorID == profesorID).OrderBy(p => p.NombreCompleto).ToList();
        }
        _contexto.SaveChanges();
        return Json(profesores);
    }

    public JsonResult GuardarProfesor(int profesorID, string nombreCompleto, string direccion, string email, string fecha, int dni = 0)
    {
        string resultado = "Error";
        if (!string.IsNullOrEmpty(nombreCompleto) && dni != 0 && !string.IsNullOrEmpty(direccion) && !string.IsNullOrEmpty(email))
        {
            DateTime.TryParse(fecha, out DateTime fechaDate);
            if (profesorID == 0)
            {
                var profesorExistente = _contexto.Profesores.Where(c => c.DNI == dni).FirstOrDefault();
                if (profesorExistente == null)
                {
                    var ProfesorGuardar = new Profesor
                    {
                        NombreCompleto = nombreCompleto,
                        Direccion = direccion,
                        Email = email,
                        DNI = dni,
                        FechaNac = fechaDate
                    };
                    _contexto.Add(ProfesorGuardar);
                    _contexto.SaveChanges();
                    resultado = "Crear";
                }
                else
                {
                    resultado = "Repetir";
                }
            }
            else
            {
                var profesorExistente = _contexto.Profesores.Where(c => c.DNI == dni && c.ProfesorID != profesorID).Count();
                if (profesorExistente == 0)
                {
                    var profesorEditar = _contexto.Profesores.Find(profesorID);
                    if (profesorEditar != null)
                    {
                        profesorEditar.NombreCompleto = nombreCompleto;
                        profesorEditar.Direccion = direccion;
                        profesorEditar.Email = email;
                        profesorEditar.DNI = dni;
                        profesorEditar.FechaNac = fechaDate;
                        _contexto.SaveChanges();
                        resultado = "Crear";
                    }
                }
                else
                {
                    resultado = "Repetir";
                }
            }
        }
        else
        {
            resultado = "faltas";
        }

        return Json(resultado);
    }

    public JsonResult Deshabilitar(int profesorID)
    {
        String resultado = "error";
        var profesor = _contexto.Profesores.Where(c => c.ProfesorID == profesorID).FirstOrDefault();
        if (profesor != null)
        {
            if (profesor.Eliminado == true)
            {
                profesor.Eliminado = false;
            }
            else
            {
                profesor.Eliminado = true;
            }
            resultado = "cambiar";

            _contexto.SaveChanges();
        }
        return Json(resultado);
    }

    public JsonResult AsignarAsignatura(int profesorID = 0, int asignaturaID = 0, bool check = false)
    {
        string resultado = "Error";
        if (profesorID != 0 && asignaturaID != 0)
        {
            var ocupada = _contexto.ProfesorAsignaturas.Where(pa => pa.ProfesorID != profesorID && pa.AsignaturaID == asignaturaID && pa.Eliminado == false).ToList();
            if (ocupada.Count == 0)
            {
                var existente = _contexto.ProfesorAsignaturas.Where(pa => pa.ProfesorID == profesorID && pa.AsignaturaID == asignaturaID).ToList();
                if (existente.Count == 0 && check != false)
                {
                    var nuevo = new ProfesorAsignatura
                    {
                        ProfesorID = profesorID,
                        AsignaturaID = asignaturaID,
                        Eliminado = false
                    };
                    _contexto.Add(nuevo);
                    _contexto.SaveChanges();
                    resultado = "crear";
                }
                else
                {
                    var existenteModificar = existente[0];
                    if (existenteModificar != null)
                    {
                        if (check != true)
                        {
                            existenteModificar.Eliminado = true;
                            resultado = "eliminar";
                        }
                        else
                        {
                            existenteModificar.Eliminado = false;
                            
                            resultado = "editar";
                        }
                        _contexto.SaveChanges();
                    }

                }
            }
            else{
                resultado = "ocupado";
            }
        }
        else
        {
            resultado = "faltas";
        }
        return Json(resultado);
    }

    public JsonResult BuscarAsignaturas(int profesorID = 0)
    {
        List<VistaAsignatura> AsignaturasMostrar = new List<VistaAsignatura>();
        var asignaturas = _contexto.Asignaturas.Where(a => a.Eliminado != true).OrderBy(t => t.Nombre).ToList();
        var ProfesorAsignaturas = _contexto.ProfesorAsignaturas.Where(pa => pa.Eliminado != true).ToList();
        var carreras = _contexto.Carreras.ToList();

        foreach (var asignatura in asignaturas)
        {
            var valido = 1;
            foreach (var ProfAsig in ProfesorAsignaturas)
            {
                // ProfAsig.ProfesorID != null && 
                if (ProfAsig.ProfesorID != profesorID && ProfAsig.AsignaturaID == asignatura.AsignaturaID)
                {
                    valido = 0;
                }
                else if(ProfAsig.ProfesorID == profesorID && ProfAsig.AsignaturaID == asignatura.AsignaturaID){
                    valido = 2;
                }
            }
            var carrera = carreras.Where(c => c.CarreraID == asignatura.CarreraID).FirstOrDefault();
            var AsignaturaMostrar = new VistaAsignatura
            {
                AsignaturaID = asignatura.AsignaturaID,
                Nombre = asignatura.Nombre,
                CarreraNombre = carrera.Nombre,
                CarreraID = asignatura.CarreraID,
                Eliminado = asignatura.Eliminado,
                Valido = valido,
            };
            AsignaturasMostrar.Add(AsignaturaMostrar);
        };
        return Json(AsignaturasMostrar);
    }
}

