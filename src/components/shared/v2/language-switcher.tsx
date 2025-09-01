import { useState } from "react";
import { useLingui } from "@lingui/react";
import { ALLOWED_LANGUAGES, type Language } from "@/types/lang";
import { ChevronDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const LanguageSwitcher = () => {
  const { i18n } = useLingui();
  const [currentLang, setCurrentLang] = useState<Language>(
    (localStorage.getItem("lang") as Language) || "en"
  );
    const [openState, setOpenState] = useState(false)

  const handleChange = (lang: Language) => {
    i18n.activate(lang);
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    setCurrentLang(lang);
    setOpenState(false);
  };


  return (
    <Popover open={openState} onOpenChange={(value) => setOpenState(value)}>
      <PopoverTrigger asChild >
        <button className="flex items-center gap-2">
          <span>{ALLOWED_LANGUAGES[currentLang].name}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-0  bg-muted  rounded-none shadow-md grid grid-cols-2">
        {Object.entries(ALLOWED_LANGUAGES).map(([key, lang]) => (
          <button
            key={key}
            className={`text-left px-3 py-2 rounded-none hover:bg-background/10 flex items-center justify-between ${
              currentLang === key ? "text-green-800 bg-muted-foreground/30  " : ""
            }`}
            onClick={() => handleChange(key as Language)}
          >
            <span>{lang.name}</span>
            {currentLang === key && (
              <Check className="w-4 h-4 text-green-800" />
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSwitcher;
