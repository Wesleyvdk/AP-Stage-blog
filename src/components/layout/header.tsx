"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.blog"), href: "/blog" },
    { name: t("nav.projects"), href: "/projects" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.resume"), href: "/resume" },
  ];

  return (
    <header className="sticky top-0 px-4 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-6 md:gap-10">
          <Link
            href="/"
            className="font-bold text-xl truncate max-w-[180px] sm:max-w-none"
          >
            Wesley van der Kraan
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {user ? (
            <>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link href="/dashboard">{t("nav.dashboard")}</Link>
              </Button>
              <Button
                onClick={logout}
                className="bg-indigo-600 text-white hover:bg-indigo-700 hidden md:flex"
              >
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <Button
              asChild
              className="bg-indigo-600 text-white hover:bg-indigo-700 hidden md:flex"
            >
              <Link href="/auth/login">{t("nav.login")}</Link>
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px] px-4">
              <div className="flex flex-col h-full">
                <div className="flex-1 py-4">
                  <div className="mb-10 flex items-center justify-between">
                    <Link
                      href="/"
                      className="font-bold text-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Wesley van der Kraan
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </div>
                  <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "text-base font-medium transition-colors hover:text-primary py-2",
                          pathname === item.href
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                    {user && (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-base font-medium transition-colors hover:text-primary py-2 text-muted-foreground"
                      >
                        {t("nav.dashboard")}
                      </Link>
                    )}
                  </nav>
                </div>
                <div className="border-t py-4">
                  {user ? (
                    <Button
                      onClick={logout}
                      className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      {t("nav.logout")}
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/auth/login">{t("nav.login")}</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
