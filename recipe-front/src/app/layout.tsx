import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: "Gestor de Recetas",
  description: "Administra tus recetas favoritas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      { }
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-background text-foreground antialiased`}>
        { }
        <div className="flex min-h-screen flex-col">
          { }
          { }
          <main className="flex-1 container py-6 md:py-8"> { }
            {children}
          </main>
          { }
          <footer className="border-t py-6 md:py-8">
            <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-center text-sm text-muted-foreground md:text-left">
                { }
                © {new Date().getFullYear()} Juan Antonio González
              </p>
              { }
            </div>
          </footer>
        </div>
        { }
      </body>
    </html>
  );
}
