using Microsoft.EntityFrameworkCore;
using RecipeBack.Data;
using RecipeBack.Models;
using RecipeBack.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<RecipeContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IRecipeService, RecipeService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
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

        // Seed the database with default recipes if it's empty
        if (!dbContext.Recipes.Any())
        {
            var defaultRecipes = new List<Recipe>
            {
                new() {
                    Name = "Arepas con Queso",
                    Description = "Deliciosas arepas de maíz rellenas de queso derretido, un clásico desayuno o merienda en Colombia y Venezuela.",
                    IsFavorite = true,
                    Ingredients =
                    [
                        new() { IngredientName = "Harina de maíz precocida", Quantity = "2 tazas" },
                        new() { IngredientName = "Agua tibia", Quantity = "2.5 tazas" },
                        new() { IngredientName = "Sal", Quantity = "1 cucharadita" },
                        new() { IngredientName = "Queso rallado (mozarella o telita)", Quantity = "1 taza" },
                        new() { IngredientName = "Mantequilla", Quantity = "2 cucharadas" }
                    ]
                },
                new() {
                    Name = "Ceviche Peruano",
                    Description = "Fresco y vibrante plato peruano de pescado crudo marinado en jugo de limón, ají, cebolla morada y cilantro.",
                    Ingredients = new List<RecipeIngredient>
                    {
                        new() { IngredientName = "Pescado blanco fresco (corvina o lenguado)", Quantity = "500 gramos, cortado en cubos" },
                        new() { IngredientName = "Jugo de limones frescos", Quantity = "1 taza" },
                        new() { IngredientName = "Cebolla morada", Quantity = "1 unidad, cortada en julianas finas" },
                        new() { IngredientName = "Ají limo o ají amarillo", Quantity = "1 unidad, sin venas ni pepas, picado fino" },
                        new() { IngredientName = "Cilantro fresco", Quantity = "1/4 taza, picado" },
                        new() { IngredientName = "Sal", Quantity = "al gusto" },
                        new() { IngredientName = "Pimienta", Quantity = "al gusto" },
                        new() { IngredientName = "Maíz cancha serrana tostado", Quantity = "para acompañar" },
                        new() { IngredientName = "Camote (boniato) sancochado", Quantity = "para acompañar" }
                    }
                },
                new() {
                    Name = "Feijoada",
                    Description = "Un robusto y sabroso guiso brasileño de frijoles negros con una variedad de carnes de cerdo y res, tradicionalmente servido con arroz, col rizada y naranja.",
                    Ingredients = new List<RecipeIngredient>
                    {
                        new() { IngredientName = "Frijoles negros secos", Quantity = "500 gramos" },
                        new() { IngredientName = "Carne seca (tasajo)", Quantity = "200 gramos" },
                        new() { IngredientName = "Costillas de cerdo saladas", Quantity = "200 gramos" },
                        new() { IngredientName = "Lomo de cerdo ahumado", Quantity = "150 gramos" },
                        new() { IngredientName = "Chorizo o linguiça", Quantity = "150 gramos" },
                        new() { IngredientName = "Tocino ahumado", Quantity = "100 gramos" },
                        new() { IngredientName = "Cebolla", Quantity = "1 unidad grande, picada" },
                        new() { IngredientName = "Ajo", Quantity = "4 dientes, picados" },
                        new() { IngredientName = "Hojas de laurel", Quantity = "2 unidades" },
                        new() { IngredientName = "Agua", Quantity = "suficiente para cubrir" },
                        new() { IngredientName = "Sal", Quantity = "al gusto (cuidado con la sal de las carnes)" },
                        new() { IngredientName = "Pimienta negra", Quantity = "al gusto" }
                    }
                }
            };

            dbContext.Recipes.AddRange(defaultRecipes);
            dbContext.SaveChanges();
            Console.WriteLine("Database seeded with default recipes.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while migrating or seeding the database: {ex.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // Disable HTTPS redirection for Docker internal communication

// enable CORS middleware - MUST be before MapControllers
app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();
