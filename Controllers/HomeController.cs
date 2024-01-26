using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.WebPages;
using cMESDrive.BusinessRuleValidator;
using cMESDrive.Models;
using Newtonsoft.Json;

namespace cMESDrive.Controllers
{
   
    public class HomeController : Controller
    {
        readonly Validators myValidator = new Validators();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
   
        public string loadFactoryAPI()
        {
            try
            {
                string loadData = myValidator.ReadFactoryData();
                return loadData;

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        public string loadAreaAPI(string factoryID)
        {
            try
            {
             
                string loadData = myValidator.ReadAreaData(factoryID);
                return loadData;

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string loadLineAPI(string AreaID)
        {
            try
            {
                string loadData = myValidator.ReadLineData(AreaID);
                return loadData;

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string loadEquipmentAPI(string LineID)
        {
            try
            {
                string loadData = myValidator.ReadEquipmentData(LineID);
                return loadData;

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }


        public string updateEquipmentAPI(EquipmentData equipmentData)
        {
            try{
                string updateequipmentapiresult = myValidator.UpdateEquipmentData(equipmentData);
                return updateequipmentapiresult;
        }
            catch(Exception ex)  
            { 
                return ex.Message;
            }
}

        public ActionResult ZipAndMove()
        {
            try
            {
                // Specify the paths for App and Backup directories
                //   string appDirectoryPath = Server.MapPath("~/App");
                string appDirectoryPath = @"\\inmaamesqss01\MES\(_enin\Testing\AL01.SP_BOT1";
                // string backupDirectoryPath = Server.MapPath("~/Backup");
                string backupDirectoryPath = @"\\INMAASTIPL-L272\backup";

                // Generate a unique zip file name (you may modify this logic as needed)
                string zipFileName = $"Backup_{DateTime.Now:yyyyMMddHHmmss}.zip";
                string zipFilePath = Path.Combine(backupDirectoryPath, zipFileName);

                // Zip all files in the App directory
                ZipFile.CreateFromDirectory(appDirectoryPath, zipFilePath);

                // Move the zip file to the Backup directory
                System.IO.File.Move(zipFilePath, Path.Combine(backupDirectoryPath, zipFileName));
                return Json(new { success = true, message = "Backuped succesfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
//        return View();
        }


        public ActionResult DownloadLastModifiedZipAPI(string backupDirectorypath)
        {
            // Specify the path to the directory containing your ZIP files
            //string backupDirectorypath = @"\\INMAASTIPL-L272\backup";

            // Get the list of ZIP files in the directory, ordered by last modified time
            //retrieve an array of file paths for all files with a ".zip" extension in the specified directory (directoryPath)

            try
            {
                var zipFiles = Directory.GetFiles(backupDirectorypath, "*.zip")
                                     .OrderByDescending(f => new FileInfo(f).LastWriteTime)
                                     .ToList();

                // Check if there are any ZIP files
                if (zipFiles.Any())
                {
                    // Get the path of the last modified ZIP file
                    string lastModifiedZipPath = zipFiles.First();

                    // Set the file name for download
                    string fileName = Path.GetFileName(lastModifiedZipPath);

                    // Return the ZIP file as a FileResult for download
                    return File(lastModifiedZipPath, "application/zip", fileName);
                }
                else
                {
                    // Handle the case when no ZIP files are found
                    return Content("No ZIP files found.");
                }

            }
            catch(Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }

        }









    }
}