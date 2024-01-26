using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using cMESDrive.BusinessRuleValidator;
using cMESDrive.Models;

namespace cMESDrive.Controllers
{
    public class LoginController : Controller
    {
       readonly Validators myValidator = new Validators();

        // GET: Login
        public ActionResult Login()
        {
            return View();
        }

        public ActionResult UserCheck(Login login)
        {
            string userValidResult = myValidator.ValidateUser(login.UserName, login.Password);
            if (userValidResult == "OK")
            { 
                return Json(new { result = "Redirect", url = Url.Action("Index", "Home") });
               }
            else
            {
                return Json(new { result = userValidResult, url = Url.Action("Login", "Login") });
            
            }
        }
    }
}