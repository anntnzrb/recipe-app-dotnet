using RecipeBack.Data;
using RecipeBack.Models;
using Microsoft.EntityFrameworkCore;

namespace RecipeBack.Services
{
    public class RecipeService(RecipeContext context) : IRecipeService
    {
        private readonly RecipeContext _context = context;

        public async Task<IEnumerable<Recipe>> GetAllRecipesAsync(string? name = null)
        {
            // Reason: Eager load ingredients to prevent N+1 queries when accessing recipe details later.
            var query = _context.Recipes.Include(r => r.Ingredients).AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
            {
                // Reason: Filter recipes by name, case-insensitive.
                query = query.Where(r => r.Name.Contains(name, StringComparison.OrdinalIgnoreCase));
            }

            return await query.ToListAsync();
        }

        public async Task<Recipe?> GetRecipeByIdAsync(int id)
        {
            // Reason: Eager load ingredients for the specific recipe being requested.
            return await _context.Recipes.Include(r => r.Ingredients).FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Recipe> CreateRecipeAsync(Recipe recipe)
        {
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();
            return recipe;
        }

        public async Task<bool> UpdateRecipeAsync(int id, Recipe recipe)
        {
            // FIX: Need to include existing ingredients to compare
            var existingRecipe = await _context.Recipes
                                            .Include(r => r.Ingredients) // Eager load current ingredients
                                            .FirstOrDefaultAsync(r => r.Id == id);


            if (existingRecipe == null)
            {
                return false; // indicates recipe not found
            }

            // Update basic properties
            existingRecipe.Name = recipe.Name;
            existingRecipe.Description = recipe.Description;

            // --- START: Add logic to handle ingredient updates ---

            // Simple approach: Replace all existing ingredients with the new list
            // This handles adds, updates (by replacing), and deletes (by not including them)

            // 1. Remove existing ingredients tracked by the context for this recipe
            if (existingRecipe.Ingredients != null)
            {
                _context.RecipeIngredients.RemoveRange(existingRecipe.Ingredients);
            }

            // 2. Add the ingredients from the incoming 'recipe' object
            //    Ensure the RecipeId is set correctly for the relationship.
            if (recipe.Ingredients != null)
            {
                foreach (var incomingIngredient in recipe.Ingredients)
                {
                    // We ignore the ID sent from the client (which was 0 for new ones)
                    // and let EF Core handle creating new ingredient records.
                    // We MUST set the RecipeId to link it correctly.
                    _context.RecipeIngredients.Add(new RecipeIngredient
                    {
                        IngredientName = incomingIngredient.IngredientName, // Use correct property name
                        Quantity = incomingIngredient.Quantity,
                        RecipeId = existingRecipe.Id // Link to the existing recipe
                    });
                }
            }
            // No need to explicitly assign to existingRecipe.Ingredients if using AddRange/RemoveRange
            // else
            // {
            //     existingRecipe.Ingredients = new List<RecipeIngredient>(); // Ensure it's an empty list if null was sent
            // }


            // --- END: Add logic to handle ingredient updates ---


            try
            {
                await _context.SaveChangesAsync();
                return true; // success
            }
            catch (DbUpdateConcurrencyException)
            {
                // check if the recipe still exists after the concurrency exception
                if (!await RecipeExistsAsync(id))
                {
                    return false; // indicates recipe not found due to concurrency delete
                }
                else
                {
                    throw; // Re-throw if it exists but another concurrency issue occurred
                }
            }
        }

        public async Task<bool> DeleteRecipeAsync(int id)
        {
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null)
            {
                return false; // indicates recipe not found
            }

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
            return true; // success
        }

        public async Task<RecipeIngredient?> AddIngredientToRecipeAsync(int recipeId, RecipeIngredient ingredient)
        {
            var recipe = await _context.Recipes.Include(r => r.Ingredients).FirstOrDefaultAsync(r => r.Id == recipeId);

            if (recipe == null)
            {
                return null; // indicates recipe not found
            }

            ingredient.RecipeId = recipeId; // ensures foreign key is set

            recipe.Ingredients ??= [];
            recipe.Ingredients.Add(ingredient);

            await _context.SaveChangesAsync();

            // return the added ingredient with its generated id
            return ingredient;
        }

        public async Task<bool> DeleteIngredientFromRecipeAsync(int recipeId, int ingredientId)
        {
            var ingredientToRemove = await _context.RecipeIngredients.FirstOrDefaultAsync(i => i.RecipeId == recipeId && i.Id == ingredientId);

            if (ingredientToRemove == null)
            {
                return false; // indicates ingredient not found
            }

            _context.RecipeIngredients.Remove(ingredientToRemove);
            await _context.SaveChangesAsync();
            return true; // success
        }

        // Helper method to check existence, used for concurrency handling
        private async Task<bool> RecipeExistsAsync(int id)
        {
            return await _context.Recipes.AnyAsync(e => e.Id == id);
        }
    }
}
