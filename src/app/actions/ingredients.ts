"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getIngredients() {
  return prisma.ingredient.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
}

export async function getIngredientsGroupedByCategory() {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const grouped: Record<string, typeof ingredients> = {};
  for (const ingredient of ingredients) {
    if (!grouped[ingredient.category]) {
      grouped[ingredient.category] = [];
    }
    grouped[ingredient.category].push(ingredient);
  }
  return grouped;
}

export async function addIngredient(data: {
  name: string;
  category: string;
  emoji?: string;
}) {
  const ingredient = await prisma.ingredient.create({
    data,
  });
  revalidatePath("/ingredients");
  revalidatePath("/");
  return ingredient;
}

export async function toggleIngredientStock(id: string, inStock: boolean) {
  const ingredient = await prisma.ingredient.update({
    where: { id },
    data: { inStock },
  });
  revalidatePath("/ingredients");
  revalidatePath("/");
  return ingredient;
}

export async function deleteIngredient(id: string) {
  await prisma.ingredient.delete({
    where: { id },
  });
  revalidatePath("/ingredients");
  revalidatePath("/");
}
