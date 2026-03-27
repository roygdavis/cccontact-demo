using Azure.AI.Extensions.OpenAI;
using Azure.AI.Projects;
using Azure.Identity;
using cccontact_demo.Server.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OpenAI.Responses;

namespace cccontact_demo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController(IOptions<AzureAiFoundry> config) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // Connect to your project using the endpoint from your project page
            // The AzureCliCredential will use your logged-in Azure CLI identity, make sure to run `az login` first
            AIProjectClient projectClient = new(endpoint: new Uri(config.Value.ProjectEndpoint), tokenProvider: new DefaultAzureCredential());

            ProjectResponsesClient responseClient = projectClient.OpenAI.GetProjectResponsesClientForAgent(config.Value.AgentName);
            // Use the agent to generate a response
#pragma warning disable OPENAI001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
            ResponseResult response = responseClient.CreateResponse(
                "Hello! Tell me a joke."
            );
#pragma warning restore OPENAI001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
            
            return Ok(response.GetOutputText());
        }
    }
}
