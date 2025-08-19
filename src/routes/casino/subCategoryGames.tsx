import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";
import { useNavigate, useParams } from "react-router";
import { useGetMainQuery } from "@/services/mainApi";
import { useEffect, useState } from "react";
import type { Subcategory } from "@/types/main";
import Footer from "@/components/shared/footer";
import GameListRenderer from "./gameListRenderer";
import LiveCasinoGameListRenderer from "@/components/shared/v2/casino/single-live-casino-category.tsx";
import SingleSubcategorySlider from "@/components/shared/v2/casino/single-subcategory-slider.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Settings2 , ArrowUpDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {Badge} from "@/components/ui/badge.tsx";

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

  const providers = mainData?.filter((c) => c.slug === categorySlug);
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

                  <Sheet>
                    <div className={'border rounded-full text-xs flex px-3 py-1 flex items-center gap-2'}>
                      <button
                          onClick={() => setIsSortingEnabled((p) => !p)}
                          className={'flex gap-1 items-center flex-row w-1/2'}>
                        <ArrowUpDown size={18}  className={` ${
                            isSortingEnabled
                                ? "text-card"
                                : "text-white  "
                        }`}/>
                        <span
                        >
                          Sort
                        </span>
                      </button>
                      <SheetTrigger className={'w-1/2 flex gap-1 flex-row items-center justify-center'}>
                        <Settings2 size={20}/>
                        <span>Filter</span>
                      </SheetTrigger>
                    </div>
                    <SheetContent closeIconClassName={'text-primary-foreground focus:ring-none focus:ring-0 focus:ring-offset-0'} className={'border-none w-full border-r sm:max-w-sm'}>
                      <SheetHeader className={' h-26 flex items-center justify-end'}>
                        <SheetTitle className={'text-2xl font-semibold text-primary-foreground'}>Filters</SheetTitle>
                      </SheetHeader>
                      <div className={'px-4'}>
                        <Accordion type="single" collapsible>
                          <AccordionItem value="providers" className={'no-underline '}>
                            <AccordionTrigger className={'flex text-primary-foreground items-center justify-start text-lg hover:no-underline'}>Providers</AccordionTrigger>
                            <AccordionContent className={'flex-1 space-x-2 space-y-4 overflow-y-scroll h-[80vh] gap-2 '}>
                              {
                                providers?.map((provider) => (
                                    provider.providers.map((p) => (
                                        <Badge onClick={()=>{navigate(`/provider/${p.code}`)}} variant="secondary" className={'text-xs cursor-pointer bg-popover border-[1px] border-card/30 text-primary-foreground p-1 uppercase'}>{p.name}</Badge>
                                    ))
                                ))
                              }
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                <div className="p-3">
                  {
                    categorySlug === "casino-live" ? <LiveCasinoGameListRenderer
                        categoryId={subcategory?.id}
                        order_by={isSortingEnabled ? "name" : "order"}
                        onTotalChange={setTotalGames}
                        gameDynamicClass="grid grid-cols-2 md:grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-6 lg:gap-2"
                    /> : <GameListRenderer
                        categoryId={subcategory?.id}
                        order_by={isSortingEnabled ? "name" : "order"}
                        onTotalChange={setTotalGames}
                        gameDynamicClass="grid grid-cols-2 md:grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-2"
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
