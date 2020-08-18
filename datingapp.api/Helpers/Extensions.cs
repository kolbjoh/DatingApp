using Microsoft.AspNetCore.Http;

namespace datingapp.api.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message){

            response.Headers.Add("Application.Error", message);
            response.Headers.Add("Acess-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Controll-Allow-Origin","*");
        }
    }
}