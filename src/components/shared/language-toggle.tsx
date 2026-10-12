"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const [lang, setLang] = useState<"en" | "ur">("en");

  useEffect(() => {
    const saved = localStorage.getItem("pcb_lang") as "en" | "ur" | null;
    if (saved) {
      setLang(saved);
      document.documentElement.setAttribute("lang", saved);
      document.documentElement.setAttribute("dir", saved === "ur" ? "rtl" : "ltr");
    }
  }, []);

  const toggleLanguage = () => {
    const next = lang === "en" ? "ur" : "en";
    setLang(next);
    localStorage.setItem("pcb_lang", next);
    document.documentElement.setAttribute("lang", next);
    document.documentElement.setAttribute("dir", next === "ur" ? "rtl" : "ltr");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 text-xs font-medium text-white/90 hover:text-white hover:bg-white/10"
      title={lang === "en" ? "Switch to Urdu (اردو)" : "Switch to English"}
    >
      <Globe className="w-3.5 h-3.5 text-cricket-gold" />
      <span>{lang === "en" ? "اردو" : "English"}</span>
    </Button>
  );
}
