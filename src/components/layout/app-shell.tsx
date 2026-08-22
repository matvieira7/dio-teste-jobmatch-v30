import { Link, useRouterState } from "@tanstack/react-router";
import logoMark from "@/assets/vagamatch-logo.png";
import {
  Bookmark,
  Briefcase,
  FileText,
  Files,
  KanbanSquare,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/jobs", label: "Encontrar vagas", icon: Search },
  { to: "/saved", label: "Minhas vagas", icon: Bookmark },
  { to: "/resume", label: "Meu currículo", icon: FileText },
  { to: "/resume/versions", label: "Currículos personalizados", icon: Files },
  { to: "/applications", label: "Candidaturas", icon: KanbanSquare },
  { to: "/profile", label: "Perfil", icon: User },
  { to: "/settings", label: "Configurações", icon: Settings },
] as const;

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-ring rounded-md">
      <img
        src={logoMark}
        alt="VagaMatch"
        width={32}
        height={32}
        className="h-8 w-8 object-contain"
      />
      {!compact && (
        <span className="text-base font-semibold uppercase tracking-[0.12em] text-brand-deep">
          VagaMatch
        </span>
      )}
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1" aria-label="Navegação principal">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to || (to !== "/dashboard" && pathname.startsWith(`${to}/`));
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { profile } = useStore();

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-sidebar px-4 py-5 lg:flex">
        <Logo />
        <div className="mt-7 flex-1">
          <NavList />
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="flex items-center gap-2 text-xs font-medium text-brand-deep">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Sessão local
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Seus dados ficam neste navegador. Contas e login chegam em breve.
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-5">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo />
                <div className="mt-6">
                  <NavList onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold">{title}</h1>
              {description && (
                <p className="truncate text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">{actions}</div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
      <span className="sr-only">{profile.personal.name}</span>
    </div>
  );
}
