import { Navigation } from "@/components/Navigation";
import { BrainstormPage } from "@/components/BrainstormPage";
import { getIngredientsGroupedByCategory } from "./actions/ingredients";

export default async function Home() {
  const ingredientsByCategory = await getIngredientsGroupedByCategory();

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <BrainstormPage ingredientsByCategory={ingredientsByCategory} />
        </div>
      </main>
    </>
  );
}
