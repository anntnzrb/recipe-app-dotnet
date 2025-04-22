using Microsoft.EntityFrameworkCore;
using RecipeBack.Models;

namespace RecipeBack.Data
{
    public class RecipeContext(DbContextOptions<RecipeContext> options) : DbContext(options)
    {
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<RecipeIngredient> RecipeIngredients { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        }
    }
}
