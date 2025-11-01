import { useState } from "react";
import { useLingui } from "@lingui/react";
import { ALLOWED_LANGUAGES, type Language } from "@/types/lang";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {Trans} from "@lingui/react/macro";
import {cn} from "@/lib/utils.ts";

const LanguageAccordion = (
    { triggerClassName, extraText, objectClassName, contentClassName, accordionValue, setAccordionValue }:
    { triggerClassName?: string, extraText?: boolean, objectClassName?: string, contentClassName?: string, accordionValue?: string, setAccordionValue?: (value: string) => void }) => {
    const { i18n } = useLingui();
    const [currentLang, setCurrentLang] = useState<Language>(
        (localStorage.getItem("lang") as Language) || "en"
    );

    const handleChange = (lang: Language) => {
        i18n.activate(lang);
        localStorage.setItem("lang", lang);
        document.documentElement.lang = lang;
        setCurrentLang(lang);
    };

    return (
        <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue}>
            <AccordionItem value="item-1">
                <AccordionTrigger className={'flex px-2 py-0 flex-row hover:no-underline items-center ' + triggerClassName}
                                  iconClassName={"text-[var(--grey-100)]!"}>
                    <div className={cn('w-full h-9 flex items-end relative', {
                        "items-center": !extraText
                    })}>
                        <p className={cn('absolute top-0 text-[10px]', {
                            "hidden": !extraText
                        })}><Trans>Language</Trans></p>
                        <p>{ALLOWED_LANGUAGES[currentLang].name}</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className={'py-0 ' + contentClassName}>
                    {Object.entries(ALLOWED_LANGUAGES).map(([key, lang]) => (
                        <button key={key} onClick={() => handleChange(key as Language)}
                                className={cn(`text-left py-2 px-1 border-l-3 hover:bg-gray-100 w-full flex items-center justify-between ${currentLang === key ? "font-bold border-l-[var(--grey-200)]" : "border-l-transparent"}`,
                                    objectClassName
                                )}>
                            <span>{lang.name}</span>
                        </button>
                    ))}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default LanguageAccordion;
