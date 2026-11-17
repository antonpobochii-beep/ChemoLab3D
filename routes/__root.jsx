import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/AuthContext";
import { Base44Scripts } from "base44:document";
import appCss from "@/index.css?url";

export const Route = createRootRoute({
  // Per-page <title>/meta come from each route's head(); this is the shared base.
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Wirtualne Laboratorium Chemiczne 3D - Sieci Jonowe i Cząsteczki" },
      {
        name: "description",
        content:
          "Interaktywna aplikacja do nauki chemii 3D. Przeglądaj miliony związków z bazy PubChem, badaj struktury jonowe bez błędnych cząsteczek i ucz się z podglądem IUPAC.",
      },
      {
        name: "keywords",
        content:
          "chemia 3d, modele cząsteczek, sieć krystaliczna NaCl, wzory strukturalne, IUPAC, PubChem, nauka chemii, laboratorium chemiczne online",
      },
      { name: "robots", content: "index, follow" },
      { name: "author", content: "ChemoLab 3D" },
      { name: "theme-color", content: "#070c16" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "ChemoLab 3D" },
      { property: "og:locale", content: "pl_PL" },
      {
        property: "og:title",
        content: "ChemoLab 3D — modele cząsteczek, sieci jonowe i układ okresowy",
      },
      {
        property: "og:description",
        content:
          "Interaktywne modele 3D chemii nieorganicznej: sole i wodorotlenki jako sieci jonowe, cząsteczki kowalencyjne, nazwy IUPAC z PubChem, fiszki i quizy.",
      },
      { property: "og:url", content: "https://chem-lab-view.base44.app" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ChemoLab 3D — wirtualne laboratorium chemiczne" },
      {
        name: "twitter:description",
        content:
          "Obróć model 3D, sprawdź wzór kanoniczny i zapis Lewisa, sprawdź związek w PubChem.",
      },
    ],
    // No icon link: the platform adds the app's logo when serving.
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}

// The document. There is no index.html: the server renders <html> from here.
function RootDocument({ children }) {
  return (
    <html lang="pl">
      <head>
        <HeadContent />
      </head>
      {/* data-react-root: the builder's preview bridge looks for #root and falls back to this. */}
      <body data-react-root="true">
        {children}
        <Base44Scripts />
        <Scripts />
      </body>
    </html>
  );
}