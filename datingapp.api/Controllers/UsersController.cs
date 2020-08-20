using System.Threading.Tasks;
using datingapp.api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace datingapp.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
        
    {
        private readonly IDatingRepository _repo;

        public UsersController(IDatingRepository repo)
    {
        _repo = repo;

    }
    [HttpGet("{id")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _repo.GetUser(id);

        return Ok(user);
    }
}
}