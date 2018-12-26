using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using BountyIo.Model;
using Dapper;
using Microsoft.Extensions.Configuration;

namespace BountyIo.Repositories
{
    public class UsersRepository : IUsersRepository
    {
         private readonly IConfiguration _config;
        public UsersRepository(IConfiguration config)
        {
             _config = config;
        }

         public IDbConnection Connection
        {
            get
            {
                return new SqlConnection(_config.GetConnectionString("MyConnectionString"));
            }
        }
    
        public async Task<UserDetails> GetUser(string username)
        {
            using (IDbConnection conn = Connection)
            {
                string query = "SELECT Username, Score FROM [dbo].[User] WHERE Username = @Username";
                conn.Open();
                var result = await conn.QueryAsync<UserDetails>(query, new { Username = username });
                return result.FirstOrDefault();
            }
        }

        public async Task<IEnumerable<UserDetails>> GetUsers()
        {
            using (IDbConnection conn = Connection)
            {
                string query = "SELECT Username, Score FROM [dbo].[User]";
                conn.Open();
                var result = await conn.QueryAsync<UserDetails>(query);
                return result;
            }
        }

        public async Task<bool> AddUser(string username)
        {
            using (IDbConnection conn = Connection)
            {
                string query = @"BEGIN TRY
                        BEGIN TRANSACTION insertUser

                        IF NOT EXISTS (
                                SELECT 1
                                FROM [dbo].[User]
                                WHERE Username = @Username
                                )
                        BEGIN
                            INSERT INTO [dbo].[User] (Username)
                            VALUES (@Username)
                            SELECT @@ROWCOUNT
                        END
                        COMMIT TRANSACTION insertUser
                    END TRY

                    BEGIN CATCH
                        ROLLBACK TRANSACTION insertUser

                        SELECT 0
                    END CATCH
                    ";
                conn.Open();
                var result = await conn.QueryAsync<bool>(query, new { Username = username });
                return result.FirstOrDefault();
            }
        }
    }
}