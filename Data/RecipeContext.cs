using Microsoft.EntityFrameworkCore;
using asp_demo.Models;

namespace asp_demo.Data
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
