"use client";

import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/", key: "nav.home" },
    { href: "/blog", key: "nav.blog" },
    { href: "/projects", key: "nav.projects" },
    { href: "/about", key: "nav.about" },
    { href: "/resume", key: "nav.resume" },
    { href: "/contact", key: "nav.contact" },
  ];

  const chunkSize = 4;
  const linkChunks = [];
  for (let i = 0; i < quickLinks.length; i += chunkSize) {
    linkChunks.push(quickLinks.slice(i, i + chunkSize));
  }

  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.about")}</h3>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("footer.aboutText")}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.quickLinks")}
            </h3>
            <div className="flex flex-row gap-8">
              {linkChunks.map((chunk, index) => (
                <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2">
                  {chunk.map((link) => (
                    <li key={link.key}>
                      <Link
                        href="/"
                        className="text-muted-foreground hover:text-indigo-600 transition-colors text-sm md:text-base"
                      >
                        {t(link.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.connect")}
            </h3>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/Wesleyvdk"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/wesley-van-der-kraan-782b09230/"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground transition-colors"
              >
                <Mail className="h-6 w-6" />
                <span className="sr-only">Contact</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} Wesley van der Kraan. {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
