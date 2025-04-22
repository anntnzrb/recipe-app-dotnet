using Microsoft.AspNetCore.Mvc;
using asp_demo.Models;
using Microsoft.EntityFrameworkCore;
using asp_demo.Data;

namespace asp_demo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController(RecipeContext context) : ControllerBase
    {
        private readonly RecipeContext _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes()
        {
            return await _context.Recipes.Include(r => r.Ingredients).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Recipe>> GetRecipe(int id)
        {
            var recipe = await _context.Recipes.Include(r => r.Ingredients).FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
            {
                return NotFound();
            }

            return recipe;
        }

        [HttpPost]
        public async Task<ActionResult<Recipe>> CreateRecipe(Recipe recipe)
        {
            if (string.IsNullOrEmpty(recipe.Name) || string.IsNullOrEmpty(recipe.Description))
            {
                return BadRequest("Recipe name and description are required.");
            }

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, recipe);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecipe(int id, Recipe recipe)
        {
            if (id != recipe.Id)
            {
                return BadRequest("Recipe ID in the URL does not match the ID in the request body.");
            }

            if (string.IsNullOrEmpty(recipe.Name) || string.IsNullOrEmpty(recipe.Description))
            {
                return BadRequest("Recipe name and description are required.");
            }

            var existingRecipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == id);

            if (existingRecipe == null)
            {
                return NotFound();
            }

            existingRecipe.Name = recipe.Name;
            existingRecipe.Description = recipe.Description;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecipeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool RecipeExists(int id)
        {
            return _context.Recipes.Any(e => e.Id == id);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null)
            {
                return NotFound();
            }

            _context.Recipes.Remove(recipe); // Mark for removal
            await _context.SaveChangesAsync(); // Save changes (will cascade delete ingredients)

            return NoContent();
        }

        [HttpPost("{id}/ingredients")]
        public async Task<ActionResult<RecipeIngredient>> AddIngredientToRecipe(int id, RecipeIngredient ingredient)
        {
            var recipe = await _context.Recipes.Include(r => r.Ingredients).FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
            {
                return NotFound();
            }

            ingredient.RecipeId = id;

            if (recipe.Ingredients == null)
            {
                recipe.Ingredients = new List<RecipeIngredient>();
            }
            recipe.Ingredients.Add(ingredient);

            await _context.SaveChangesAsync();

            var addedIngredient = await _context.RecipeIngredients.FindAsync(ingredient.Id);


            return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, addedIngredient);
        }

        [HttpDelete("{recipeId}/ingredients/{ingredientId}")]
        public async Task<IActionResult> DeleteIngredientFromRecipe(int recipeId, int ingredientId)
        {
            var ingredientToRemove = await _context.RecipeIngredients.FirstOrDefaultAsync(i => i.RecipeId == recipeId && i.Id == ingredientId);

            if (ingredientToRemove == null)
            {
                return NotFound();
            }

            _context.RecipeIngredients.Remove(ingredientToRemove);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
