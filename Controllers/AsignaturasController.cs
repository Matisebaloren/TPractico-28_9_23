using System.Diagnostics;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TPractico.Data;
using TPractico.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;


namespace TPractico.Controllers;
[Authorize]
public class AsignaturasController : Controller
{
    private readonly ILogger<AsignaturasController> _logger;
    private ApplicationDbContext _contexto;
    private readonly UserManager<IdentityUser> _userManager;


    public AsignaturasController(ILogger<AsignaturasController> logger, ApplicationDbContext contexto, UserManager<IdentityUser> userManager)
    {
        _logger = logger;
        _contexto = contexto;
        _userManager = userManager;
    }

    public IActionResult Index()
    {
        var carreras = _contexto.Carreras.Where(c => c.Eliminado != true).ToList();
        ViewBag.CarreraID = new SelectList(carreras.OrderBy(p => p.Nombre), "CarreraID", "Nombre", 0);
        return View();
    }

    public JsonResult BuscarAsignaturas(int asignaturaID = 0)
    {
        List<VistaAsignatura> AsignaturasMostrar = new List<VistaAsignatura>();
        var asignaturas = _contexto.Asignaturas.OrderBy(t => t.Nombre).ToList();
        var carreras = _contexto.Carreras.ToList();

        if (asignaturaID > 0)
        {
            asignaturas = asignaturas.Where(p => p.AsignaturaID == asignaturaID).ToList();
        }


        foreach (var asignatura in asignaturas)
        {
            var carrera = carreras.Where(c => c.CarreraID == asignatura.CarreraID).FirstOrDefault();
            var AsignaturaMostrar = new VistaAsignatura
            {
                AsignaturaID = asignatura.AsignaturaID,
                Nombre = asignatura.Nombre,
                CarreraNombre = carrera.Nombre,
                CarreraEliminada = carrera.Eliminado,
                CarreraID = asignatura.CarreraID,
                Eliminado = asignatura.Eliminado,
            };
            AsignaturasMostrar.Add(AsignaturaMostrar);
        };
        // _contexto.SaveChanges();
        return Json(AsignaturasMostrar);
    }

    public JsonResult GuardarAsignatura(int asignaturaID, string nombre, int carreraID = 0)
    {
        // var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
        string resultado = "Error";
        if (!string.IsNullOrEmpty(nombre) && carreraID != 0)
        {
            if (asignaturaID == 0)
            {
                var asignaturaExistente = _contexto.Asignaturas.Where(c => c.Nombre == nombre && c.CarreraID == carreraID).FirstOrDefault();
                if (asignaturaExistente == null)
                {
                    var AsignaturaGuardar = new Asignatura
                    {
                        Nombre = nombre,
                        CarreraID = carreraID,
                    };
                    _contexto.Add(AsignaturaGuardar);
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
                var asignaturaExistente = _contexto.Asignaturas.Where(c => c.Nombre == nombre && c.CarreraID == carreraID && c.AsignaturaID != asignaturaID).Count();
                if (asignaturaExistente == 0)
                {
                    var asignaturaEditar = _contexto.Asignaturas.Find(asignaturaID);
                    if (asignaturaEditar != null)
                    {
                        asignaturaEditar.Nombre = nombre;
                        asignaturaEditar.CarreraID = carreraID;

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

    public JsonResult Deshabilitar(int asignaturaID)
    {
        var resultado = "error";
        var asignatura = _contexto.Asignaturas.Where(c => c.AsignaturaID == asignaturaID).FirstOrDefault();
        if (asignatura != null)
        {
            if (asignatura.Eliminado == true)
            {
                asignatura.Eliminado = false;
            }
            else
            {
                asignatura.Eliminado = true;
            }
            resultado = "cambiar";

            _contexto.SaveChanges();
        }

        return Json(resultado);
    }

}
