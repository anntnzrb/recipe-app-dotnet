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
                string lowerSearchTerm = name.ToLower(); // convert search term to lower case
                query = query.Where(r => (r.Name != null && r.Name.Contains(lowerSearchTerm, StringComparison.CurrentCultureIgnoreCase)) ||
                                         (r.Description != null && r.Description.Contains(lowerSearchTerm, StringComparison.CurrentCultureIgnoreCase)));
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
            var existingRecipe = await _context.Recipes
                                            .Include(r => r.Ingredients) // Eager load current ingredients
                                            .FirstOrDefaultAsync(r => r.Id == id);


            if (existingRecipe == null)
            {
                return false; // indicates recipe not found
            }

            existingRecipe.Name = recipe.Name;
            existingRecipe.Description = recipe.Description;

            if (existingRecipe.Ingredients != null)
            {
                _context.RecipeIngredients.RemoveRange(existingRecipe.Ingredients);
            }

            if (recipe.Ingredients != null)
            {
                foreach (var incomingIngredient in recipe.Ingredients)
                {
                    _context.RecipeIngredients.Add(new RecipeIngredient
                    {
                        IngredientName = incomingIngredient.IngredientName, // Use correct property name
                        Quantity = incomingIngredient.Quantity,
                        RecipeId = existingRecipe.Id
                    });
                }
            }
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

        // helper method to check existence, used for concurrency handling
        private async Task<bool> RecipeExistsAsync(int id)
        {
            return await _context.Recipes.AnyAsync(e => e.Id == id);
        }
        public async Task<bool> ToggleFavoriteAsync(int id)
        {
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null)
            {
                return false; // recipe not found
            }

            recipe.IsFavorite = !recipe.IsFavorite;
            await _context.SaveChangesAsync();
            return true; // success
        }
    }
}
