import React from 'react';
import type { Ingredient } from '../types';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface IngredientItemProps {
  ingredient: Ingredient;
  onDelete?: (ingredientId: number) => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({ ingredient, onDelete }) => {
  return (
    <li className="flex justify-between items-center p-2 mb-2 bg-secondary border rounded-md">
      <span className="text-secondary-foreground">
        {ingredient.ingredientName}: {ingredient.quantity}
      </span>
      {onDelete && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(ingredient.id)}
          className="text-destructive hover:text-destructive/90"
          aria-label={`Eliminar ingrediente ${ingredient.ingredientName}`}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </li>
  );
};

export default IngredientItem;
