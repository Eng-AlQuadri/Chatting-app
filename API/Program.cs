using API.Data;
using API.Services;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using API.Extensions;
using API.Middleware;
using Microsoft.AspNetCore.Identity;
using API.Entities;
using API.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// add token service (in ApplicationServiceExtensions file)
builder.Services.AddApplicationServices(builder.Configuration);


// Add Controllers
builder.Services.AddControllers();

builder.Services.AddSignalR();

// Add CORS Configuration
builder.Services.AddCors(options => 
{
    options.AddPolicy("AllowSpecificOrigins", policy => 
    {
        policy.WithOrigins("https://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // for SignalR
    });
});  



// Adding the authentication middleware (in IdentityServiceExtensions file)
builder.Services.AddIdentityService(builder.Configuration);

var app = builder.Build();   

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }

// seeding database with json file;
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<DataContext>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
        await context.Database.MigrateAsync();
        await Seed.SeedUsers(userManager, roleManager);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An Error Occured While Migration");
    }
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseRouting();  

// Apply The CORS Policy
app.UseCors("AllowSpecificOrigins");

app.UseAuthentication(); // JWT Token

app.UseAuthorization();

app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");

// app.UseEndpoints(endpoints =>
// {
//     endpoints.MapControllers();
//     endpoints.MapHub<PresenceHub>("hubs/presence");
// });

// Maps the controller routes.
app.MapControllers();

app.Run();
