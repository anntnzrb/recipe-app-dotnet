import React, { useState, MouseEvent } from 'react';
import type { Recipe } from '../types';
import Link from 'next/link';
import { recipeService } from '../services/recipeService';
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface RecipeListItemProps {
  recipe: Recipe;
  onFavoriteToggle?: (recipeId: number, newIsFavorite: boolean) => void;
}

const RecipeListItem: React.FC<RecipeListItemProps> = ({ recipe, onFavoriteToggle }) => {
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite);
  const { toast } = useToast();

  const handleToggleFavorite = async (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);

    if (onFavoriteToggle) {
      onFavoriteToggle(recipe.id, newIsFavorite);
    }

    try {
      await recipeService.toggleFavorite(recipe.id);

      toast({
        title: "Success",
        description: `Recipe "${recipe.name}" ${newIsFavorite ? 'added to' : 'removed from'} favorites.`,
      });
    } catch (error) {
      console.error("Failed to toggle favorite status:", error);
      setIsFavorite(!newIsFavorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(recipe.id, !newIsFavorite);
      }
      toast({
        title: "Error",
        description: "Could not update favorite status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-4 transition-shadow hover:shadow-md relative">
      <Link href={`/recipes/${recipe.id}`} className="group block">
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle className="text-lg group-hover:underline">{recipe.name}</CardTitle>
            <CardDescription className="text-sm pt-1">{recipe.description}</CardDescription>
          </div>
          <span
            onClick={handleToggleFavorite}
            className="cursor-pointer text-xl ml-4 pt-1 text-yellow-500 hover:text-yellow-400 transition-colors"
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            role="button"
          >
            {isFavorite ? '★' : '☆'}
          </span>
        </CardHeader>
      </Link>
    </Card>
  );
};

export default RecipeListItem;
