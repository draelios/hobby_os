"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";
import { getCurrentUserId } from "../../lib/current-user";

function toIntOrNull(value) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function createBook(formData) {
  const userId = await getCurrentUserId();
  const title = String(formData.get("title") || "").trim();
  const author = String(formData.get("author") || "").trim();
  const status = String(formData.get("status") || "WANT_TO_READ");
  const totalPages = toIntOrNull(formData.get("totalPages"));
  const currentPage = toIntOrNull(formData.get("currentPage"));
  const rating = toIntOrNull(formData.get("rating"));

  if (!title) {
    return;
  }

  await prisma.book.create({
    data: {
      userId,
      title,
      author: author || null,
      status,
      totalPages,
      currentPage,
      rating
    }
  });

  revalidatePath("/books");
}

export async function updateBook(bookId, formData) {
  const title = String(formData.get("title") || "").trim();
  const author = String(formData.get("author") || "").trim();
  const status = String(formData.get("status") || "WANT_TO_READ");
  const totalPages = toIntOrNull(formData.get("totalPages"));
  const currentPage = toIntOrNull(formData.get("currentPage"));
  const rating = toIntOrNull(formData.get("rating"));

  if (!title) {
    return;
  }

  await prisma.book.update({
    where: { id: bookId },
    data: {
      title,
      author: author || null,
      status,
      totalPages,
      currentPage,
      rating
    }
  });

  revalidatePath("/books");
}

export async function deleteBook(bookId) {
  await prisma.book.delete({
    where: { id: bookId }
  });

  revalidatePath("/books");
}
