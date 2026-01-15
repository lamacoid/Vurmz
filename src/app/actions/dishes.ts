"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getDishes() {
  return prisma.dish.findMany({
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createDish(data: {
  name: string;
  description?: string;
  cuisine?: string;
  difficulty?: string;
  prepTime?: number;
  ingredientIds: string[];
}) {
  const { ingredientIds, ...dishData } = data;

  const dish = await prisma.dish.create({
    data: {
      ...dishData,
      ingredients: {
        create: ingredientIds.map((ingredientId) => ({
          ingredientId,
        })),
      },
    },
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });

  revalidatePath("/dishes");
  revalidatePath("/");
  return dish;
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  const dish = await prisma.dish.update({
    where: { id },
    data: { isFavorite },
  });
  revalidatePath("/dishes");
  return dish;
}

export async function deleteDish(id: string) {
  await prisma.dish.delete({
    where: { id },
  });
  revalidatePath("/dishes");
}
