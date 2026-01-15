"use server";

import {
  getDishes as getDishesFromStore,
  createDish as createDishInStore,
  toggleFavorite as toggleFavoriteInStore,
  deleteDish as deleteDishFromStore,
} from "@/lib/store";
import { revalidatePath } from "next/cache";

export async function getDishes() {
  return getDishesFromStore();
}

export async function createDish(data: {
  name: string;
  description?: string;
  cuisine?: string;
  difficulty?: string;
  prepTime?: number;
  ingredientIds: string[];
}) {
  const dish = createDishInStore(data);
  revalidatePath("/dishes");
  revalidatePath("/");
  return dish;
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  const dish = toggleFavoriteInStore(id, isFavorite);
  revalidatePath("/dishes");
  return dish;
}

export async function deleteDish(id: string) {
  deleteDishFromStore(id);
  revalidatePath("/dishes");
}
