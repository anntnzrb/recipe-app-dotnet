import React from 'react';
import RecipeForm from '@/components/RecipeForm';
import Link from 'next/link'; // Import Link for back button
import { Button } from "@/components/ui/button"; // Import Button
import { ArrowLeft } from 'lucide-react'; // Icon for back button

// Reason: Provides the page for creating a new recipe using the migrated RecipeForm.

function NewRecipePage() {
  return (
    // Container padding/margin is handled by RootLayout
    <div>
      {/* Back Button - Translated */}
      <Button asChild variant="outline" size="sm" className="mb-4">
        <Link href="/recipes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Recetas
        </Link>
      </Button>

      {/* Recipe Form Component (already migrated) */}
      {/* No initial data and isEditMode is false by default */}
      <RecipeForm />
    </div>
  );
}

export default NewRecipePage;
