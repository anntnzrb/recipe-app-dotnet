using Microsoft.AspNetCore.Mvc;
using RecipeBack.Models;
using Microsoft.EntityFrameworkCore;
using RecipeBack.Services;

namespace RecipeBack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController(IRecipeService recipeService) : ControllerBase
    {
        private readonly IRecipeService _recipeService = recipeService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes()
        {
            var recipes = await _recipeService.GetAllRecipesAsync();
            return Ok(recipes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Recipe>> GetRecipe(int id)
        {
            var recipe = await _recipeService.GetRecipeByIdAsync(id);

            if (recipe == null)
            {
                return NotFound();
            }

            return recipe;
        }

        [HttpPost]
        public async Task<ActionResult<Recipe>> CreateRecipe([FromBody] Recipe recipe)
        {
            if (string.IsNullOrEmpty(recipe.Name) || string.IsNullOrEmpty(recipe.Description))
            {
                return BadRequest("Recipe name and description are required.");
            }

            var createdRecipe = await _recipeService.CreateRecipeAsync(recipe);

            return CreatedAtAction(nameof(GetRecipe), new { id = createdRecipe.Id }, createdRecipe);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecipe(int id, [FromBody] Recipe recipe)
        {
            if (id != recipe.Id)
            {
                return BadRequest("Recipe ID in the URL does not match the ID in the request body.");
            }

            if (string.IsNullOrEmpty(recipe.Name) || string.IsNullOrEmpty(recipe.Description))
            {
                return BadRequest("Recipe name and description are required.");
            }

            try
            {
                var success = await _recipeService.UpdateRecipeAsync(id, recipe);
                if (!success)
                {
                    return NotFound();
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent(); // success
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var success = await _recipeService.DeleteRecipeAsync(id);

            if (!success)
            {
                return NotFound();
            }

            return NoContent(); // success
        }

        [HttpPost("{id}/ingredients")]
        public async Task<ActionResult<RecipeIngredient>> AddIngredientToRecipe(int id, RecipeIngredient ingredient)
        {
            if (string.IsNullOrEmpty(ingredient.IngredientName) || string.IsNullOrEmpty(ingredient.Quantity)) // Corrected property name
            {
                return BadRequest("Ingredient name and quantity are required.");
            }

            var addedIngredient = await _recipeService.AddIngredientToRecipeAsync(id, ingredient);

            if (addedIngredient == null)
            {
                return NotFound("Recipe not found.");
            }

            return CreatedAtAction(nameof(GetRecipe), new { id = id }, addedIngredient);
        }

        [HttpDelete("{recipeId}/ingredients/{ingredientId}")]
        public async Task<IActionResult> DeleteIngredientFromRecipe(int recipeId, int ingredientId)
        {
            var success = await _recipeService.DeleteIngredientFromRecipeAsync(recipeId, ingredientId);

            if (!success)
            {
                return NotFound("Recipe or Ingredient not found."); // returns false if recipe or ingredient not found
            }

            return NoContent(); // success
        }
    }
}
