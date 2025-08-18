import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";
import { useNavigate, useParams } from "react-router";
import { useGetMainQuery } from "@/services/mainApi";
import { useEffect, useState } from "react";
import type { Subcategory } from "@/types/main";
import Footer from "@/components/shared/footer";
import GameListRenderer from "./gameListRenderer";
import LiveCasinoGameListRenderer from "@/components/shared/v2/casino/single-live-casino-category.tsx";
import SingleSubcategorySlider from "@/components/shared/v2/casino/single-subcategory-slider.tsx";

interface Category {
  id: number;
  slug: string;
  name: string;
  subcategories: Record<string, Subcategory>;
}
type DataTree = Record<string, Category>;

const SubcategoryGames = () => {
  const navigate = useNavigate();
  const { categorySlug = "", subCategorySlug = "" } = useParams<{
    categorySlug: string;
    subCategorySlug: string;
  }>();

  const { data: mainData } = useGetMainQuery();
  const [dataTree, setDataTree] = useState<DataTree | null>(null);
  const [isSortingEnabled, setIsSortingEnabled] = useState(false);
  const [totalGames, setTotalGames] = useState<number>(0);

  useEffect(() => {
    if (!mainData) return;
    const tree: DataTree = {};
    mainData.forEach(({ id, slug, name, subcategories }) => {
      tree[slug] = { id, slug, name, subcategories: {} };
      subcategories?.forEach((s) => {
        tree[slug].subcategories[s.slug] = s;
      });
    });
    setDataTree(tree);
  }, [mainData]);

  const category = dataTree?.[categorySlug];
  const subcategory = category?.subcategories[subCategorySlug];
  useEffect(() => {
    if (dataTree && (!category || !subcategory)) navigate(-1);
  }, [dataTree, category, subcategory, navigate]);

  return (
      <>
          {mainData && (
              <SingleSubcategorySlider
                  showBanner={true}
                  paramsSubcategory={subcategory?.slug}
                  data={mainData.map((category) => ({
                    [category.slug]: {
                      subcategories: category.subcategories || [],
                    },
                  }))}
              />
          )}
        <div className="container mx-auto">

          <section id="category-section">
            <div className="">
              <div className="">
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center just gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-10 h-10 rounded-full text-card border border-card cursor-pointer hover:border-card hover:bg-popover hover:text-white transition"
                    >
                      <ArrowUpIcon className="w-4 h-4 -rotate-90"/>
                    </button>
                    <div>
                      <h1 className="font-bold text-lg text-primary-foreground">
                        {subcategory?.name ?? "Top Games"}
                      </h1>
                      {totalGames > 0 && (
                          <p className="text-gray-500 text-sm">
                            {totalGames} games
                          </p>
                      )}
                    </div>
                  </div>
                  <button
                      onClick={() => setIsSortingEnabled((p) => !p)}
                      className={`px-3 py-1 rounded-full text-sm border font-semibold transition ${
                          isSortingEnabled
                              ? "bg-popover border-transparent text-card"
                              : "text-white border-card hover:text-white"
                      }`}
                  >
                    A-Z
                  </button>
                </div>
                <div className="p-3">
                  {
                    categorySlug === "casino-live" ? <LiveCasinoGameListRenderer
                        categoryId={subcategory?.id}
                        order_by={isSortingEnabled ? "name" : "order"}
                        onTotalChange={setTotalGames}
                        gameDynamicClass="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-6 lg:gap-2"
                    /> : <GameListRenderer
                        categoryId={subcategory?.id}
                        order_by={isSortingEnabled ? "name" : "order"}
                        onTotalChange={setTotalGames}
                        gameDynamicClass="grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-2"
                    />
                  }
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer/>
      </>
  );
};

export default SubcategoryGames;
