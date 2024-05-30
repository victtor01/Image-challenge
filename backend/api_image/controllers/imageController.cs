using System.Text.Json.Serialization;
using api_image.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace api_image.Controllers
{
    [ApiController]
    [Route("images")]
    public class ImageController : ControllerBase
    {
        private readonly ImageService imageService = new();

        [HttpPost()]
        public async Task<IActionResult> Upload([FromForm] ICollection<IFormFile> files)
        {
            var data = await imageService.Upload(files);

            return File(data[0], files.FirstOrDefault().ContentType, "reload");
        }

        [HttpGet()]
        public IActionResult Index() {
            string allImages = JsonConvert.SerializeObject("hello world images");
            return Ok(allImages);
        }
    }
}