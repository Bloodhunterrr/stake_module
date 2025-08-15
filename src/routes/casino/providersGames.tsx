import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useGetMainQuery } from "@/services/mainApi";
import type { Provider } from "@/types/main";
import Footer from "@/components/shared/footer";
import GameListRenderer from "./gameListRenderer";

type DataTree = Record<string, Provider>;

const ProvidersGames = () => {
  const navigate = useNavigate();
  const { providerCode } = useParams<{ providerCode: string }>();
  const { data: mainData } = useGetMainQuery();

  const [dataTree, setDataTree] = useState<DataTree | null>(null);
  const [isSortingEnabled, setIsSortingEnabled] = useState(false);
  const [totalGames, setTotalGames] = useState<number>(0);


  useEffect(() => {
    if (!mainData) return;
    const tree: DataTree = {};
    mainData.forEach(({ providers }) => {
      providers?.forEach((provider) => {
        tree[provider.code] = provider;
      });
    });
    setDataTree(tree);
  }, [mainData]);

  const provider = dataTree?.[providerCode as string];

  useEffect(() => {
    if (dataTree && !provider) navigate(-1);
  }, [dataTree, provider, navigate]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="category-wrapper">
        <section id="category-section" className="CategorySection">
          <div className="category-games-section">
            <div className="items-grid-wrapper">
              <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-600 text-gray-700 hover:border-primary hover:bg-primary hover:text-white transition"
                  >
                    <ArrowUpIcon className="w-4 h-4 -rotate-90" />
                  </button>

                  <div>
                    <h1 className="font-bold text-lg text-gray-900">
                      {provider?.name ?? ""}
                    </h1>
                    {totalGames > 0 && (
                      <p className="text-gray-500 text-sm">{totalGames} games</p>
                    )}
                  </div>

                  <button
                    onClick={() => setIsSortingEnabled((p) => !p)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                      isSortingEnabled
                        ? "bg-primary text-white"
                        : "border border-gray-600 text-gray-300 hover:border-primary hover:text-white"
                    }`}
                  >
                    A-Z
                  </button>
                </div>
              </div>

              <div className="Wrapper">
                <GameListRenderer
                  providerId={provider?.id}
                  order_by={isSortingEnabled ? "name" : "order"}
                  onTotalChange={setTotalGames}
                  gameDynamicClass="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ProvidersGames;
