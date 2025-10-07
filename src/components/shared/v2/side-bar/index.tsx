import { Menu, LifeBuoy } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";

import { useState } from "react";
import SidebarNav from "./sidebar-nav.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ALLOWED_LANGUAGES } from "@/types/lang.ts";
import { Check, ChevronDown } from "lucide-react";
import { useGetMainQuery } from "@/services/mainApi.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet.tsx";
import logo from "@/assets/images/logo.svg";
import { useTheme } from "@/hooks/useTheme.tsx";
import { cn } from "@/lib/utils.ts";

type Language = {
  code: string;
  name: string;
};

type SidebarProps = {
  isDesktop: boolean;
  sideBarOpen: boolean;
  toggleSideBar: (isOpen: boolean) => void;
};

function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<Language>(
    ALLOWED_LANGUAGES.en
  );
  const [open, setOpen] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="w-full h-10 justify-between rounded-lg font-normal transition-all duration-300 hover:bg-accent"
        >
          <div className="flex items-center space-x-2">
            <span>{currentLang.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white" align="end">
        <ScrollArea className="h-max">
          <div className="flex flex-col space-y-1 p-1">
            {Object.values(ALLOWED_LANGUAGES).map((lang) => (
              <Button
                key={lang.code}
                variant="ghost"
                className="w-full justify-between font-normal"
                onClick={() => handleLanguageChange(lang)}
              >
                <span>{lang.name}</span>
                {currentLang.code === lang.code && (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export default function Sidebar({
  isDesktop,
  sideBarOpen,
  toggleSideBar,
}: SidebarProps) {
  const navigate = useNavigate();
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { data } = useGetMainQuery();
  const { optionalSideBarOpen } = useTheme();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (!isDesktop) {
      toggleSideBar(false);
    }
  };

  const commonNavContent = (
    <>
      <SidebarNav
        sidebarOpen={isDesktop ? sideBarOpen : true}
        data={data}
        categorySlug={categorySlug}
        onNavigate={handleNavigate}
      />
      <div className="mt-auto py-4 border-t border-border flex flex-col space-y-2">
        <Button
          onClick={() => {
            console.log("chat");
            if (!isDesktop) toggleSideBar(false);
          }}
          className={`w-full justify-start h-10 rounded-lg bg-chart-2 hover:bg-chart-2   font-normal
                             ${
                               isDesktop && !sideBarOpen
                                 ? "px-0 size-12 justify-center "
                                 : "px-4"
                             }`}
        >
          <LifeBuoy
            className={`${isDesktop && sideBarOpen ? "mr-3" : ""} h-5 w-5`}
          />
          {((isDesktop && sideBarOpen) || !isDesktop) && (
            <span className="truncate">Support</span>
          )}
        </Button>
        {((isDesktop && sideBarOpen) || !isDesktop) && <LanguageSwitcher />}
      </div>
    </>
  );

  return (
    <>
      {isDesktop ? (
        <div
          className={`fixed h-full flex-col px-4 transition-all duration-300 ease-in-out overflow-auto bg-white top-0 left-0 z-[1000] 
                             ${sideBarOpen ? "w-64" : "w-18"} hidden xl:flex`}
        >
          <div
            className={`flex items-center ${
              sideBarOpen ? "justify-between" : "justify-center"
            } p-2 mb-4`}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleSideBar(!sideBarOpen)}
              className="shrink-0 hover:bg-transparent"
            >
              <Menu className="h-6 w-6" />
            </Button>
            {sideBarOpen && logo && (
              <img
                src={logo}
                alt="logo"
                className="h-8 cursor-pointer"
                onClick={() => navigate("/")}
              />
            )}
          </div>
          {commonNavContent}
        </div>
      ) : (
        <Sheet open={sideBarOpen} onOpenChange={toggleSideBar} >
          <SheetTrigger
            asChild
            className={cn("transition-all duration-300",{
              "-mt-2.5": !optionalSideBarOpen,
              "mt-8.5": optionalSideBarOpen,
            })}
          >
            {/*<Button*/}
            {/*  variant="ghost"*/}
            {/*  size="icon"*/}
            {/*  className="fixed hover:bg-transparent hover:text-accent top-4 left-3 z-50 xl:hidden"*/}
            {/*>*/}
            {/*  <Menu className="h-6 w-6" />*/}
            {/*</Button>*/}
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] p-0 border-none xl:hidden">
            <div className="flex items-center justify-between p-4 mb-4">
              {logo && (
                <img
                  src={logo}
                  alt="logo"
                  className="h-[15px] mt-2 cursor-pointer"
                  onClick={() => handleNavigate("/")}
                />
              )}
            </div>
            <div className="h-[calc(100%-80px)] overflow-auto px-4 flex flex-col">
              {commonNavContent}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
