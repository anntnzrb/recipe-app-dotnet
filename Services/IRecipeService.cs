using asp_demo.Models;

namespace asp_demo.Services
{
  public interface IRecipeService
  {
    Task<IEnumerable<Recipe>> GetAllRecipesAsync();
    Task<Recipe?> GetRecipeByIdAsync(int id);
    Task<Recipe> CreateRecipeAsync(Recipe recipe);
    Task<bool> UpdateRecipeAsync(int id, Recipe recipe);
    Task<bool> DeleteRecipeAsync(int id);
    Task<RecipeIngredient?> AddIngredientToRecipeAsync(int recipeId, RecipeIngredient ingredient);
    Task<bool> DeleteIngredientFromRecipeAsync(int recipeId, int ingredientId);
  }
}
