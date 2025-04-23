using Microsoft.EntityFrameworkCore;
using RecipeBack.Data;
using RecipeBack.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<RecipeContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IRecipeService, RecipeService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<RecipeContext>();
        dbContext.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while migrating the database: {ex.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS middleware - MUST be before MapControllers
app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();
