using cMESDrive.Database;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;
using Newtonsoft;
using System.Web.Mvc;
using System.Text;
using cMESDrive.Models;

namespace cMESDrive.BusinessRuleValidator
{
    public class Validators
    {
        SQLClass SQL = new SQLClass();

        public string ValidateUser(string userName, string password)
        {
            //DataTable userDT = SQL.Fetchdata("select UserName,Password from UserMaster with (nolock) where USERNAME = '" + userName + "'");
            DataTable userDT = SQL.Fetchdata("SELECT USER_NAME,FIRST_NAME,LAST_NAME,ADMIN_USER_FLAG,PASSWORD FROM User_Master WHERE USER_NAME = '" + userName + "'");

            if (userDT.Rows.Count==0)
            {
                return "Invalid UserName";
            }
            string DBpassword = Convert.ToString(userDT.Rows[0]["Password"]);

            //string DecryptPassword = DecryptString(Convert.ToString(userDT.Rows[0]["PASSWORD"]));
            if (password == DBpassword)
            {
                return "OK";
            }
            else
            {
                return "Invalid Password";
            }
        }

        public string ReadFactoryData()
        {
            DataTable FactoryDT = SQL.Fetchdata("SELECT FACTORY_ID,FACTORY_CODE,FACTORY_NAME FROM FACTORY WITH (NOLOCK)");

            string JSONString = JsonConvert.SerializeObject(FactoryDT);
            return JSONString;
        }


        public string ReadAreaData(string factoryID)
        {
            DataTable AreaDT = SQL.Fetchdata("SELECT AREA_ID,AREA_CODE,AREA_NAME,FACTORY_ID FROM AREA with (nolock) where factory_id =" + factoryID);
            //return EquipBackupDT;

            string JSONString = JsonConvert.SerializeObject(AreaDT);
            return JSONString;
        }

        public string ReadLineData(string AreaID)
        {
            DataTable LineDT = SQL.Fetchdata("SELECT LINE_ID,LINE_CODE,LINE_NAME,AREA_ID FROM Line WITH (NOLOCK) where AREA_ID =" + AreaID);
            //return EquipBackupDT;

            string JSONString = JsonConvert.SerializeObject(LineDT);
            return JSONString;
        }


        public string ReadEquipmentData(string LineID)
        {
            DataTable EquipBackupDT = SQL.Fetchdata("SELECT * FROM EQUIPMENT WITH (NOLOCK) WHERE LINE_ID ="+ LineID);
         
            string JSONString = JsonConvert.SerializeObject(EquipBackupDT);
            return JSONString;

        }

        public string ReadallEquipmentData()
        {
            DataTable EquipallBackupDT = SQL.Fetchdata("SELECT * FROM EQUIPMENT WITH (NOLOCK)");

            string JSONString = JsonConvert.SerializeObject(EquipallBackupDT);
            return JSONString;

        }


        public string UpdateEquipmentData(EquipmentData equipmentData)
        {
            try
            {
                string SqlQuery = "UPDATE EQUIPMENT SET EQUIPMENT_CODE='" + equipmentData.EQUIPMENT_CODE + "',EQUIPMENT_NAME = '" + equipmentData.EQUIPMENT_NAME + "',APP_DIRECTORY='" + equipmentData.APP_DIRECTORY + "',BACKUP_DIRECTORY='" + equipmentData.BACKUP_DIRECTORY + "' WHERE EQUIPMENT_ID = '" + equipmentData.EQUIPMENT_ID + "'";
                SQL.ExecuteNonQuery(SqlQuery);
                return "OK";
            }
            catch(Exception ex) 
            { 
                return ex.Message;
            }
        }

        public string ReadAutobackupPhase()
        {
            try
            {
                DataTable AutobackupPhaseDT = SQL.Fetchdata("SELECT AUTOBACKUP_TIME  FROM AUTOBACKUP_PHASE WITH (NOLOCK) ");

                string AutobackupTime = Convert.ToString(AutobackupPhaseDT.Rows[0]["AUTOBACKUP_TIME"]);

                //string JSONString = JsonConvert.SerializeObject(AutobackupPhaseDT);
                return AutobackupTime;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }






        private string DecryptString(string strToDecrpyt)
        {
            byte[] b = Convert.FromBase64String(strToDecrpyt);
            string Decrypted = Encoding.ASCII.GetString(b);
            return Decrypted;
        }

    }
}