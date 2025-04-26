import React, { useState, MouseEvent } from 'react'; // Import useState and MouseEvent
import type { Recipe } from '../types';
import Link from 'next/link';
import { recipeService } from '../services/recipeService'; // Import recipeService
import { useToast } from "@/hooks/use-toast"; // Import useToast
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Import Card components

// Reason: Represents a single item in the recipe list using shadcn/ui Card.
// Encapsulates the display logic for one recipe summary.

interface RecipeListItemProps {
  recipe: Recipe;
  // Add an optional callback to notify the parent list about the change
  onFavoriteToggle?: (recipeId: number, newIsFavorite: boolean) => void;
}

const RecipeListItem: React.FC<RecipeListItemProps> = ({ recipe, onFavoriteToggle }) => {
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite); // Local state for immediate UI update
  const { toast } = useToast(); // Hook for showing notifications

  // Reason: Handles the click on the favorite star, calls the API, updates local state, and shows feedback.
  const handleToggleFavorite = async (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling up to the Link

    const newIsFavorite = !isFavorite; // Determine the new state first
    setIsFavorite(newIsFavorite); // Optimistically update the UI

    // Notify parent component immediately if callback is provided
    if (onFavoriteToggle) {
      onFavoriteToggle(recipe.id, newIsFavorite);
    }

    try {
      // Call the API to persist the change. We don't need the return value here.
      await recipeService.toggleFavorite(recipe.id);

      // Show success toast based on the new state
      toast({
        title: "Success",
        description: `Recipe "${recipe.name}" ${newIsFavorite ? 'added to' : 'removed from'} favorites.`,
      });
    } catch (error) {
      console.error("Failed to toggle favorite status:", error);
      // Revert the optimistic update on error
      setIsFavorite(!newIsFavorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(recipe.id, !newIsFavorite); // Also notify parent of revert
      }
      toast({
        title: "Error",
        description: "Could not update favorite status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    // Replace div with Card, apply margin and hover effect
    <Card className="mb-4 transition-shadow hover:shadow-md relative"> {/* Added relative positioning */}
      {/* Link wraps the content, add group for hover effect */}
      <Link href={`/recipes/${recipe.id}`} className="group block">
        <CardHeader className="flex flex-row justify-between items-start"> {/* Use flexbox for layout */}
          <div> {/* Container for title and description */}
            {/* Use CardTitle with Tailwind classes and hover effect */}
            <CardTitle className="text-lg group-hover:underline">{recipe.name}</CardTitle>
            {/* Use CardDescription for the description */}
            <CardDescription className="text-sm pt-1">{recipe.description}</CardDescription>
          </div>
          {/* Favorite Indicator */}
          <span
            onClick={handleToggleFavorite}
            className="cursor-pointer text-xl ml-4 pt-1 text-yellow-500 hover:text-yellow-400 transition-colors" // Adjusted styling and position
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            role="button"
          >
            {isFavorite ? '★' : '☆'}
          </span>
        </CardHeader>
        {/* Potential place for CardContent or CardFooter if more details/actions were needed */}
      </Link>
    </Card>
  );
};

export default RecipeListItem;
