using BountyIo.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BountyIo.Model;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;

namespace BountyIo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IConfiguration _config;
        public UsersController(IUsersRepository usersRepository, IConfiguration config)
        {
            _usersRepository = usersRepository;
            _config = config;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDetails>>> GetUsers()
        {
            return Ok(await _usersRepository.GetUsers());
        }

        [Authorize]
        [HttpGet]
        [Route("me")]
        public async Task<ActionResult<UserDetails>> GetUser()
        {
            var currentUser = HttpContext.User?.Identity?.Name;
            if (!string.IsNullOrEmpty(currentUser))
            {
                var result = await _usersRepository.GetUser(currentUser);
                if(result != null)
                {
                    return Ok(result);
                }
                return NotFound();
            }

            return BadRequest();
        }

        [HttpPost]
        public async Task<ActionResult<UserAuth>> AddUser([FromBody] UserCredentials userCredentials)
        {
            if (await _usersRepository.AddUser(userCredentials.Username))
            {
                return Ok(new UserAuth { Username = userCredentials.Username, Token = generateToken(userCredentials.Username) });
            }

            return BadRequest();
        }

        private string generateToken(string username)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, username)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}
