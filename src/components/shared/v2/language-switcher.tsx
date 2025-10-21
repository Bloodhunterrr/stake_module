import { useState } from "react";
import { useLingui } from "@lingui/react";
import { ALLOWED_LANGUAGES, type Language } from "@/types/lang";
import { ChevronDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {cn} from "@/lib/utils.ts";

const LanguageSwitcher = ({ triggerClassName }: { triggerClassName?: string }) => {
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
      <PopoverTrigger asChild>
        <button className={cn("flex items-center gap-2", triggerClassName)}>
          <span>{ALLOWED_LANGUAGES[currentLang].name}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent className={cn("p-0 py-2 bg-muted border-none shadow-md grid grid-cols-1 overflow-y-hidden rounded-md w-max mb-1\n" +
                                    "before:content-[''] before:absolute before:-translate-x-2/4 before:w-0 before:h-0 before:border-x-[6px] before:border-x-transparent\n" +
                                    "before:border-t-[6px] before:border-t-muted before:border-b-0 before:border-b-transparent before:border-solid before:left-1/2 before:bottom-[-6px] before:mb-1")}>
        {Object.entries(ALLOWED_LANGUAGES).map(([key, lang]) => (
          <button key={key}
            className={`text-left w-max min-w-25 p-3 rounded-none hover:bg-[var(--grey-200)] flex items-center justify-between gap-2 cursor-pointer ${
              currentLang === key ? "text-blue-500 hover:bg-muted " : ""
            }`} onClick={() => handleChange(key as Language)}>
            <span>{lang.name}</span>
            {currentLang === key && (
              <Check className="w-4 h-4 text-blue-500" />
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSwitcher;
