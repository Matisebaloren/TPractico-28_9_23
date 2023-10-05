using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using TPractico.Data;
using TPractico.Models;
using Microsoft.EntityFrameworkCore;


namespace TPractico.Controllers;

public class AlumnosController : Controller
{
    private readonly ILogger<AlumnosController> _logger;
    private ApplicationDbContext _contexto;

    public AlumnosController(ILogger<AlumnosController> logger, ApplicationDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    public IActionResult Index()
    {
        var carreras = _contexto.Carreras.Where(c => c.Eliminado != true).ToList();
        ViewBag.CarreraID = new SelectList(carreras.OrderBy(p => p.Nombre), "CarreraID", "Nombre", 0);
        return View();
    }

    public JsonResult BuscarAlumnos(int alumnoID = 0)
    {
        var alumnos = _contexto.Alumnos.Include(a => a.Carrera).ToList();

        if (alumnoID > 0)
        {
            alumnos = alumnos.Where(p => p.AlumnoID == alumnoID).ToList();
        }
        alumnos = alumnos
        .OrderBy(a => a.Carrera.Nombre)
        .ThenBy(a => a.NombreCompleto)
        .ToList();
        return Json(alumnos);
    }

    public JsonResult GuardarAlumno(int alumnoID, string nombreCompleto, int carreraID, string fecha, int dni, string email, string direccion)
    {
        string resultado = "Error";
        if (!string.IsNullOrEmpty(nombreCompleto))
        {
            DateTime.TryParse(fecha, out DateTime fechaDate);
            if (alumnoID == 0)
            {
                var alumnoExistente = _contexto.Alumnos.Where(c => c.DNI == dni).FirstOrDefault();
                if (alumnoExistente == null)
                {
                    var AlumnoGuardar = new Alumno
                    {
                        NombreCompleto = nombreCompleto,
                        CarreraID = carreraID,
                        Fecha = fechaDate,
                        Direccion = direccion,
                        DNI = dni,
                        Email = email,
                    };
                    _contexto.Add(AlumnoGuardar);
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
                var alumnoExistente = _contexto.Alumnos.Where(c => c.DNI == dni && c.CarreraID == carreraID && c.AlumnoID != alumnoID).Count();
                if (alumnoExistente == 0)
                {
                    var alumnoEditar = _contexto.Alumnos.Find(alumnoID);
                    if (alumnoEditar != null)
                    {
                        alumnoEditar.NombreCompleto = nombreCompleto;
                        alumnoEditar.CarreraID = carreraID;
                        alumnoEditar.Fecha = fechaDate;
                        alumnoEditar.DNI = dni;
                        alumnoEditar.Direccion = direccion;
                        alumnoEditar.Email = email;
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

    public JsonResult Deshabilitar(int alumnoID)
    {
        String resultado = "error";
        var alumno = _contexto.Alumnos.Where(c => c.AlumnoID == alumnoID).FirstOrDefault();

        if (alumno.Eliminado == true)
        {
            var CarreraEditar = _contexto.Carreras.Find(alumno.CarreraID);
            CarreraEditar.Eliminado = false;
            alumno.Eliminado = false;
        }
        else
        {
            alumno.Eliminado = true;
        }
        resultado = "cambiar";
        _contexto.SaveChanges();
        return Json(resultado);
    }
}
