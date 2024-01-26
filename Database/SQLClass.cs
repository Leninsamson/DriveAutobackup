using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace cMESDrive.Database
{
    public class SQLClass
    {

        string connectionString = ConfigurationManager.ConnectionStrings["connectionString"]?.ConnectionString;

        public DataTable Fetchdata(string sqlQuery)
        {
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new Exception("Connection string is null or empty.");
            }
            SqlConnection conn = new SqlConnection(connectionString);
            SqlDataAdapter SqlAdptr = new SqlDataAdapter();
            DataSet Dtset = new DataSet();
            try
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                    SqlAdptr = new SqlDataAdapter(sqlQuery, conn);
                    SqlAdptr.Fill(Dtset);
                    return Dtset.Tables[0];

                }
                else
                {
                    return Dtset.Tables[0];
                }
            }
            catch (Exception ) { return Dtset.Tables[0]; }
            finally 
            {
                SqlAdptr.Dispose();
                Dtset.Dispose();
                conn.Close(); 
            }
           
        }


        // non returns data
        public int ExecuteNonQuery(string sqlQuery)
        {
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new Exception("Connection string is null or empty.");
            }
            SqlConnection conn = new SqlConnection(connectionString);
            try
            {
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                SqlCommand Comm = new SqlCommand(sqlQuery, conn);
                return Comm.ExecuteNonQuery();
            }
            catch (Exception Ex)
            {
                throw new Exception(Ex.Message);
            }
            finally
            {
                conn.Close();
            }
        }
    }
}