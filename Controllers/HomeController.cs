using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TPractico.Models;
using TPractico.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Components.Forms;

namespace TPractico.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly ApplicationDbContext _contexto;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _rolManager;



    public HomeController(ILogger<HomeController> logger, ApplicationDbContext contexto, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> rolManager)
    {
        _logger = logger;
        _contexto = contexto;
        _userManager = userManager;
        _rolManager = rolManager;
    }

    public async Task<IActionResult> Index()
    {
        await InicializarPermisosUsuario();
        return View();
    }

    public async Task<JsonResult> InicializarPermisosUsuario()
    {
        //CREAR ROLES SI NO EXISTEN
        var RolAdmin = _contexto.Roles.Where(r => r.Name == "Admin").SingleOrDefault();
        if (RolAdmin == null)
        {
            var roleResult = await _rolManager.CreateAsync(new IdentityRole("Admin"));
        }
        //CREAR ROLES SI NO EXISTEN
        var RolAdmin2 = _contexto.Roles.Where(r => r.Name == "Profesor").SingleOrDefault();
        if (RolAdmin2 == null)
        {
            var roleResult2 = await _rolManager.CreateAsync(new IdentityRole("Profesor"));
        }
        //CREAR ROLES SI NO EXISTEN
        var RolAdmin3 = _contexto.Roles.Where(r => r.Name == "Estudiante").SingleOrDefault();
        if (RolAdmin3 == null)
        {
            var roleResult3 = await _rolManager.CreateAsync(new IdentityRole("Estudiante"));
        }
        bool creado = true;
        return Json(creado);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
