using System.Diagnostics;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TPractico.Data;
using TPractico.Models;

namespace TPractico.Controllers;
[Authorize]

public class CarrerasController : Controller
{
    private readonly ILogger<CarrerasController> _logger;
    private ApplicationDbContext _contexto;

    public CarrerasController(ILogger<CarrerasController> logger, ApplicationDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    public IActionResult Index()
    {
        return View();
    }

    public JsonResult BuscarCarreras(int carreraID = 0)
    {
        var carreras = _contexto.Carreras.OrderBy(p => p.Nombre).ToList();

        if (carreraID > 0)
        {
            carreras = carreras.Where(p => p.CarreraID == carreraID).OrderBy(p => p.Nombre).ToList();
        }
        _contexto.SaveChanges();
        return Json(carreras);
    }

    public JsonResult GuardarCarrera(int carreraID, string nombre, int duracion)
    {
        string resultado = "Error";
        if (!string.IsNullOrEmpty(nombre))
        {
            if (carreraID == 0)
            {
                var carreraExistente = _contexto.Carreras.Where(c => c.Nombre == nombre).FirstOrDefault();
                if (carreraExistente == null)
                {
                    var CarreraGuardar = new Carrera
                    {
                        Nombre = nombre,
                        Duracion = duracion
                    };
                    _contexto.Add(CarreraGuardar);
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
                var carreraExistente = _contexto.Carreras.Where(c => c.Nombre == nombre && c.CarreraID != carreraID).Count();
                if (carreraExistente == 0)
                {
                    var carreraEditar = _contexto.Carreras.Find(carreraID);
                    if (carreraEditar != null)
                    {
                        carreraEditar.Nombre = nombre;
                        carreraEditar.Duracion = duracion;
                        _contexto.SaveChanges();
                        resultado = "Crear";
                    }
                }
                else
                {
                    resultado = "repetir";
                }
            }
        }
        else
        {
            resultado = "faltas";
        }

        return Json(resultado);
    }

    public JsonResult Deshabilitar(int carreraID)
    {
        String resultado = "error";
        var carrera = _contexto.Carreras.Where(c => c.CarreraID == carreraID).FirstOrDefault();

        if (carrera.Eliminado == true)
        {
            carrera.Eliminado = false;
        }
        else
        {
            var alumnosEditar = _contexto.Alumnos.Where(p => p.CarreraID == carrera.CarreraID).ToList();
            foreach (var alumno in alumnosEditar)
            {
                alumno.Eliminado = true;
            }
            var asignaturaEditar = _contexto.Asignaturas.Where(a => a.CarreraID == carrera.CarreraID).ToList();
            foreach (var asignatura in asignaturaEditar)
            {
                asignatura.Eliminado = true;
            }
            carrera.Eliminado = true;
        }
        resultado = "cambiar";

        _contexto.SaveChanges();

        return Json(resultado);
    }



    public JsonResult GraficoCarreraAlumno()
    {
        var carreras = _contexto.Carreras.ToList();
        var labels = new List<string>();
        var data = new List<int>();
        foreach (var carrera in carreras)
        {
            var alumnos = _contexto.Alumnos.Where(a => a.CarreraID == carrera.CarreraID).Count();
            labels.Add(carrera.Nombre);
            data.Add(alumnos);
        }
        var resultado = new { Labels = labels, data = data };

        return Json(resultado);
    }
}
