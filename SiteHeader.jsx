import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, LogIn, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OfflineExportButton from "@/components/lab/OfflineExportButton";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const links = [
  { to: "/narzedzia", label: "Wszystko" },
  { to: "/zwiazki", label: "Związki" },
  { to: "/uklad-okresowy", label: "Układ okresowy" },
  { to: "/reakcje", label: "Reakcje 3D" },
  { to: "/zjawiska", label: "Zjawiska" },
  { to: "/ukladanie", label: "Układanie" },
  { to: "/ukladanie-3d", label: "Tryb 3D" },
  { to: "/ar", label: "Tryb AR" },
];

const MENU = [
  {
    title: "Nauka",
    items: [
      { to: "/narzedzia", label: "Wszystkie narzędzia" },
      { to: "/centrum-wiedzy", label: "Centrum wiedzy" },
      { to: "/slownik-pojec", label: "Słownik pojęć" },
      { to: "/przewodnik-laboratoryjny", label: "Przewodnik laboratoryjny" },
      { to: "/baza-zastosowan", label: "Baza zastosowań" },
    ],
  },
  {
    title: "Narzędzia",
    items: [
      { to: "/reakcje", label: "Reakcje 3D" },
      { to: "/ar", label: "Tryb AR" },
      { to: "/bilansowanie", label: "Bilansowanie redox" },
      { to: "/rozpuszczalnosc", label: "Tabela rozpuszczalności" },
      { to: "/miareczkowanie", label: "Miareczkowanie" },
      { to: "/stechiometria-reakcji", label: "Stechiometria reakcji" },
      { to: "/speedrun", label: "Speedrun 60 s" },
      { to: "/quizy", label: "Laboratorium quizów" },
      { to: "/quiz-na-zywo", label: "Quiz na żywo (QR)" },
      { to: "/porownanie", label: "Porównanie związków" },
      { to: "/kalkulator-wartosciowosci", label: "Kalkulator wartościowości" },
      { to: "/generator-wzorow", label: "Generator wzorów" },
    ],
  },
  {
    title: "Twoje laboratorium",
    items: [
      { to: "/moje-ulubione", label: "Moje ulubione" },
      { to: "/archiwum-eksperymentow", label: "Archiwum eksperymentów" },
      { to: "/panel-statystyk", label: "Panel statystyk" },
      { to: "/ustawienia", label: "Ustawienia" },
      { to: "/centrum-pomocy", label: "Centrum pomocy" },
    ],
  },
];

export default function SiteHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { user, isAuthenticated, isLoadingAuth, navigateToLogin, logout } = useAuth();

  const inMenu = MENU.some((group) => group.items.some((item) => pathname === item.to));

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-2 gap-y-2 px-5 py-2.5 sm:h-16 sm:flex-nowrap sm:px-8 sm:py-0">
        <Link to="/" className="group flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/40 shadow-glow-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path
                d="M9 3h6M10 3v5.2L5.6 16a3 3 0 0 0 2.6 4.5h7.6a3 3 0 0 0 2.6-4.5L14 8.2V3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10.5" cy="15" r="1" fill="currentColor" stroke="none" />
              <circle cx="14" cy="17.5" r="0.9" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold tracking-[0.02em]">
              Chemia <span className="text-primary">3D</span>
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.28em] text-primary/60 sm:block">
              lab interaktywny
            </span>
          </span>
        </Link>

        <div className="order-3 flex w-full items-center gap-1.5 sm:order-2 sm:w-auto">
          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-full border border-border/70 bg-card/60 p-1 backdrop-blur sm:flex-none">
            {links.map((link) => {
              const active = pathname === link.to || pathname.startsWith(`${link.to}/`);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1.5 text-[12px] transition-colors sm:px-3.5 sm:text-[13px]",
                    active
                      ? "bg-primary text-primary-foreground shadow-glow-sm"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-2 text-[12px] transition-colors sm:text-[13px]",
                inMenu
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/70 bg-card/60 text-muted-foreground hover:text-foreground"
              )}
            >
              Więcej
              <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              {MENU.map((group, index) => (
                <div key={group.title}>
                  {index > 0 ? <DropdownMenuSeparator /> : null}
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {group.title}
                  </DropdownMenuLabel>
                  {group.items.map((item) => (
                    <DropdownMenuItem key={item.to} asChild>
                      <Link
                        to={item.to}
                        className={cn(
                          "w-full cursor-pointer text-sm",
                          pathname === item.to && "text-primary"
                        )}
                      >
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="order-2 flex shrink-0 items-center gap-2 sm:order-3">
          <OfflineExportButton />
          {isLoadingAuth ? (
            <span className="h-8 w-8 animate-pulse rounded-full bg-secondary" />
          ) : isAuthenticated && user ? (
            <>
              <span className="hidden max-w-[140px] truncate text-xs text-muted-foreground lg:block">
                {user.full_name || user.email}
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-3 py-2 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
                Wyloguj
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigateToLogin()}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-[12px] font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5 sm:text-[13px]"
            >
              <LogIn className="h-3.5 w-3.5" />
              Zaloguj
            </button>
          )}
        </div>
      </div>
    </header>
  );
}