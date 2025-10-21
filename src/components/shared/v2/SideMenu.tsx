import React, {useEffect, useRef, useState} from 'react'
import {Sheet, SheetContent, SheetHeader, SheetTrigger} from "@/components/ui/sheet.tsx";
import {Languages, Menu} from "lucide-react";
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import LanguageAccordion from "@/components/shared/v2/language-accordion.tsx";
import {useNavigate} from "react-router-dom";
import { useGetMainQuery } from "@/services/mainApi";
import config from "@/config";
import { Trans } from "@lingui/react/macro";

const SideMenu = (props :any) => {
    const navigate = useNavigate();
    const [showPopupId, setShowPopupId] = useState<number | null>(null);
    const [popupTop, setPopupTop] = useState<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const headersTranslations: Record<string, any> = {
        "Sport": <Trans>Sport</Trans>,
        "Casino": <Trans>Casino</Trans>,
        "Vip Casino": <Trans>VIP Casino</Trans>,
        "Casino Live": <Trans>Casino Live</Trans>,
        "Crash Games": <Trans>Crash Games</Trans>,
        "Virtual": <Trans>Virtual</Trans>,
        "Lottery": <Trans>Lottery</Trans>,
    };

    const { data } = useGetMainQuery();

    type Category = {
        id: number;
        slug: string;
        name: string;
        icon: string;
        is_sportbook: boolean;
        subcategories: any[];
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, R: Category) => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
        }
        setShowPopupId(null);
        const rect = e.currentTarget.getBoundingClientRect();
        const newTop = rect.top - 55;
        timerRef.current = window.setTimeout(() => {
            setShowPopupId(R.id);
            setPopupTop(newTop);
        }, 50);
        {
            const img = e.currentTarget.querySelector('img.h-5.w-5.z-\\[2\\]') as HTMLImageElement | null;
            if (img && props.location.split("/")[1] !== R.slug) {
                img.style.filter = "brightness(0%) invert(100%)";
            }
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>, R: Category) => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
        }
        setShowPopupId(null);
        setPopupTop(null);
        {
            const img = e.currentTarget.querySelector('img.h-5.w-5.z-\\[2\\]') as HTMLImageElement | null;
            if (img && props.location.split("/")[1] !== R.slug) {
                img.style.filter = "brightness(0%) invert(77%) sepia(26%) saturate(212%) hue-rotate(186deg) brightness(95%) contrast(84%)";
            }
        }
    };

    useEffect(() => {
        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const filterStyle = {
        filter: isHovered
            ? "brightness(0%) invert(100%)" // Hover color: White
            : "brightness(0%) invert(77%) sepia(26%) saturate(212%) hue-rotate(186deg) brightness(95%) contrast(84%)", // Default color
    };

    const [accordionValue, setAccordionValue] = React.useState<string>("");
    return (
        <Sheet>
            <div className="max-md:hidden fixed top-0 h-[calc(100%)] w-max bg-[var(--grey-700)] z-[900]">
                <SheetTrigger asChild>
                    <button className="w-15 relative t-0 -mb-2 aspect-[1/1] order-[-3] z-[901] rounded-[8px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2),0_4px_6px_-2px_rgba(0,0,0,0.1))]">
                        <Menu className="m-auto w-5 h-5 transition-filter duration-200"
                              onMouseEnter={() => setIsHovered(true)}
                              onMouseLeave={() => setIsHovered(false)}
                              style={filterStyle}/>
                    </button>
                </SheetTrigger>
                <div className={cn("h-[calc(100%_-_60px)] p-2 z-900 transition-all no-scrollbar overflow-x-auto flex items-center flex-col gap-[8px] container mx-auto duration-300 ease-in-out " +
                    "bg-[var(--grey-700)] top-15 w-15 data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left")}>
                    <div className="w-[calc(100%_-_16px)] h-0 border-t-[2px] border-t-[var(--grey-400)] mt-1.75 mb-1.5"></div>
                    {data?.map((R) =>
                        !R.is_sportbook && R.subcategories.length === 0 ? null : (
                            <Button key={R.id} variant="ghost" className={cn(
                                "flex w-11 h-11 relative items-center rounded-[6px] bg-[var(--grey-700)] hover:bg-[var(--grey-700)] text-primary-foreground text-[11px] px-2 font-medium",
                                {
                                    "hover:text-primary-foreground hover:bg-[var(--grey-400)]": R.name !== "Sport" && R.name !== "Casino",
                                    "text-[var(--grey-100)] hover:text-[var(--grey-100)] bg-[var(--grey-400)]": props.location.split("/")[1] === R.slug && R.name !== "Sport" && R.name !== "Casino",
                                    "order-[-2] group" : R.name === "Sport",
                                    "order-[-1] group" : R.name === "Casino",
                                }
                            )}
                                    onMouseEnter={(e) => handleMouseEnter(e, R)}
                                    onMouseLeave={(e) => handleMouseLeave(e, R)}
                                    onClick={() => navigate(`/${R.slug}`)}>
                                {R.name !== "Sport" && R.name !== "Casino" ? null : (
                                    <img src={R.name === "Sport"
                                        ? "https://stake.com/_app/immutable/assets/default-casino-mini.CQlEkEv9.svg"
                                        : "https://stake.com/_app/immutable/assets/default-sports-mini.BJ4yNOA9.svg"
                                    } className={cn("block min-w-full w-full absolute -translate-x-2/4 -translate-y-2/4 z-[1] rounded-lg left-2/4 top-2/4 group-hover:hidden",
                                        {
                                            "hidden": props.location.split("/")[1] === R.slug,
                                        }
                                    )}/>
                                )}
                                {R.name !== "Sport" && R.name !== "Casino" ? null : (
                                    <img src={R.name === "Sport"
                                        ? "https://stake.com/_app/immutable/assets/active-casino-mini.C2xccerq.svg"
                                        : "https://stake.com/_app/immutable/assets/active-sports-mini.DzJgZyvU.svg"
                                    } className={cn("hidden min-w-full w-full absolute -translate-x-2/4 -translate-y-2/4 z-[1] rounded-lg left-2/4 top-2/4 group-hover:block",
                                        {
                                            "block": props.location.split("/")[1] === R.slug,
                                        }
                                    )}/>
                                )}
                                <img className="h-5 w-5 z-[2]"
                                     style={{
                                         filter:
                                             props.location.split("/")[1] === R.slug
                                                 ? "brightness(0%) invert(100%)"
                                                 : "brightness(0%) invert(77%) sepia(26%) saturate(212%) hue-rotate(186deg) brightness(95%) contrast(84%)",
                                     }}
                                     src={config.baseUrl + "/storage/" + R.icon}
                                     alt={R.name}/>
                                {showPopupId === R.id && popupTop !== null && (
                                    <div style={{ top: popupTop }} className="fixed left-0 whitespace-nowrap bg-white text-black text-[13px] font-normal py-3 px-4 rounded-[8px] shadow-xl shadow-[#0000004a] z-[1000]
                                                                            before:content-[''] before:absolute before:-translate-x-2/4 before:w-0 before:h-0 before:border-x-[6px] before:border-x-transparent
                                                                            before:border-t-[6px] before:border-t-[white] before:border-b-0 before:border-b-transparent before:border-solid before:left-7.5 before:bottom-[-6px]">
                                        {headersTranslations[R.name] ?? R.name}
                                    </div>
                                )}
                            </Button>
                        )
                    )}
                    <div className="w-[calc(100%_-_16px)] h-0 border-t-[2px] border-t-[var(--grey-400)] mt-1.75 mb-1.5"></div>
                    <SheetTrigger asChild>
                        <Button
                            key="-1"
                            variant="ghost"
                            className={cn(
                                "flex w-11 h-11 relative items-center rounded-[6px] bg-[var(--grey-700)] hover:bg([var(--grey-700)] text-primary-foreground text-[11px] px-2 font-medium",
                                "hover:text-primary-foreground hover:bg-[var(--grey-400)] text-[var(--grey-100)] hover:text-[var(--grey-100)] bg-[var(--grey-400)]",
                            )}
                            onMouseEnter={(e) => handleMouseEnter(e, {
                                id: 11,
                                name: "Language",
                                slug: "language",
                                icon: "languages",
                                is_sportbook: false,
                                subcategories: []
                            })}
                            onMouseLeave={(e) => handleMouseLeave(e, {
                                id: 11,
                                name: "Language",
                                slug: "language",
                                icon: "languages",
                                is_sportbook: false,
                                subcategories: []
                            })}
                            onClick={() => {
                                // Open sheet immediately, then trigger accordion after 1 second
                                setTimeout(() => {
                                    setAccordionValue("item-1"); // This matches your AccordionItem value
                                }, 300);
                            }}>
                            <Languages />
                            {showPopupId === 11 && popupTop !== null && (
                                <div
                                    style={{ top: popupTop }}
                                    className="fixed left-0 whitespace-nowrap bg-white text-black text-[13px] font-normal py-3 px-4 rounded-[8px] shadow-xl shadow-[#0000004a] z-[1000]
                                             before:content-[''] before:absolute before:-translate-x-2/4 before:w-0 before:h-0 before:border-x-[6px] before:border-x-transparent
                                             before:border-t-[6px] before:border-t-[white] before:border-b-0 before:border-b-transparent before:border-solid before:left-7.5 before:bottom-[-6px]">
                                    Languages
                                </div>
                            )}
                        </Button>
                    </SheetTrigger>
                </div>
            </div>
            <SheetContent side="left" className={cn("h-full p-0 z-900 transition-all no-scrollbar overflow-x-auto flex items-center flex-col gap-[0] container mx-auto duration-300 ease-in-out bg-[var(--grey-700)] " +
                "md:fixed w-[260px] data-[state=open]:duration-300 data-[state=closed]:duration-500 data-[state=open]:slide-out-to-left data-[state=closed]:slide-in-from-left"
            )} style={{ filter: "drop-shadow(0 0 5px rgba(25, 25, 25, 0.25))" }} overlayClassName="bg-[#0e1224b3]" closeClassName="hidden closeBtn">
                <SheetHeader className="flex flex-row gap-0 p-0 pr-4 h-15 shadow-lg touch-action-none">
                    <button className="w-15 relative aspect-[1/1] order-[-3]" onClick={() => (document.querySelector(".closeBtn") as HTMLElement)?.click()}>
                        <Menu className="m-auto w-5 h-5 transition-filter duration-200"
                              onMouseEnter={() => setIsHovered(true)}
                              onMouseLeave={() => setIsHovered(false)}
                              style={filterStyle}/>
                    </button>
                    <div className="flex gap-2 my-auto">
                        {data?.map((R) =>
                            !R.is_sportbook && R.subcategories.length === 0  ? null : R.name !== "Sport" && R.name !== "Casino" ? null : (
                                <Button key={R.id} variant="ghost"
                                        className={cn("flex w-22 h-9 relative items-center rounded-[6px] text-primary-foreground text-md hover:text-primary-foreground bg-transparent hover:bg-transparent px-2 font-medium cursor-pointer overflow-hidden group",
                                            {
                                                'order-[-2]' : R.name === "Sport",
                                                "order-[-1]" : R.name === "Casino",
                                            }
                                        )}
                                    // onMouseEnter={(e) => handleMouseEnter(e, R)}
                                    // onMouseLeave={(e) => handleMouseLeave(e, R)}
                                        onClick={() => navigate(`/${R.slug}`)}>
                                    <img src={R.name === "Sport" ? "https://stake.com/_app/immutable/assets/default-casino.CqlOLRkM.svg" : "https://stake.com/_app/immutable/assets/default-sports.KM8Zs5_U.svg"}
                                         className={cn("block min-w-full w-full absolute -translate-x-2/4 -translate-y-2/4 z-[-1] rounded-lg left-2/4 top-2/4 group-hover:hidden",{
                                             "hidden": props.location.split("/")[1] === R.slug,
                                         })} />
                                    <img src={R.name === "Sport" ? "https://stake.com/_app/immutable/assets/active-casino.D98ZVQ96.svg" : "https://stake.com/_app/immutable/assets/active-sports.CxIU50TW.svg"}
                                         className={cn("hidden min-w-full w-full absolute -translate-x-2/4 -translate-y-2/4 z-[-1] rounded-lg left-2/4 top-2/4 group-hover:block",{
                                             "block": props.location.split("/")[1] === R.slug,
                                         })} />
                                    <span className={cn("color-white group-hover:text-shadow-md",{
                                        "text-shadow-md": props.location.split("/")[1] === R.slug,
                                    })}>{R.name}</span>
                                </Button>
                            )
                        )}
                    </div>
                </SheetHeader>
                <div className="w-full p-4 touch-pan-x">
                    <div className="bg-[var(--grey-600)] rounded-[8px] overflow-x-auto">
                        {data?.map((R) =>
                            !R.is_sportbook && R.subcategories.length === 0 ? null : (R.name === "Sport" || R.name === "Casino") ? null : (
                                <Button
                                    key={R.id}
                                    variant="ghost"
                                    className={cn(
                                        "flex justify-start w-full h-12 relative rounded-[0] bg-transparent text-primary-foreground text-md hover:text-primary-foreground hover:bg-[var(--grey-400)] px-4 py-3 font-medium", {
                                            "text-[var(--grey-100)] hover:text-[var(--grey-100)] bg-[var(--grey-400)]": props.location.split("/")[1] === R.slug,
                                        }
                                    )}
                                    onMouseEnter={(e) => handleMouseEnter(e, R)}
                                    onMouseLeave={(e) => handleMouseLeave(e, R)}
                                    onClick={() => navigate(`/${R.slug}`)}>
                                    <img className="h-5 w-5"
                                         style={{
                                             filter:
                                                 props.location.split("/")[1] === R.slug
                                                     ? "brightness(0%) invert(100%)"
                                                     : "brightness(0%) invert(77%) sepia(26%) saturate(212%) hue-rotate(186deg) brightness(95%) contrast(84%)",
                                         }}
                                         src={config.baseUrl + "/storage/" + R.icon}
                                         alt={R.name}/>
                                    <span className="text-white">
                                      {headersTranslations[R.name] ?? R.name}
                                  </span>
                                </Button>
                            )
                        )}
                        <div className="w-[calc(100%_-_16px)] h-0 border-t-[2px] border-t-[var(--grey-400)] mt-2.5 mb-2.25 mx-auto"></div>
                        <LanguageAccordion triggerClassName="flex justify-start w-full h-12 relative rounded-[0] bg-transparent text-primary-foreground text-md hover:text-primary-foreground hover:bg-[var(--grey-400)] px-4 py-3 font-medium"
                                           extraText={false} objectClassName={"text-white hover:bg-[var(--grey-400)] py-3 h-12"} contentClassName={"ml-4 border-l-2 border-[var(--grey-400)] my-2"}
                                           accordionValue={accordionValue} setAccordionValue={setAccordionValue} />
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    )
}
export default SideMenu
