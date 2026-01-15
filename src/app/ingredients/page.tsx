import { Navigation } from "@/components/Navigation";
import { IngredientsPage } from "@/components/IngredientsPage";
import { getIngredientsGroupedByCategory } from "../actions/ingredients";

export default async function Ingredients() {
  const ingredientsByCategory = await getIngredientsGroupedByCategory();

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <IngredientsPage ingredientsByCategory={ingredientsByCategory} />
        </div>
      </main>
    </>
  );
}
