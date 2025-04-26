namespace RecipeBack.Models
{
    public class Recipe
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public List<RecipeIngredient>? Ingredients { get; set; } = [];
        public bool IsFavorite { get; set; } = false;
    }
}
