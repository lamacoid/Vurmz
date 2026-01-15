import { Navigation } from "@/components/Navigation";
import { DishesPage } from "@/components/DishesPage";
import { getDishes } from "../actions/dishes";

export default async function Dishes() {
  const dishes = await getDishes();

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <DishesPage dishes={dishes} />
        </div>
      </main>
    </>
  );
}
