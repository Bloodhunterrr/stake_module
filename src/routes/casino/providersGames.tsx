import { cn } from "@/lib/utils.ts";
import { Plural } from "@lingui/react/macro";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme.tsx";
import Footer from "@/components/shared/v2/footer.tsx";
import GameListRenderer from "./gameListRenderer";
import { useNavigate, useParams } from "react-router";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";
import ProviderSliderFromApi from "@/components/casino/provider-slider-from-api.tsx";
import { SearchIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Search from "@/components/shared/v2/casino/search";

const ProvidersGames = () => {
  const navigate = useNavigate();
  const { providerCode } = useParams<{ providerCode: string }>();
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const [isSortingEnabled, setIsSortingEnabled] = useState(false);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [searchModal, setSearchModal] = useState(false);

  const { optionalSideBarOpen } = useTheme();

  return (
    <div className="container mx-auto px-2 lg:px-0 pt-5">
      <ProviderSliderFromApi categorySlug={categorySlug} />
      <div className="category-wrapper">
        <section id="category-section" className="CategorySection">
          <div className="category-games-section">
            <div className="items-grid-wrapper">
              <div
                className={cn("sticky top-16 bg-background  z-10 py-2 ", {
                  "top-27 lg:top-16": optionalSideBarOpen,
                })}
              >
                <div className="p-3 flex items-center justify-between">
                  <div className={"flex items-center gap-x-3 "}>
                    <button
                      onClick={() => navigate(-1)}
                      className="flex items-center justify-center w-10 h-10 rounded-full text-card border border-card cursor-pointer hover:border-card hover:bg-popover hover:text-white transition"
                    >
                      <ArrowUpIcon className="w-4 h-4 -rotate-90" />
                    </button>

                    <div>
                      <h1 className="font-bold text-lg text-primary-foreground">
                        {providerCode}
                      </h1>
                      {totalGames > 0 && (
                        <p className="text-card text-sm">
                          <Plural
                            value={totalGames}
                            one="# game"
                            other="# games"
                          />
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1.5 items-center">
                    <button
                      onClick={() => setSearchModal(true)}
                      className="flex items-center justify-center gap-2 px-3 py-1 w-[60px] rounded-[24px] border text-sm font-semibold transition
                   border-gray-600 text-gray-300 hover:border-card hover:text-white hover:bg-popover/50"
                    >
                      <SearchIcon className="size-5" />
                    </button>

                    <button
                      onClick={() => setIsSortingEnabled((p) => !p)}
                      className={`px-3 py-1 rounded-[24px] border w-[60px] text-sm font-semibold transition ${
                        isSortingEnabled
                          ? "border-card text-card bg-popover"
                          : "border border-gray-600 text-gray-300 hover:border-card hover:text-white"
                      }`}
                    >
                      A-Z
                    </button>
                  </div>
                </div>
              </div>

              <div className="min-h-screen">
                <GameListRenderer
                  key={providerCode || "all"}
                  provider_general_codes={providerCode ? [providerCode] : null}
                  order_by={isSortingEnabled ? "name" : "order"}
                  onTotalChange={setTotalGames}
                  gameDynamicClass="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
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
      <Footer />
    </div>
  );
};

export default ProvidersGames;
