import config from "@/config.ts";
import { cn } from "@/lib/utils.ts";
import { Menu, XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { SidebarProps } from "@/types/header.ts";
import LanguageAccordion from "@/components/shared/v2/language-accordion";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";

export default function NavbarMobile({
                                         data,
                                         location,
                                         setIsHovered,
                                         filterStyle,
                                         handleMouseEnter,
                                         handleMouseLeave,
                                         headersTranslations,
                                         accordionValue,
                                         setAccordionValue,
                                     }: SidebarProps) {
    const navigate = useNavigate();

    return (
        <Sheet>
            <div className="hidden max-md:flex fixed bottom-0 h-[68px] w-full bg-[var(--grey-700)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] px-[3vw] max-[500px]:px-4 z-900">
                <div className={cn("h-full w-full min-w-full z-900 transition-all no-scrollbar overflow-x-auto flex items-center flex-row gap-[8px] container duration-300 ease-in-out " +
                    "bg-[var(--grey-700)] data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
                )}>
                    <div className="w-full h-full grid grid-cols-8 max-[600px]:grid-cols-3 gap-2">
                        <SheetTrigger asChild>
                            <button className="w-full h-full relative t-0 order-[-3] z-[901] rounded-[8px]">
                                <Menu className="m-auto w-5 h-5 transition-filter duration-200"
                                      onMouseEnter={() => setIsHovered(true)}
                                      onMouseLeave={() => setIsHovered(false)}
                                      style={filterStyle}/>
                            </button>
                        </SheetTrigger>
                        {data?.map((R) =>
                            !R.is_sportbook && R.subcategories.length === 0 ? null
                                : (
                                <Button key={R.id} variant="ghost" className={cn(
                                    "flex w-full h-full flex-col gap-y-0.75 relative items-center rounded-[0] bg-[var(--grey-700)] hover:bg-[var(--grey-700)] text-primary-foreground hover:text-primary-foreground text-[11px] px-2 font-medium",
                                    {
                                        "border-t-4 border-blue-400": location.split("/")[1] === R.slug,
                                        "max-[600px]:hidden": R.name !== "Sport" && R.name !== "Casino",
                                        "order-[-2] group": R.name === "Sport",
                                        "order-[-1] group": R.name === "Casino",
                                    }
                                )} onMouseEnter={(e) => handleMouseEnter(e, R)}
                                    onMouseLeave={(e) => handleMouseLeave(e, R)}
                                    onClick={() => navigate(`/${R.slug}`)}>
                                    <img className="h-5 w-5 z-[2]"
                                         style={{filter: location.split("/")[1] === R.slug
                                                 ? "brightness(0%) invert(100%)"
                                                 : "brightness(0%) invert(77%) sepia(26%) saturate(212%) hue-rotate(186deg) brightness(95%) contrast(84%)",
                                         }} src={config.baseUrl + "/storage/" + R.icon} alt={R.name}/>
                                    <div className="text-white">
                                        {headersTranslations[R.name] ?? R.name}
                                    </div>
                                </Button>
                            )
                        )}
                    </div>
                </div>
            </div>
            <SheetContent side="bottom" className={cn("h-[calc(100vh-128px)] top-15 w-full min-w-full p-0 z-99 transition-all no-scrollbar overflow-x-auto flex items-center flex-col gap-[0] container mx-auto duration-300 ease-in-out bg-[var(--grey-700)] " +
                "md:fixed data-[state=open]:duration-300 data-[state=closed]:duration-500 data-[state=open]:slide-out-to-left data-[state=closed]:slide-in-from-left"
            )} style={{filter: "drop-shadow(0 0 5px rgba(25, 25, 25, 0.25))"}}
                          overlayClassName="bg-[#0e1224b3]" closeClassName="hidden closeBtn">
                <SheetHeader className="flex flex-col gap-y-4 p-x-4 h-max w-full touch-action-none">
                    <button className="w-full h-12 relative aspect-[1/1] order-[-3] text-white bg-[var(--grey-500)] rounded-md flex justify-between items-center px-4 gap-4"
                            onClick={() => (document.querySelector(".closeBtn") as HTMLElement)?.click()}>
                        Close
                        <XIcon className="w-4 h-4 transition-filter duration-200"
                               onMouseEnter={() => setIsHovered(true)}
                               onMouseLeave={() => setIsHovered(false)}
                               style={filterStyle}/>
                    </button>
                    <div className="flex gap-2 my-auto w-full">
                        {data?.map((R) =>
                            !R.is_sportbook && R.subcategories.length === 0 ? null : R.name !== "Sport" && R.name !== "Casino" ? null : (
                                <Button key={R.id} variant="ghost"
                                        className={cn("flex w-[calc(50%_-_4px)] h-12.5 relative items-center rounded-[6px] text-primary-foreground text-md hover:text-primary-foreground bg-transparent hover:bg-transparent px-2 font-medium cursor-pointer overflow-hidden group",
                                            {
                                                "order-[-2]": R.name === "Sport",
                                                "order-[-1]": R.name === "Casino",
                                            }
                                        )} onClick={() => navigate(`/${R.slug}`)}>
                                    <img src={R.name === "Sport"
                                        ? "https://stake.com/_app/immutable/assets/default-casino.CqlOLRkM.svg"
                                        : "https://stake.com/_app/immutable/assets/default-sports.KM8Zs5_U.svg"
                                    } className={cn(
                                        "block min-w-full w-full absolute -translate-x-2/4 -translate-y-2/4 z-[-1] rounded-lg left-2/4 top-2/4 group-hover:hidden",
                                        {
                                            hidden: location.split("/")[1] === R.slug,
                                        }
                                    )}/>
                                    <img src={R.name === "Sport"
                                        ? "https://stake.com/_app/immutable/assets/active-casino.D98ZVQ96.svg"
                                        : "https://stake.com/_app/immutable/assets/active-sports.CxIU50TW.svg"
                                    } className={cn(
                                        "hidden min-w-full w-full absolute -translate-x-2/4 -translate-y-2/4 z-[-1] rounded-lg left-2/4 top-2/4 group-hover:block",
                                        {
                                            block: location.split("/")[1] === R.slug,
                                        }
                                    )}/>
                                    <span className={cn("color-white group-hover:text-shadow-md", {
                                        "text-shadow-md": location.split("/")[1] === R.slug,
                                    })}>
                                            {R.name}
                                        </span>
                                </Button>
                            ))}
                    </div>
                </SheetHeader>
                <div className="w-full p-4 pt-0 touch-pan-x">
                    <div className="bg-[var(--grey-600)] rounded-[8px] overflow-x-auto">
                        {data?.map((R) =>
                            !R.is_sportbook && R.subcategories.length === 0 ? null : R.name === "Sport" || R.name === "Casino" ? null : (
                                <Button key={R.id} variant="ghost"
                                        className={cn("flex justify-start w-full h-12 relative rounded-[0] bg-transparent text-primary-foreground text-md hover:text-primary-foreground hover:bg-[var(--grey-400)] px-4 py-3 font-medium",
                                            {
                                                "text-[var(--grey-100)] hover:text-[var(--grey-100)] bg-[var(--grey-400)]": location.split("/")[1] === R.slug,
                                            }
                                        )} onMouseEnter={(e) => handleMouseEnter(e, R)}
                                        onMouseLeave={(e) => handleMouseLeave(e, R)}
                                        onClick={() => navigate(`/${R.slug}`)}>
                                    <img className="h-5 w-5" style={{
                                        filter: location.split("/")[1] === R.slug
                                            ? "brightness(0%) invert(100%)"
                                            : "brightness(0%) invert(77%) sepia(26%) saturate(212%) hue-rotate(186deg) brightness(95%) contrast(84%)",
                                    }} src={config.baseUrl + "/storage/" + R.icon} alt={R.name}/>
                                    <span className="text-white">{headersTranslations[R.name] ?? R.name}</span>
                                </Button>
                            )
                        )}
                        <div className="w-[calc(100%_-_16px)] h-0 border-t-[2px] border-t-[var(--grey-400)] mt-2.5 mb-2.25 mx-auto"></div>
                        <LanguageAccordion triggerClassName="flex justify-start w-full h-12 relative rounded-[0] bg-transparent text-primary-foreground text-md hover:text-primary-foreground hover:bg-[var(--grey-400)] px-4 py-3 font-medium"
                                           extraText={false} objectClassName="text-white hover:bg-[var(--grey-400)] py-3 h-12"
                                           contentClassName="ml-4 border-l-2 border-[var(--grey-400)] my-2"
                                           accordionValue={accordionValue} setAccordionValue={setAccordionValue}/>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
