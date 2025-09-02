import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Subcategory } from "@/types/main";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils.ts";
import { SearchIcon } from "lucide-react";
import Search from "@/components/shared/v2/casino/search.tsx";
import LobbyBannerSlider from "@/components/casino/lobbyBannerSlider";
import { useTheme } from "@/hooks/useTheme.tsx";
import { Trans } from "@lingui/react/macro";

type Props = {
  data: Record<string, { subcategories: Subcategory[] }>[];
  paramsSubcategory?: string;
  showBanner?: boolean;
};

const SubcategorySlider = ({
  data,
  paramsSubcategory,
  showBanner = false,
}: Props) => {
  const [searchModal, setSearchModal] = useState(false);
  const navigate = useNavigate();
  const { categorySlug } = useParams();
  const { optionalSideBarOpen } = useTheme();

  const selectedCategory = data.find(
    (entry) => Object.keys(entry)[0] === categorySlug
  );

  const subcategories =
    selectedCategory?.[categorySlug as string]?.subcategories ?? [];


  // if (subcategories.length <= 1) {
  //   return null;
  // }

  const subcategoryTranslations: Record<string, any> = {
    Megaways: <Trans>Megaways</Trans>,
    "Video Slots": <Trans>Video Slots</Trans>,
    "Instant Games": <Trans>Instant Games</Trans>,
    "Egyptian Theme": <Trans>Egyptian Theme</Trans>,
    "New Trend": <Trans>New Trend</Trans>,
    Rome: <Trans>Rome</Trans>,
    Lobby: <Trans>Lobby</Trans>,
    Roulette: <Trans>Roulette</Trans>,
  };

  return (
    <>
      <div
        onClick={() => setSearchModal(true)}
        className="flex h-10 min-h-10 container mx-auto rounded-full lg:w-full w-[calc(100%-1rem)] items-center gap-2 mt-4 cursor-pointer px-3 bg-popover hover:bg-popover/80 transition"
      >
        <SearchIcon className="size-5" />
        <span className={"font-semibold text-sm"}>
          <Trans>Search</Trans>
        </span>
      </div>
      {showBanner && (
        <div className={"pt-10 lg:pb-3 container mx-auto"}>
          <LobbyBannerSlider />
        </div>
      )}
      {subcategories.length > 1 && (
        <section
          className={cn(
            "sticky transition-all duration-300 bg-background top-16 z-10 px-4",
            {
              "top-27 lg:top-16": optionalSideBarOpen,
            }
          )}
        >
          <div className={"flex items-center justify-center w-full"}>
            <div className="overflow-x-auto items-center flex  no-scrollbar py-5">
              <div
                className={cn(
                  "w-fit ml-3 shrink-0  text-[11px] cursor-pointer  ",
                  {
                    "decoration-2 select-none text-card underline underline-offset-8 ":
                      paramsSubcategory === undefined,
                  }
                )}
                onClick={() => navigate(`/${categorySlug}`)}
              >
                <Trans>All</Trans>
              </div>
              {subcategories.map((subcategory: Subcategory, index: number) => {
                return (
                  <div
                    key={subcategory.id}
                    className={cn(
                      "w-fit select-none ml-3 shrink-0  text-[11px] cursor-pointer ",
                      {
                        "ml-3": index === 0,
                        "mr-3": index === subcategories.length - 1,
                        "decoration-2 text-card underline underline-offset-8 ":
                          subcategory.slug === paramsSubcategory,
                      }
                    )}
                    onClick={() =>
                      navigate(`/${categorySlug}/games/${subcategory.slug}`)
                    }
                  >
                    {subcategoryTranslations[subcategory.name] ??
                      subcategory.name}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Dialog open={searchModal} onOpenChange={() => setSearchModal(false)}>
        <DialogContent
          showCloseButton={false}
          className="border-none rounded-none pt-0 px-3.5 overflow-y-auto shrink-0 p-0 min-w-screen w-full h-full"
        >
          <Search
            setSearchModal={setSearchModal}
            onCloseSearchModal={() => setSearchModal(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubcategorySlider;
