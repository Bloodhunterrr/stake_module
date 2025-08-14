import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Menu,
  LifeBuoy,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { ALLOWED_LANGUAGES } from "@/types/lang";
import { useGetMainQuery } from "@/services/mainApi";
import SidebarNav from "./sidebar-nav";

type Language = {
  code: string;
  name: string;
};


const logo = "https://hayaspin.com/static/media/logo.eb0ca820ea802ba28dd2.svg";
const DESKTOP_WIDTH = 768;

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
          className="w-full justify-between rounded-lg font-normal transition-all duration-300 hover:bg-accent"
        >
          <div className="flex items-center space-x-2">
            <span>{currentLang.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        <ScrollArea className="h-40">
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



export default function Sidebar() {
  const navigate = useNavigate();
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > DESKTOP_WIDTH);

  const { data } = useGetMainQuery();

  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyDesktop = window.innerWidth > DESKTOP_WIDTH;
      setIsDesktop(isCurrentlyDesktop);
      if (!isCurrentlyDesktop) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };

  const commonNavContent = (
    <>
      <ScrollArea className="h-full pr-4">
        <SidebarNav
          sidebarOpen={isDesktop ? sidebarOpen : true}
          data={data}
          categorySlug={categorySlug}
          onNavigate={handleNavigate}
        />
      </ScrollArea>
      <div className="mt-auto pt-4 border-t border-border flex flex-col space-y-2">
        <Button
          onClick={() => {
            console.log("chat");
            if (!isDesktop) setSidebarOpen(false);
          }}
          className={`w-full justify-start rounded-lg font-normal
                    ${
                      isDesktop && !sidebarOpen
                        ? "px-0 w-12 h-12 justify-center"
                        : "px-4"
                    }`}
        >
          <LifeBuoy
            className={`${isDesktop && sidebarOpen ? "mr-3" : ""} h-5 w-5`}
          />
          {((isDesktop && sidebarOpen) || !isDesktop) && (
            <span className="truncate">Support</span>
          )}
        </Button>
        {((isDesktop && sidebarOpen) || !isDesktop) && <LanguageSwitcher />}
      </div>
    </>
  );

  return (
    <>
      {isDesktop ? (
        <div
          className={`relative h-full flex-col p-4 bg-card text-card-foreground transition-all duration-300 ease-in-out
                    ${sidebarOpen ? "w-64" : "w-20"} hidden md:flex`}
        >
          <div
            className={`flex items-center ${
              sidebarOpen ? "justify-between" : "justify-center"
            } p-2 mb-4`}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="shrink-0"
            >
              <Menu className="h-6 w-6" />
            </Button>
            {sidebarOpen && logo && (
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
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild className="fixed top-4 left-4 z-50 md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 md:hidden">
            <div className="flex items-center justify-between p-4 mb-4">
              {logo && (
                <img
                  src={logo}
                  alt="logo"
                  className="h-8 cursor-pointer"
                  onClick={() => handleNavigate("/")}
                />
              )}
            </div>
            <div className="h-[calc(100%-80px)] px-4 flex flex-col">
              {commonNavContent}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
