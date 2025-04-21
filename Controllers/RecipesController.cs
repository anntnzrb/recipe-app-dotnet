using Microsoft.AspNetCore.Mvc;
using asp_demo.Models;

namespace asp_demo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController : ControllerBase
    {
        private static readonly List<Recipe> recipes =
        [
                new Recipe
                {
                    Id = 1,
                    Name = "Ceviche Peruano",
                    Description = "Pescado fresco marinado en jugo de limón con ají y cilantro.",
                    Ingredients =
                        [
                            new() { Id = 1, RecipeId = 1, IngredientName = "Filete de pescado blanco (corvina o similar)", Quantity = "500g" },
                            new() { Id = 2, RecipeId = 1, IngredientName = "Limones (jugo)", Quantity = "1 taza" },
                            new() { Id = 3, RecipeId = 1, IngredientName = "Cebolla roja en juliana fina", Quantity = "1 grande" },
                            new() { Id = 4, RecipeId = 1, IngredientName = "Ají limo o rocoto sin venas picado", Quantity = "1 (al gusto)" },
                            new() { Id = 5, RecipeId = 1, IngredientName = "Cilantro picado", Quantity = "1/4 taza" },
                            new() { Id = 6, RecipeId = 1, IngredientName = "Sal y pimienta", Quantity = "Al gusto" },
                            new() { Id = 7, RecipeId = 1, IngredientName = "Camote cocido (opcional)", Quantity = "1" },
                            new() { Id = 8, RecipeId = 1, IngredientName = "Maíz cancha serrana tostado (opcional)", Quantity = "1/2 taza" }
                        ]
                },
            new Recipe
            {
                Id = 2,
                Name = "Arepas Venezolanas",
                Description = "Pan de maíz tradicional, versátil para rellenar.",
                Ingredients =
                        [
                            new() { Id = 9, RecipeId = 2, IngredientName = "Harina de maíz precocida (P.A.N.)", Quantity = "2 tazas" },
                            new() { Id = 10, RecipeId = 2, IngredientName = "Agua tibia", Quantity = "2.5 tazas (aprox.)" },
                            new() { Id = 11, RecipeId = 2, IngredientName = "Sal", Quantity = "1 cdta" },
                            new() { Id = 12, RecipeId = 2, IngredientName = "Aceite o mantequilla (opcional, para cocinar)", Quantity = "1 cda" }
                        ]
            }
            ];

        [HttpGet]
        public ActionResult<IEnumerable<Recipe>> GetRecipes()
        {
            return recipes;
        }

        [HttpGet("{id}")]
        public ActionResult<Recipe> GetRecipe(int id) =>
            recipes.Find(r => r.Id == id) is Recipe recipe
            ? recipe
            : NotFound();

        [HttpPost]
        public ActionResult<Recipe> CreateRecipe(Recipe recipe)
        {
            if (string.IsNullOrEmpty(recipe.Name) || string.IsNullOrEmpty(recipe.Description))
            {
                return BadRequest("Recipe name and description are required.");
            }

            // Assign a new ID for the recipe
            recipe.Id = recipes.Count > 0 ? recipes.Max(r => r.Id) + 1 : 1;

            // Assign IDs and RecipeIds for ingredients
            if (recipe.Ingredients != null)
            {
                int ingredientIdCounter = 1; // Simple counter for ingredient IDs
                foreach (var ingredient in recipe.Ingredients)
                {
                    ingredient.RecipeId = recipe.Id;
                    ingredient.Id = ingredientIdCounter++;
                }
            }

            recipes.Add(recipe);

            return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, recipe);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateRecipe(int id, Recipe recipe)
        {
            if (id != recipe.Id)
            {
                return BadRequest("Recipe ID in the URL does not match the ID in the request body.");
            }

            if (string.IsNullOrEmpty(recipe.Name) || string.IsNullOrEmpty(recipe.Description))
            {
                return BadRequest("Recipe name and description are required.");
            }

            var existingRecipe = recipes.Find(r => r.Id == id);
            if (existingRecipe == null)
            {
                return NotFound();
            }

            existingRecipe.Name = recipe.Name;
            existingRecipe.Description = recipe.Description;
            existingRecipe.Ingredients = recipe.Ingredients;

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteRecipe(int id)
        {
            var recipe = recipes.Find(r => r.Id == id);
            if (recipe == null)
            {
                return NotFound();
            }

            recipes.Remove(recipe);

            return NoContent();
        }

        [HttpPost("{id}/ingredients")]
        public ActionResult<RecipeIngredient> AddIngredientToRecipe(int id, RecipeIngredient ingredient)
        {
            var recipe = recipes.Find(r => r.Id == id);
            if (recipe == null)
            {
                return NotFound();
            }

            // Assign RecipeId and a new ID
            ingredient.RecipeId = id;
            ingredient.Id = recipe.Ingredients?.Count > 0 ? recipe.Ingredients.Max(i => i.Id) + 1 : 1;
            recipe.Ingredients?.Add(ingredient);

            return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, ingredient);
        }

        [HttpDelete("{recipeId}/ingredients/{ingredientId}")]
        public IActionResult DeleteIngredientFromRecipe(int recipeId, int ingredientId)
        {
            var recipe = recipes.Find(r => r.Id == recipeId);
            if (recipe == null)
            {
                return NotFound();
            }

            var ingredientToRemove = recipe.Ingredients?.Find(i => i.Id == ingredientId);
            if (ingredientToRemove == null)
            {
                return NotFound();
            }

            recipe.Ingredients?.Remove(ingredientToRemove);

            return NoContent();
        }
    }
}
