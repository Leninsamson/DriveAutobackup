using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using cMESDrive.Models;

namespace cMESDrive.BusinessRuleValidator
{
    public class DailyTaskScheduler
    {

        private static bool isTaskExecuted = false;

        readonly Validators myValidator = new Validators();
        string AutobackupTime;


        public void Start()
        {
            Task.Run(async () =>
            {
                GetAutobackupPhase();
                while (true)
                {
                    if (!isTaskExecuted && IsTimeToExecuteTask())
                    {
                        ZipAndMove();
                        isTaskExecuted = true;
                    }
                    else if (!IsTimeToExecuteTask())
                    {
                        isTaskExecuted = false;
                    }

                    await Task.Delay(TimeSpan.FromMinutes(1));
                }
            });
        }

        private bool IsTimeToExecuteTask()
        {
            //string AutoBackup_Time = "01:19:00";
            // Set the desired time for the task
            TimeSpan targetTime = TimeSpan.Parse(AutobackupTime);

            // Get the current time
            TimeSpan currentTime = DateTime.Now.TimeOfDay;

            // Compare the current time with the target time
            return currentTime.Hours == targetTime.Hours && currentTime.Minutes == targetTime.Minutes;
        }


    public string ZipAndMove()
        {
            try
            {
                string jsonData = myValidator.ReadallEquipmentData();
                // Your JSON data
                 //jsonData = "[{\"AUTOBACKUP_PHASE_ID\":1,\"AUTOBACKUP_PHASE_NAME\":\"Sun Rise Phase\",\"AUTOBACKUP_TIME\":\"06:00:00\",\"CREATED_ON\":\"2024-01-18T18:21:00.393\",\"MODIFIED_ON\":\"2024-01-18T18:21:00.393\",\"CREATED_BY\":null,\"MODIFIED_BY\":null}]";

                // Deserialize the JSON data into a List of a class or a dynamic object
                List<EquipmentData> Equipments = JsonConvert.DeserializeObject<List<EquipmentData>>(jsonData);

                // Iterate through the equipments using foreach
                foreach (var Equipment in Equipments)
                {
                    //// Access the properties of each object
                    //Console.WriteLine($"AUTOBACKUP_PHASE_ID: {myObject.AUTOBACKUP_PHASE_ID}");
                    //Console.WriteLine($"AUTOBACKUP_PHASE_NAME: {myObject.AUTOBACKUP_PHASE_NAME}");
                    //Console.WriteLine($"AUTOBACKUP_TIME: {myObject.AUTOBACKUP_TIME}");
                    //// Add more properties as needed

                    // Specify the paths for App and Backup directories

                    string appDirectoryPath = Equipment.APP_DIRECTORY;

                    string backupDirectoryPath = Equipment.BACKUP_DIRECTORY;

                    string equipment_code = Equipment.EQUIPMENT_CODE;

                    // Generate a unique zip file name (you may modify this logic as needed)
                    string zipFileName = $"{equipment_code}_Backup_{DateTime.Now:yyyyMMddHHmmss}.zip";
                    string zipFilePath = Path.Combine(backupDirectoryPath, zipFileName);

                    // Zip all files in the App directory
                    ZipFile.CreateFromDirectory(appDirectoryPath, zipFilePath);

                    // Move the zip file to the Backup directory
                    System.IO.File.Move(zipFilePath, Path.Combine(backupDirectoryPath, zipFileName));
 
                }

                return "Backuped succesfully";

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
  
        }

        public string GetAutobackupPhase()
        {
           return  AutobackupTime = myValidator.ReadAutobackupPhase();

        }

    }
}