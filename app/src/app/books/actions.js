"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";
import { getCurrentUserId } from "../../lib/current-user";

const allowedStatuses = new Set(["WANT_TO_READ", "READING", "COMPLETED"]);

function toIntOrNull(value) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function toDateOrNull(value) {
  const text = String(value || "").trim();

  if (!text) {
    return null;
  }

  const parsed = new Date(`${text}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeStatus(value) {
  return allowedStatuses.has(value) ? value : "WANT_TO_READ";
}

export async function createBook(formData) {
  const userId = await getCurrentUserId();
  const title = String(formData.get("title") || "").trim();
  const author = String(formData.get("author") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const status = normalizeStatus(String(formData.get("status") || "WANT_TO_READ"));
  const totalPages = toIntOrNull(formData.get("totalPages"));
  const currentPage = toIntOrNull(formData.get("currentPage"));
  const rating = toIntOrNull(formData.get("rating"));
  const startedAt = toDateOrNull(formData.get("startedAt"));
  const finishedAt = toDateOrNull(formData.get("finishedAt"));

  if (!title) {
    return;
  }

  await prisma.book.create({
    data: {
      userId,
      title,
      author: author || null,
      notes: notes || null,
      status,
      totalPages,
      currentPage,
      rating: rating && rating >= 1 && rating <= 5 ? rating : null,
      startedAt,
      finishedAt
    }
  });

  revalidatePath("/books");
}

export async function updateBook(bookId, formData) {
  const userId = await getCurrentUserId();
  const title = String(formData.get("title") || "").trim();
  const author = String(formData.get("author") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const status = normalizeStatus(String(formData.get("status") || "WANT_TO_READ"));
  const totalPages = toIntOrNull(formData.get("totalPages"));
  const currentPage = toIntOrNull(formData.get("currentPage"));
  const rating = toIntOrNull(formData.get("rating"));
  const startedAt = toDateOrNull(formData.get("startedAt"));
  const finishedAt = toDateOrNull(formData.get("finishedAt"));

  if (!title) {
    return;
  }

  await prisma.book.updateMany({
    where: { id: bookId, userId },
    data: {
      title,
      author: author || null,
      notes: notes || null,
      status,
      totalPages,
      currentPage,
      rating: rating && rating >= 1 && rating <= 5 ? rating : null,
      startedAt,
      finishedAt
    }
  });

  revalidatePath("/books");
}

export async function deleteBook(bookId) {
  const userId = await getCurrentUserId();

  await prisma.book.deleteMany({
    where: { id: bookId, userId }
  });

  revalidatePath("/books");
}
