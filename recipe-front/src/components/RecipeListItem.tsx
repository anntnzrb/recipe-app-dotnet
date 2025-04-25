import React from 'react';
import type { Recipe } from '../types';
import Link from 'next/link';
// Removed CSS Module import: import styles from './RecipeListItem.module.css';
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
}

const RecipeListItem: React.FC<RecipeListItemProps> = ({ recipe }) => {
  return (
    // Replace div with Card, apply margin and hover effect
    <Card className="mb-4 transition-shadow hover:shadow-md">
      {/* Link wraps the content, add group for hover effect */}
      <Link href={`/recipes/${recipe.id}`} className="group block">
        <CardHeader>
          {/* Use CardTitle with Tailwind classes and hover effect */}
          <CardTitle className="text-lg group-hover:underline">{recipe.name}</CardTitle>
          {/* Use CardDescription for the description */}
          <CardDescription className="text-sm pt-1">{recipe.description}</CardDescription>
        </CardHeader>
        {/* Potential place for CardContent or CardFooter if more details/actions were needed */}
      </Link>
    </Card>
  );
};

export default RecipeListItem;
