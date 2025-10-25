import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AllItemsList from "./allItemsListSearch";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useGetMainQuery } from "@/services/mainApi";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loading from "@/components/shared/v2/loading.tsx";
import type { Provider, Subcategory } from "@/types/main";
import GameListRenderer from "@/routes/casino/gameListRenderer";
import { X, ChevronDown, Search as SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

const Search = ({ onCloseSearchModal = () => {} }: { onCloseSearchModal?: () => void }) => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [categoryModal, setCategoryModal] = useState<boolean>(false);
  const [selectedCategoryItems, setSelectedCategoryItems] = useState<Array<SearchFilterChild>>([]);

  const [providerModal, setProviderModal] = useState<boolean>(false);
  const [selectedProviderItems, setSelectedProviderItems] = useState<Array<SearchFilterChild>>([]);

  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<any[]>([]);

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
    setSelectedCategoryItems((prev) => prev.filter((c) => c.combinedId !== item.combinedId));
    setSelectedProviderItems((prev) => prev.filter((p) => p.combinedId !== item.combinedId));
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
    const provItems: SearchFilterItem[] = [];
    const allProvidersMap = new Map<number, Provider>();

    const _allSubcategories: (Subcategory & { categorySlug: string })[] = [];

    mainData.forEach((category: any) => {
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

      if (category.providers?.length > 0) {
        provItems.push({
          id: category.id,
          name: category.name,
          children: category.providers.map((provider: Provider) => {
            if (!allProvidersMap.has(provider.id)) {
              allProvidersMap.set(provider.id, provider);
            }
            return {
              id: provider.id,
              combinedId: `${category.id}${category.name}${provider.id}${provider.name}`,
              name: provider.name,
            } as SearchFilterChild;
          }),
        });
      }
    });

    const uniqueProviders: Provider[] = Array.from(allProvidersMap.values());
    setAllProviders(uniqueProviders);
    setAllSubcategories(_allSubcategories);
  }, [mainData]);

  const selectedCount = useMemo(() => selectedCategoryItems.length + selectedProviderItems.length, [selectedCategoryItems, selectedProviderItems]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search input */}
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-xl">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-60" />
          <Input
            aria-label="Search games"
            placeholder="Search"
            value={searchQuery ?? ""}
            onChange={handleSearchChange}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setProviderModal(true)} className="min-w-[9rem] justify-between">
            <span className="flex items-center gap-2 text-white/70">Provider</span>
            <div className="flex items-center gap-2">
              {selectedProviderItems.length > 0 && (
                <Badge variant="secondary" className="rounded-full">{selectedProviderItems.length}</Badge>
              )}
              <ChevronDown className="h-4 w-4 opacity-70" />
            </div>
          </Button>

          <Button variant="outline" onClick={() => setCategoryModal(true)} className="min-w-[9rem] justify-between">
            <span className="flex items-center gap-2 text-white/70">Category</span>
            <div className="flex items-center gap-2">
              {selectedCategoryItems.length > 0 && (
                <Badge variant="secondary" className="rounded-full">{selectedCategoryItems.length}</Badge>
              )}
              <ChevronDown className="h-4 w-4 opacity-70" />
            </div>
          </Button>
        </div>
      </div>

      {/* Active tags */}
      {selectedCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {[
            ...selectedCategoryItems.map((i) => ({ ...i, _type: "category" as const })),
            ...selectedProviderItems.map((i) => ({ ...i, _type: "provider" as const })),
          ].map((item) => (
            <Badge key={`selected-${item.combinedId}`} variant="secondary" className="flex items-center gap-1">
              <span>{item.name}</span>
              <button
                onClick={() => removeSelectedItem(item)}
                className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full lg:hover:bg-muted"
                aria-label={`Remove ${item.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          <Button variant="link" className="px-1" onClick={clearAllSelected}>
            Clear all
          </Button>
        </div>
      )}

      {/* Results header */}
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Search results</h3>
        {totalGames > 0 && (
          <Badge variant="outline" className="text-sm h-6 text-white/70">{totalGames}</Badge>
        )}
      </div>

      {/* Results grid */}
      <div>
        <div className="p-3">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loading />
            </div>
          ) : (
            <GameListRenderer
              categoriesIDs={selectedCategoryItems.map((c) => c.id)}
              providersIDs={selectedProviderItems.map((p) => p.id)}
              searchQuery={debouncedSearch ?? ""}
              order_by="order"
              onTotalChange={setTotalGames}
              skip={false}
              gameDynamicClass="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              showNoData={true}
            />
          )}
        </div>
      </div>

      {/* Category Dialog */}
      <Dialog open={categoryModal} onOpenChange={setCategoryModal}>
        <DialogContent className="max-h-[80vh] overflow-hidden p-0 top-[calc(50%_+_30px)] left-[calc(50%_+_30px)] w-[calc(100%-60px)] max-w-[calc(100%-60px)] min-w-[calc(100%-60px)] max-md:w-full max-md:max-w-full max-md:min-w-full" closeButtonClassName="text-white w-[20px] h-[20px]">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-white/70">Categories</DialogTitle>
          </DialogHeader>
          <Separator />
          <ScrollArea className="h-[70vh] px-6 pt-1 pb-6">
            <AllItemsList
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

      {/* Provider Dialog */}
      <Dialog open={providerModal} onOpenChange={setProviderModal}>
        <DialogContent className="max-h-[80vh] overflow-hidden p-0 w-[calc(100%-60px)] max-w-[calc(100%-60px)] min-w-[calc(100%-60px)] max-md:w-full max-md:max-w-full max-md:min-w-full" closeButtonClassName="text-white w-[20px] h-[20px]">
          <DialogHeader className="px-6 pt-5">
            <DialogTitle className="text-white/70">Providers</DialogTitle>
          </DialogHeader>
          <Separator />
          <ScrollArea className="h-[70vh] px-6 pt-1 pb-6">
            <AllItemsList
              items={allProviders}
              type="provider"
              onClose={() => {
                setProviderModal(false);
                onCloseSearchModal();
              }}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Search;
