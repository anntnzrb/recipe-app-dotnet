import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Use Inter and Playfair Display
import "./globals.css";
// Removed React and Link imports as they are not directly used here after removing inline components
// Removed styles import for layout.module.css

// Define fonts and CSS variables
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair'
});

// Navbar and Footer components removed - will be handled separately or integrated

export const metadata: Metadata = {
  title: "Gestor de Recetas", // Translated title
  description: "Administra tus recetas favoritas", // Translated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth"> {/* Changed lang to "es" */}
      {/* Apply font variables and base Tailwind classes */}
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-background text-foreground antialiased`}>
        {/* Use flexbox for layout */}
        <div className="flex min-h-screen flex-col">
          {/* Placeholder for Header component - to be created/migrated later */}
          {/* <Header /> */}
          <main className="flex-1 container py-6 md:py-8"> {/* Add container and padding */}
            {children}
          </main>
          {/* Integrate footer structure with Tailwind */}
          <footer className="border-t py-6 md:py-8">
            <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-center text-sm text-muted-foreground md:text-left">
                {/* Updated and translated copyright text */}
                © {new Date().getFullYear()} Juan Antonio González
              </p>
              {/* Add other footer links/elements if needed */}
            </div>
          </footer>
        </div>
        {/* Removed RecipeProvider wrapper */}
      </body>
    </html>
  );
}
