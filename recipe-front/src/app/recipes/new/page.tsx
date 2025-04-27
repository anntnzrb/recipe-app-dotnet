import React from 'react';
import RecipeForm from '@/components/RecipeForm';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

function NewRecipePage() {
  return (
    <div>
      { }
      <Button asChild variant="outline" size="sm" className="mb-4">
        <Link href="/recipes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Recetas
        </Link>
      </Button>

      { }
      { }
      <RecipeForm />
    </div>
  );
}

export default NewRecipePage;
