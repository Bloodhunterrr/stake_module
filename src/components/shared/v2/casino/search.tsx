import GameListRenderer from "@/routes/casino/gameListRenderer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGetMainQuery, useGetProviderListQuery } from "@/services/mainApi";
import type { Subcategory } from "@/types/main";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Search as SearchIcon,
  LoaderCircle,
} from "lucide-react";
import AllItemsList from "@/components/casino/allItemsListSearch.tsx";
import { Trans, useLingui } from "@lingui/react/macro";
import { useParams } from "react-router";
import type { Provider, ProviderListRequest } from "@/types/provider_list";
import { useIsDesktop } from "@/hooks/useIsDesktop";

const useDebounce = (value: string | null, delay: number): string | null => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

interface SearchFilterChild {
  id: number;
  combinedId: string;
  name: string;
}

interface SearchFilterItem {
  id: number;
  name: string;
  children: SearchFilterChild[];
}

const Search = ({
  onCloseSearchModal = () => {},
  setSearchModal,
}: {
  onCloseSearchModal?: () => void;
  setSearchModal?: (value: boolean) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isDesktop = useIsDesktop();
  const [categoryModal, setCategoryModal] = useState<boolean>(false);
  const [selectedCategoryItems, setSelectedCategoryItems] = useState<
    Array<SearchFilterChild>
  >([]);

  const [providerModal, setProviderModal] = useState<boolean>(false);
  const [selectedProviderItems, setSelectedProviderItems] = useState<
    Array<SearchFilterChild>
  >([]);

  const [allSubcategories, setAllSubcategories] = useState<any[]>([]);

  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const limit = 20;

  const request: ProviderListRequest = useMemo(
    () => ({
      device: isDesktop ? "desktop" : "mobile",
      offset,
      limit,
      order_by: "order",
      order_dir: "asc",
    }),
    [isDesktop, offset, limit]
  );

  const { data, isFetching } = useGetProviderListQuery(request, {
    skip: offset > 0 && !hasMore,
  });

  useEffect(() => {
    if (!data) return;

    setAllProviders((prev) => {
      const incoming = data.providers || [];
      if (offset === 0) return incoming;

      const map = new Map<number, Provider>();
      for (const p of prev) map.set(p.id, p);
      for (const p of incoming) map.set(p.id, p);
      return Array.from(map.values());
    });

    setHasMore((data.providers?.length || 0) === limit);
    setIsLoadingMore(false);
  }, [data, offset, limit]);

  const observerRef = useRef<IntersectionObserver>(null);
  const sentinelRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetching || isLoadingMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isFetching &&
          !isLoadingMore
        ) {
          setIsLoadingMore(true);
          setOffset((prev) => prev + limit);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetching, isLoadingMore, hasMore, limit]
  );

  const debouncedSearch = useDebounce(searchQuery, 300);
  const { data: mainData } = useGetMainQuery();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsLoading(true);
  };

  const clearAllSelected = () => {
    setSelectedCategoryItems([]);
    setSelectedProviderItems([]);
  };

  const removeSelectedItem = (item: SearchFilterChild) => {
    setSelectedCategoryItems((prev) =>
      prev.filter((c) => c.combinedId !== item.combinedId)
    );
    setSelectedProviderItems((prev) =>
      prev.filter((p) => p.combinedId !== item.combinedId)
    );
  };

  useEffect(() => {
    if (debouncedSearch && debouncedSearch.trim() === "") {
      setIsLoading(false);
      setTotalGames(0);
      return;
    }
    const timeout = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timeout);
  }, [debouncedSearch, totalGames]);

  useEffect(() => {
    if (!mainData) return;

    const catItems: SearchFilterItem[] = [];
    const _allSubcategories: (Subcategory & { categorySlug: string })[] = [];

    mainData.forEach((category: any) => {
      console.log(category);
      if (category.subcategories?.length > 0) {
        catItems.push({
          id: category.id,
          name: category.name,
          children: category.subcategories.map((sCat: any) => ({
            id: sCat.id,
            combinedId: `${category.id}${category.name}${sCat.id}${sCat.name}`,
            name: sCat.name,
          })),
        });

        category.subcategories.forEach((sCat: any) => {
          _allSubcategories.push({
            ...sCat,
            categorySlug: category.slug,
          });
        });
      }

     
    });

    setAllSubcategories(_allSubcategories);
  }, [mainData]);

  const selectedCount = useMemo(
    () => selectedCategoryItems.length + selectedProviderItems.length,
    [selectedCategoryItems, selectedProviderItems]
  );

  const { t } = useLingui();
  const params = useParams();
  return (
    <div className="flex flex-col items-start w-[94dvw] md:w-[calc(94dvw_-_60px)] min-[1440px]:max-w-315 ml-auto mr-[3dvw] min-[1440px]:mr-auto min-[1440px]:pr-15 mx-auto gap-4 z-101">
      <div className="flex sticky top-0 z-20 bg-[#1a2e38]/90 flex-col pb-2 pt-5 items-center w-full gap-2 max-md:px-[3vw]">
        <div className="relative flex items-center px-3 h-12 rounded-lg bg-[var(--grey-700)] border-2 border-solid border-[var(--grey-400)] lg:hover:border-[var(--grey-300)] transition-all duration-[0.25s] w-full">
          <SearchIcon className="size-6 text-[var(--grey-300)]" />
          <Input
            tabIndex={1}
            aria-label="Search games"
            placeholder={t`Search`}
            value={searchQuery ?? ""}
            onChange={handleSearchChange}
            className="flex placeholder:text-[#566671] text-white placeholder:text-md placeholder:font-normal h-12 border-none focus-visible:outline-none focus-visible:border-none focus-visible:ring-0 rounded-full items-center gap-2 px-3 transition"/>
          {/*{searchQuery && (*/}
          {/*  <Button*/}
          {/*    type="button"*/}
          {/*    variant="ghost"*/}
          {/*    size="icon"*/}
          {/*    className="absolute right-10 lg:hover:bg-transparent border-0 border-transparent top-1/2 -translate-y-1/2"*/}
          {/*    onClick={() => setSearchQuery("")}*/}
          {/*    aria-label="Clear search">*/}
          {/*    <X className="size-5 text-[#ffffff80] lg:hover:text-white transition-all duration-[0.1s]" />*/}
          {/*  </Button>*/}
          {/*)}*/}
          <div
            onClick={() => {
              if (setSearchModal) {
                setSearchModal(false);
              }
            }}
            className="h-full flex items-center justify-end cursor-pointer w-12 text-primary-foreground text-[10px] font-medium">
            <X className="size-5 text-[#ffffff80] hover:text-white transition-all duration-[0.1s]" />
          </div>
        </div>

        {/*<div className="flex items-center gap-2">*/}
        {/*  <Button variant="outline" onClick={() => setProviderModal(true)}*/}
        {/*    className="min-w-[9rem] justify-between text-white border-2 border-[var(--grey-400)] hover:border-[var(--grey-300)] hover:bg-[var(--grey-600)] hover:text-white bg-[var(--grey-700)]">*/}
        {/*    <span className="flex items-center gap-2">*/}
        {/*      <Trans>Provider</Trans>*/}
        {/*    </span>*/}
        {/*    <div className="flex items-center gap-2 relative left-1 lg:group-hover:!bg-black">*/}
        {/*      {selectedProviderItems.length > 0 && (*/}
        {/*        <Badge variant="secondary" className="rounded-full">*/}
        {/*          {selectedProviderItems.length}*/}
        {/*        </Badge>*/}
        {/*      )}*/}
        {/*      <ChevronDown className="h-4 w-4 opacity-70" />*/}
        {/*    </div>*/}
        {/*  </Button>*/}

        {/*  <Button variant="outline" onClick={() => setCategoryModal(true)}*/}
        {/*    className="min-w-[9rem] justify-between text-white border-2 border-[var(--grey-400)] hover:border-[var(--grey-300)] hover:bg-[var(--grey-600)] hover:text-white bg-[var(--grey-700)]">*/}
        {/*    <span className="flex items-center gap-2">*/}
        {/*      <Trans>Category</Trans>*/}
        {/*    </span>*/}
        {/*    <div className="flex items-center gap-2 relative left-1 lg:group-hover:!bg-black">*/}
        {/*      {selectedCategoryItems.length > 0 && (*/}
        {/*        <Badge variant="secondary" className="rounded-full">*/}
        {/*          {selectedCategoryItems.length}*/}
        {/*        </Badge>*/}
        {/*      )}*/}
        {/*      <ChevronDown className="h-4 w-4 opacity-70" />*/}
        {/*    </div>*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </div>

      {selectedCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-2">
          {[
            ...selectedCategoryItems.map((i) => ({
              ...i,
              _type: "category" as const,
            })),
            ...selectedProviderItems.map((i) => ({
              ...i,
              _type: "provider" as const,
            })),
          ].map((item) => (
            <Badge
              key={`selected-${item.combinedId}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <span>{item.name}</span>
              <button
                onClick={() => removeSelectedItem(item)}
                className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted"
                aria-label={`Remove ${item.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          <Button variant="link" className="px-1" onClick={clearAllSelected}>
            <Trans>Clear all</Trans>
          </Button>
        </div>
      )}
      <div className="flex flex-col items-start w-full container mx-auto gap-4">
          <div className="flex flex-row items-center px-[10px] max-md:px-[3vw] gap-3">
              <h3 className="text-md font-semibold text-white">
                  <Trans>Search results</Trans>
              </h3>
              {totalGames > 0 && (
                  <Badge variant="outline"
                      className="text-sm font-bold h-6 bg-[var(--grey-700)] border-2 border-[var(--grey-400)] select-none rounded-1 text-white py-1 px-1.5">
                      {totalGames}
                  </Badge>
              )}
          </div>
          <div className={"w-full flex flex-col items-center justify-center"}>
              <div className="py-3 max-md:px-[3vw] w-full">
                  {isLoading ? (
                      <div className="flex h-40 items-center justify-center">
                          <LoaderCircle className="w-10 h-10 animate-spin text-card stroke-[1px]" />
                      </div>
                  ) : (
                      <GameListRenderer
                          categoriesIDs={selectedCategoryItems.map((c) => c.id)}
                          providersIDs={selectedProviderItems.map((p) => p.id)}
                          searchQuery={debouncedSearch ?? ""}
                          order_by="order"
                          onTotalChange={setTotalGames}
                          skip={false}
                          gameDynamicClass="grid grid-cols-3 min-[500px]:grid-cols-4 min-[718px]:grid-cols-5 min-[910px]:grid-cols-6 min-[1060px]:grid-cols-7 min-[1210px]:grid-cols-8 gap-x-2 gap-y-4"
                          showNoData={true}
                      />
                  )}
              </div>
          </div>
      </div>


      <Dialog open={categoryModal} onOpenChange={setCategoryModal}>
        <DialogContent
          overlayClassName={"bg-black/80"}
          className="lg:max-h-[80vh] h-full gap-0 rounded-none border-none overflow-hidden p-0 w-[calc(100%-60px)] max-w-[calc(100%-60px)] min-w-[calc(100%-60px)] max-md:w-full max-md:max-w-full max-md:min-w-full"
          closeButtonClassName="text-primary-foreground w-[20px] h-[20px]">
          <DialogHeader className="lg:px-6 h-14 lg:h-9 flex items-center justify-center pb-0 border-none lg:pt-5">
            <DialogTitle className="text-white/70">
              <Trans>Categories</Trans>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="lg:h-[70vh] h-[90vh] px-6 ">
            <AllItemsList
              params={params?.categorySlug ?? ""}
              items={allSubcategories}
              type="subcategory"
              onClose={() => {
                setCategoryModal(false);
                onCloseSearchModal();
              }}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={providerModal} onOpenChange={setProviderModal}>
        <DialogContent
          overlayClassName={"bg-black/80"}
          className="lg:max-h-[80vh]  h-full gap-0 rounded-none border-none overflow-hidden p-0 top-[calc(50%_+_30px)] left-[calc(50%_+_30px)] w-[calc(100%-60px)] max-w-[calc(100%-60px)] min-w-[calc(100%-60px)] max-md:left-1/2 max-md:w-full max-md:max-w-full max-md:min-w-full"
          closeButtonClassName="text-primary-foreground w-[20px] h-[20px]">
          <DialogHeader className="lg:px-6 h-14 lg:h-9 flex items-center justify-center pb-0 border-none lg:pt-5">
            <DialogTitle className="text-white/70">
              <Trans>Providers</Trans>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="lg:h-[70vh] h-[90vh] px-6 ">
            <AllItemsList
              params={params?.categorySlug ?? ""}
              items={allProviders}
              type="provider"
              onClose={() => {
                setProviderModal(false);
                onCloseSearchModal();
              }}
            />

            {hasMore && <div ref={sentinelRef} style={{ height: "20px" }} />}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Search;
