import React from 'react';
import type { Ingredient } from '../types';
// Removed CSS Module import: import styles from './IngredientItem.module.css';
import { Button } from "@/components/ui/button"; // Import Button
import { X } from 'lucide-react'; // Import an icon for delete

// Reason: Displays a single ingredient item using Tailwind for layout and shadcn/ui Button.
// Encapsulates the presentation of one ingredient row.

interface IngredientItemProps {
  ingredient: Ingredient;
  onDelete?: (ingredientId: number) => void; // Optional delete handler
}

const IngredientItem: React.FC<IngredientItemProps> = ({ ingredient, onDelete }) => {
  return (
    // Use flexbox, padding, margin, background, border, rounded corners
    <li className="flex justify-between items-center p-2 mb-2 bg-secondary border rounded-md">
      {/* Apply text color */}
      <span className="text-secondary-foreground">
        {ingredient.ingredientName}: {ingredient.quantity}
      </span>
      {onDelete && (
        // Use shadcn/ui Button for delete action
        <Button
          type="button"
          variant="ghost" // Use ghost variant for less emphasis
          size="icon" // Make it icon-sized
          onClick={() => onDelete(ingredient.id)}
          className="text-destructive hover:text-destructive/90" // Apply destructive color
          aria-label={`Eliminar ingrediente ${ingredient.ingredientName}`} // Translated aria-label
        >
          <X className="h-4 w-4" /> {/* Use X icon */}
        </Button>
      )}
    </li>
  );
};

export default IngredientItem;
