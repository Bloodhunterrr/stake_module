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
    <div className="mx-auto px-2 lg:px-0 pt-5">
        <div className="w-[94dvw] md:w-[calc(94dvw_-_60px)] min-[1440px]:max-w-300 ml-auto mr-[3dvw] min-[1440px]:mr-auto">
            <ProviderSliderFromApi categorySlug={categorySlug} />
            <div className="category-wrapper ">
                <section id="category-section" className="CategorySection">
                    <div className="category-games-section">
                        <div className="items-grid-wrapper">
                            <div className={cn("sticky top-15 bg-[var(--grey-600)] z-10 py-2 ", {
                                "top-22 lg:top-15": optionalSideBarOpen,
                            })}>
                                <div className="p-3 flex items-center justify-between">
                                    <div className={"flex items-center gap-x-3 "}>
                                        <button onClick={() => navigate(-1)}
                                                className="flex items-center justify-center w-10 h-10 rounded-full text-white border border-white cursor-pointer lg:hover:border-white lg:hover:bg-[var(--grey-500)] lg:hover:text-white transition">
                                            <ArrowUpIcon className="w-4 h-4 -rotate-90" />
                                        </button>

                                        <div>
                                            <h1 className="font-bold text-lg text-primary-foreground capitalize">
                                                {providerCode}
                                            </h1>
                                            {totalGames > 0 && (
                                                <p className="text-[var(--grey-200)] text-md leading-6">
                                                    <Plural value={totalGames}
                                                            one="# game"
                                                            other="# games"/>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-1.5 items-center">
                                        <button onClick={() => setSearchModal(true)}
                                                className="flex items-center justify-center gap-2 px-3 py-1 w-[60px] rounded-[24px] border text-sm font-semibold transition
                   border-gray-600 text-gray-300 lg:hover:border-card lg:hover:text-white lg:hover:bg-popover/50">
                                            <SearchIcon className="size-5" />
                                        </button>

                                        <button onClick={() => setIsSortingEnabled((p) => !p)}
                                                className={`px-3 py-1 rounded-[24px] border w-[60px] text-sm font-semibold transition ${
                                                    isSortingEnabled
                                                        ? "border-card text-card bg-popover"
                                                        : "border border-gray-600 text-gray-300 lg:hover:border-card lg:hover:text-white"
                                                }`}>
                                            A-Z
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="min-h-screen pt-4">
                                <GameListRenderer key={providerCode || "all"}
                                                  provider_general_codes={providerCode ? [providerCode] : null}
                                                  order_by={isSortingEnabled ? "name" : "order"}
                                                  onTotalChange={setTotalGames}
                                                  gameDynamicClass="grid grid-cols-3 min-[500px]:grid-cols-4 min-[718px]:grid-cols-5 min-[910px]:grid-cols-6 min-[1060px]:grid-cols-7 min-[1210px]:grid-cols-8 gap-x-2 gap-y-4"/>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
      <Dialog open={searchModal} onOpenChange={() => setSearchModal(false)}>
        <DialogContent showCloseButton={false}
          className="border-none rounded-none pt-0 px-3.5 overflow-y-auto shrink-0 p-0 top-[calc(50%_+_30px)] left-[calc(50%_+_30px)] z-100 grid w-[calc(100%-60px)] max-w-[calc(100%-60px)] min-w-[calc(100%-60px)] max-md:w-full max-md:max-w-full max-md:min-w-full !h-[calc(100%-60px)] translate-x-[-50%] translate-y-[-50%]">
          <Search setSearchModal={setSearchModal}
            onCloseSearchModal={() => setSearchModal(false)}/>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default ProvidersGames;
