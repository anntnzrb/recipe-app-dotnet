namespace RecipeBack.Models
{
    public class RecipeIngredient
    {
        public int Id { get; set; }
        public int RecipeId { get; set; }
        public string? IngredientName { get; set; }
        public string? Quantity { get; set; }
    }
}
