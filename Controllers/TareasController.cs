using System.Diagnostics;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TPractico.Data;
using TPractico.Models;
using Microsoft.AspNetCore.Identity;


namespace TPractico.Controllers;
[Authorize]
public class TareasController : Controller
{
    private readonly ILogger<TareasController> _logger;
    private ApplicationDbContext _contexto;
    private readonly UserManager<IdentityUser> _userManager;


    public TareasController(ILogger<TareasController> logger, ApplicationDbContext contexto, UserManager<IdentityUser> userManager)
    {
        _logger = logger;
        _contexto = contexto;
        _userManager = userManager;
    }

    public IActionResult Index()
    {
        return View();
    }

    public JsonResult BuscarTareas(int tareaID = 0, int asignaturaID = 0, int profesorID = 0)
    {
        // var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
        List<VistaTarea> TareasMostrar = new List<VistaTarea>();
        var tareasBD = _contexto.Tareas.OrderByDescending(t => t.FechaCarga).ToList();
        var profesores = _contexto.Profesores.ToList();

        foreach (var tarea in tareasBD)
        {
           var profesorNombre = profesores.FirstOrDefault(c => c.ProfesorID == tarea.ProfesorID)?.NombreCompleto;
            var TareaMostrar = new VistaTarea
            {
                TareaID = tarea.TareaID,
                FechaCarga = tarea.FechaCarga,
                FechaVencimiento = tarea.FechaVencimiento,
                Titulo = tarea.Titulo,
                Descripcion = tarea.Descripcion,
                AsignaturaID = tarea.AsignaturaID,
                Eliminada = tarea.Eliminada,
                ProfesorID = tarea.ProfesorID,
                ProfesorNombre = profesorNombre,
            };
            TareasMostrar.Add(TareaMostrar);
        };
        var tareas = TareasMostrar;

        if (asignaturaID > 0)
        {
            tareas = tareas.Where(p => p.AsignaturaID == asignaturaID).ToList();
        }
        if (tareaID > 0)
        {
            tareas = tareas.Where(p => p.TareaID == tareaID).ToList();
        }
        if (profesorID > 0)
        {
            var profAsig = _contexto.ProfesorAsignaturas.Where(pa => pa.ProfesorID == profesorID && pa.Eliminado != true).ToList();
            var asignaturas = _contexto.Asignaturas.Where(a => a.Eliminado != true).ToList();
            var tareasValidas = new List<VistaTarea>();
            var asignaturaValidas = new List<Asignatura>();
            foreach (var prof in profAsig)
            {
                // asignaturasValidas.push(tareas.Where(t => t.AsignaturaID == prof.AsignaturaID));
                var push = tareas.Where(t => t.AsignaturaID == prof.AsignaturaID).ToList();
                tareasValidas.AddRange(push);

                var asignatura = asignaturas.Where(a => a.AsignaturaID == prof.AsignaturaID).FirstOrDefault();

                if (asignatura != null && !asignaturaValidas.Any(av => av.AsignaturaID == asignatura.AsignaturaID))
                {
                    asignaturaValidas.Add(asignatura);
                }
            }
            tareasValidas = tareasValidas.OrderByDescending(t => t.FechaCarga).ToList();
            var resultado = new { Tareas = tareasValidas, Asignaturas = asignaturaValidas };

            return Json(resultado);
        }
        _contexto.SaveChanges();
        return Json(tareas);
    }

    public JsonResult GuardarTarea(int tareaID, int profesorID, string descripcion, string titulo, int asignaturaID, DateTime fechaCarga, DateTime fechaVencimiento)
    {
        var usuarioIDActual = _userManager.GetUserId(HttpContext.User);

        string resultado = "Error";
        if (!string.IsNullOrEmpty(descripcion) && !string.IsNullOrEmpty(titulo))
        {
            // var nexo = _contexto.ProfesorAsignaturas.Where(c => c.AsignaturaID == asignaturaID).FirstOrDefault();
            if (tareaID == 0)
            {
                var tareaExistente = _contexto.Tareas.Where(c => c.Descripcion == descripcion).FirstOrDefault();
                if (tareaExistente == null)
                {
                    var TareaGuardar = new Tarea
                    {
                        Titulo = titulo,
                        Descripcion = descripcion,
                        FechaCarga = fechaCarga,
                        FechaVencimiento = fechaVencimiento,
                        ProfesorID = profesorID,
                        AsignaturaID = asignaturaID,

                    };
                    _contexto.Add(TareaGuardar);
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
                var tareaExistente = _contexto.Tareas.Where(c => c.Descripcion == descripcion && c.TareaID != tareaID).Count();
                if (tareaExistente == 0)
                {
                    var tareaEditar = _contexto.Tareas.Find(tareaID);
                    if (tareaEditar != null)
                    {
                        tareaEditar.Titulo = titulo;
                        tareaEditar.Descripcion = descripcion;
                        tareaEditar.ProfesorID = profesorID;
                        tareaEditar.FechaCarga = fechaCarga;
                        tareaEditar.FechaVencimiento = fechaVencimiento;
                        tareaEditar.AsignaturaID = asignaturaID;
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
            resultado = "Faltas";
        }

        return Json(resultado);
    }

    public JsonResult Deshabilitar(int tareaID)
    {
        var resultado = "error";
        var tarea = _contexto.Tareas.Where(c => c.TareaID == tareaID).FirstOrDefault();
        if (tarea != null)
        {
            if (tarea.Eliminada == true)
            {
                tarea.Eliminada = false;
            }
            else
            {
                tarea.Eliminada = true;
            }
            resultado = "cambiar";

            _contexto.SaveChanges();
        }

        return Json(resultado);
    }

}
