import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getCurrentUserId } from "../../lib/current-user";
import { createBook, deleteBook, updateBook } from "./actions";

export const dynamic = "force-dynamic";

const statusOptions = [
  { value: "ALL", label: "All statuses" },
  { value: "WANT_TO_READ", label: "Want to read" },
  { value: "READING", label: "Reading" },
  { value: "COMPLETED", label: "Completed" }
];

const sortOptions = [
  { value: "updated_desc", label: "Recently updated" },
  { value: "created_desc", label: "Recently added" },
  { value: "title_asc", label: "Title A-Z" },
  { value: "rating_desc", label: "Top rated" }
];

function statusLabel(status) {
  return statusOptions.find((option) => option.value === status)?.label || status;
}

function dateInputValue(value) {
  return value ? value.toISOString().slice(0, 10) : "";
}

function readParam(value) {
  return typeof value === "string" ? value : "";
}

function resolveSort(sort) {
  if (sort === "created_desc") {
    return { createdAt: "desc" };
  }

  if (sort === "title_asc") {
    return { title: "asc" };
  }

  if (sort === "rating_desc") {
    return [{ rating: "desc" }, { updatedAt: "desc" }];
  }

  return { updatedAt: "desc" };
}

export default async function BooksPage({ searchParams }) {
  const userId = await getCurrentUserId();
  const query = readParam(searchParams?.q).trim();
  const selectedStatus = readParam(searchParams?.status);
  const selectedSort = readParam(searchParams?.sort);
  const statusFilter = statusOptions.some((option) => option.value === selectedStatus)
    ? selectedStatus
    : "ALL";
  const sort = sortOptions.some((option) => option.value === selectedSort) ? selectedSort : "updated_desc";

  const where = {
    userId,
    ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { author: { contains: query, mode: "insensitive" } },
            { notes: { contains: query, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const books = await prisma.book.findMany({
    where,
    orderBy: resolveSort(sort)
  });

  const totals = books.reduce(
    (acc, book) => {
      acc.total += 1;
      acc[book.status] += 1;
      return acc;
    },
    { total: 0, WANT_TO_READ: 0, READING: 0, COMPLETED: 0 }
  );

  return (
    <main className="page books-page">
      <section className="hero hero-left">
        <p className="eyebrow">Books</p>
        <h1>Reading tracker</h1>
        <p className="subtitle">Capture your queue, current reads, and completed books in one place.</p>
        <div className="hero-actions">
          <Link className="text-link" href="/">
            Back to dashboard
          </Link>
        </div>
      </section>

      <section className="stats-row" aria-label="Reading totals">
        <article className="stat-card">
          <p>Total</p>
          <strong>{totals.total}</strong>
        </article>
        <article className="stat-card">
          <p>Want to read</p>
          <strong>{totals.WANT_TO_READ}</strong>
        </article>
        <article className="stat-card">
          <p>Reading</p>
          <strong>{totals.READING}</strong>
        </article>
        <article className="stat-card">
          <p>Completed</p>
          <strong>{totals.COMPLETED}</strong>
        </article>
      </section>

      <section className="card book-form-card" aria-label="Add a new book">
        <h2>Add book</h2>
        <form action={createBook} className="book-form">
          <input name="title" type="text" placeholder="Title" required />
          <input name="author" type="text" placeholder="Author" />
          <select name="status" defaultValue="WANT_TO_READ">
            {statusOptions
              .filter((option) => option.value !== "ALL")
              .map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
              ))}
          </select>
          <input name="totalPages" type="number" min="1" placeholder="Total pages" />
          <input name="currentPage" type="number" min="0" placeholder="Current page" />
          <input name="rating" type="number" min="1" max="5" placeholder="Rating (1-5)" />
          <input name="startedAt" type="date" />
          <input name="finishedAt" type="date" />
          <textarea name="notes" placeholder="Notes" rows={2} />
          <button type="submit">Save book</button>
        </form>
      </section>

      <section className="card" aria-label="Filter books">
        <form className="book-form">
          <input type="search" name="q" defaultValue={query} placeholder="Search title, author, notes" />
          <select name="status" defaultValue={statusFilter}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select name="sort" defaultValue={sort}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button type="submit">Apply</button>
          <Link href="/books" className="text-link">
            Reset
          </Link>
        </form>
      </section>

      <section className="grid" aria-label="Books list">
        {books.length === 0 ? <p className="empty-state">No books match this filter yet.</p> : null}
        {books.map((book) => {
          const updateAction = updateBook.bind(null, book.id);
          const removeAction = deleteBook.bind(null, book.id);

          return (
            <article key={book.id} className="card book-card">
              <div className="book-card-head">
                <h2>{book.title}</h2>
                <span className="status-pill">{statusLabel(book.status)}</span>
              </div>

              <form action={updateAction} className="book-form compact">
                <input name="title" type="text" defaultValue={book.title} required />
                <input name="author" type="text" defaultValue={book.author || ""} placeholder="Author" />
                <select name="status" defaultValue={book.status}>
                  {statusOptions
                    .filter((option) => option.value !== "ALL")
                    .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                    ))}
                </select>
                <input
                  name="totalPages"
                  type="number"
                  min="1"
                  defaultValue={book.totalPages || ""}
                  placeholder="Total pages"
                />
                <input
                  name="currentPage"
                  type="number"
                  min="0"
                  defaultValue={book.currentPage || ""}
                  placeholder="Current page"
                />
                <input
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  defaultValue={book.rating || ""}
                  placeholder="Rating"
                />
                <input name="startedAt" type="date" defaultValue={dateInputValue(book.startedAt)} />
                <input name="finishedAt" type="date" defaultValue={dateInputValue(book.finishedAt)} />
                <textarea name="notes" defaultValue={book.notes || ""} rows={2} placeholder="Notes" />
                <div className="form-actions">
                  <button type="submit">Update</button>
                  <button type="submit" formAction={removeAction} className="button-muted">
                    Delete
                  </button>
                </div>
              </form>
            </article>
          );
        })}
      </section>
    </main>
  );
}
