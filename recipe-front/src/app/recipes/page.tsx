'use client';

import React, { useState, useEffect } from 'react';
import RecipeList from '@/components/RecipeList';
import { recipeService } from '@/services/recipeService';
import type { Recipe } from '@/types';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Loader2 } from 'lucide-react';

function RecipesPage() {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      setError(null);
      try {
        const fetchedRecipes = await recipeService.getAllRecipes(searchTerm);
        const sortedRecipes = fetchedRecipes.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
        setRecipes(sortedRecipes);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
        setError("Ocurrió un error al cargar las recetas.");
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [searchTerm]);

  const handleToggleFavorite = (recipeId: number, newIsFavorite: boolean) => {
    setRecipes(prevRecipes => {
      const updatedRecipes = prevRecipes.map(recipe =>
        recipe.id === recipeId ? { ...recipe, isFavorite: newIsFavorite } : recipe
      );
      const sortedRecipes = updatedRecipes.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
      return sortedRecipes;
    });
  };

  return (
    <div>
      { }
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-2xl font-bold">🍲 Recetas</h1>
        <Button asChild>
          <Link href="/recipes/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Nueva Receta
          </Link>
        </Button>
      </div>

      { }
      <div className="mb-6 relative min-h-[40px]"> { }
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar recetas por nombre..."
          className="pl-8 w-full"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>

      { }
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Cargando recetas...</span>
        </div>
      )}

      { }
      {!loading && error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 p-3 rounded-md mb-4">
          {error}
        </p>
      )}

      { }
      {!loading && !error && (
        recipes.length > 0
          ? <RecipeList recipes={recipes} onFavoriteToggle={handleToggleFavorite} />
          : (
            <p className="text-center text-muted-foreground py-4">
              {searchTerm
                ? `No se encontraron recetas para "${searchTerm}".`
                : "No hay recetas disponibles."}
            </p>
          )
      )}
    </div>
  );
}

export default RecipesPage;
