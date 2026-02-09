const modules = [
  {
    title: "Books",
    description: "Track reading status, notes, ratings, and goals."
  },
  {
    title: "Recipes",
    description: "Save recipes, plan meals, and generate shopping lists."
  },
  {
    title: "Finances",
    description: "Track income, expenses, budgets, and recurring payments."
  }
];

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Self-hosted dashboard</p>
        <h1>Hobby OS</h1>
        <p className="subtitle">
          One place for your personal projects, knowledge, and routines.
        </p>
      </section>

      <section className="grid" aria-label="Hobby modules">
        {modules.map((item) => (
          <article key={item.title} className="card">
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
