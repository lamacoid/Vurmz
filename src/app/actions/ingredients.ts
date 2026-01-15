"use server";

import {
  getIngredients as getIngredientsFromStore,
  getIngredientsGroupedByCategory as getGroupedFromStore,
  addIngredient as addIngredientToStore,
  toggleIngredientStock as toggleStock,
  deleteIngredient as deleteFromStore,
} from "@/lib/store";
import { revalidatePath } from "next/cache";

export async function getIngredients() {
  return getIngredientsFromStore();
}

export async function getIngredientsGroupedByCategory() {
  return getGroupedFromStore();
}

export async function addIngredient(data: {
  name: string;
  category: string;
  emoji?: string;
}) {
  const ingredient = addIngredientToStore(data);
  revalidatePath("/ingredients");
  revalidatePath("/");
  return ingredient;
}

export async function toggleIngredientStock(id: string, inStock: boolean) {
  const ingredient = toggleStock(id, inStock);
  revalidatePath("/ingredients");
  revalidatePath("/");
  return ingredient;
}

export async function deleteIngredient(id: string) {
  deleteFromStore(id);
  revalidatePath("/ingredients");
  revalidatePath("/");
}
