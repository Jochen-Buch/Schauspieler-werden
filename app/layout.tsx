
export const metadata = {
  title: "Der Verbotene Winkel – Hogwarts Buchladen",
  description: "Stöbere in magischen Regalen – Demo-Webapp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="dark">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
