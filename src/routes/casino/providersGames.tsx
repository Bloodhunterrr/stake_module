import { cn } from "@/lib/utils.ts";
import { Plural } from "@lingui/react/macro";
import { useState } from "react";
// import type { Provider } from "@/types/main";
import { useTheme } from "@/hooks/useTheme.tsx";
import Footer from "@/components/shared/v2/footer.tsx";
import GameListRenderer from "./gameListRenderer";
import { useGetMainQuery } from "@/services/mainApi";
import { useNavigate, useParams } from "react-router";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";
import ProviderSliderFromApi from "@/components/casino/provider-slider-from-api.tsx";

// type DataTree = Record<string, Provider>;

const ProvidersGames = () => {
  const navigate = useNavigate();
  const { providerCode } = useParams<{ providerCode: string }>();
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const { data: mainData } = useGetMainQuery();

  const [isSortingEnabled, setIsSortingEnabled] = useState(false);
  const [totalGames, setTotalGames] = useState<number>(0);

  const { optionalSideBarOpen } = useTheme();

  // useEffect(() => {
  //   if (!mainData) return;
  //   const tree: DataTree = {};
  //   mainData.forEach(({ providers }) => {
  //     providers?.forEach((provider) => {
  //       tree[provider.code] = provider;
  //     });
  //   });
  //   setDataTree(tree);
  // }, [mainData]);

  // useEffect(() => {
  //   if (dataTree && !provider) navigate(-1);
  // }, [dataTree, provider, navigate]);

  console.log(mainData)



  return (
    <div className="container mx-auto px-2 lg:px-0">
      <ProviderSliderFromApi categorySlug={categorySlug}/>
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

                  <button
                    onClick={() => setIsSortingEnabled((p) => !p)}
                    className={`px-3 py-1 rounded-full border  text-sm font-semibold transition ${
                      isSortingEnabled
                        ? "border-card text-card bg-popover"
                        : "border border-gray-600 text-gray-300 hover:border-card hover:text-white"
                    }`}
                  >
                    A-Z
                  </button>
                </div>
              </div>

              <div className="min-h-screen">
                <GameListRenderer
                  key={providerCode || "all"}
                  provider_general_codes={providerCode ? [providerCode] : null}
                  order_by={isSortingEnabled ? "name" : "order"}
                  onTotalChange={setTotalGames}
                  gameDynamicClass="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer/>
    </div>
  );
};

export default ProvidersGames;
