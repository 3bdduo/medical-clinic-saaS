"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";

import { Logo } from "@/components/ui/Logo";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function DashboardShell({
  navItems,
  title,
  children,
}: {
  navItems: NavItem[];
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-l border-border bg-surface px-4 py-6 md:flex">
        {/* Logo */}
        <div className="px-2">
          <Logo size="sm" />
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-250 ease-spring ${
                  active
                    ? "bg-primary-soft text-primary shadow-sm"
                    : "text-text-secondary hover:bg-primary-soft/50 hover:text-text-primary"
                }`}
              >
                <span className={`transition-transform duration-250 ease-spring ${active ? "scale-110" : "group-hover:scale-105"}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="justify-start text-text-secondary hover:text-danger"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          تسجيل الخروج
        </Button>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface/80 px-6 py-4 backdrop-blur-sm">
          <h1 className="font-display text-lg font-bold text-text-primary">
            {title}
          </h1>
          <ThemeToggle />
        </header>
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
