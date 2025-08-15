import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";
import { useNavigate, useParams } from "react-router";
import { useGetMainQuery } from "@/services/mainApi";
import { useEffect, useState } from "react";
import type { Subcategory } from "@/types/main";
import Footer from "@/components/shared/footer";
import GameListRenderer from "./gameListRenderer";
import SubcategorySlider from "@/components/casino/subcategorySlider";

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
      <div className="category-wrapper">
        {mainData && (
          <SubcategorySlider
            data={mainData.map((category) => ({
              [category.slug]: {
                subcategories: category.subcategories || [],
              },
            }))}
          />
        )}

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
                      {subcategory?.name ?? "Top Games"}
                    </h1>
                    {totalGames > 0 && (
                      <p className="text-gray-500 text-sm">
                        {totalGames} games
                      </p>
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
                  categoryId={subcategory?.id}
                  order_by={isSortingEnabled ? "name" : "order"}
                  onTotalChange={setTotalGames}
                  gameDynamicClass="items-grid--cols6"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default SubcategoryGames;
