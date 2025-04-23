import React from 'react';
import RecipeForm from '@/components/RecipeForm';

// Reason: Provides the page for creating a new recipe.
// It renders the reusable RecipeForm component in 'create' mode.

function NewRecipePage() {
  return (
    <div>
      {/* No initial data and isEditMode is false by default */}
      <RecipeForm />
    </div>
  );
}

export default NewRecipePage;
