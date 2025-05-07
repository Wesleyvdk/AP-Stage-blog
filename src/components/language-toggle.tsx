"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "nl" : "en")}
      className="w-16 flex items-center justify-center gap-1"
    >
      {language === "en" ? (
        <>
          <span className="mr-1">🇬🇧</span>
          EN
        </>
      ) : (
        <>
          <span className="mr-1">🇳🇱</span>
          NL
        </>
      )}
    </Button>
  );
}
