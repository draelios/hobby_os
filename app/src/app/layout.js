import "./globals.css";

export const metadata = {
  title: "Hobby OS",
  description: "Manage books, recipes, and finances from one self-hosted app"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
