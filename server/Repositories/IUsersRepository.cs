using System.Collections.Generic;
using System.Threading.Tasks;
using BountyIo.Model;

namespace BountyIo.Repositories
{
    public interface IUsersRepository
    {
        Task<UserDetails> GetUser(string username);
        Task<IEnumerable<UserDetails>> GetUsers();
        Task<bool> AddUser(string username);
    }
}