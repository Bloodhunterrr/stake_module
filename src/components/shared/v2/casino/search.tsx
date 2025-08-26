import GameListRenderer from "@/routes/casino/gameListRenderer";
import { useEffect, useMemo, useState } from "react";
import { useGetMainQuery } from "@/services/mainApi";
import type { Provider, Subcategory } from "@/types/main";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, ChevronDown, Search as SearchIcon , LoaderCircle } from "lucide-react";
import AllItemsList from "@/components/casino/allItemsListSearch.tsx";
import {Trans, useLingui} from "@lingui/react/macro";

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

const Search = ({ onCloseSearchModal = () => {} , setSearchModal }: { onCloseSearchModal?: () => void  , setSearchModal?: (value: boolean) => void }) => {
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

    const { t } = useLingui()

    return (
        <div className="flex flex-col items-start w-full container mx-auto  gap-4">
            {/* Search input */}
            <div className="flex sticky top-0 z-20 bg-background/90 flex-col px-2 pb-2 items-center w-full gap-2 ">
                <p className={'h-12 flex items-center mt-6 text-semibold text-2xl text-muted lg:text-4xl'}><Trans>Search</Trans></p>
                <div className="relative flex items-center pl-3.5 h-10 rounded-full bg-popover hover:bg-popover/80 w-full ">
                    <SearchIcon className=" size-5 text-muted-foreground "/>
                    <Input
                        tabIndex={1}
                        aria-label="Search games"
                        placeholder={t`Search`}
                        value={searchQuery ?? ""}
                        onChange={handleSearchChange}
                        className="flex placeholder:text-primary-foreground text-primary-foreground placeholder:text-sm placeholder:font-semibold h-10 border-none focus-visible:outline-none focus-visible:border-none focus-visible:ring-0  rounded-full items-center gap-2 cursor-pointer px-3 transition"
                    />
                    {searchQuery && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-10 hover:bg-transparent border-0 border-transparent   top-1/2 -translate-y-1/2"
                            onClick={() => setSearchQuery("")}
                            aria-label="Clear search"
                        >
                            <X className="size-5 text-primary-foreground "/>
                        </Button>
                    )}
                    <div
                        onClick={() => {
                            if (setSearchModal) {
                                setSearchModal(false)
                            }
                        }}
                        className="h-full flex items-center justify-end pr-2 cursor-pointer w-12 text-primary-foreground text-[11px] font-medium mr-2">
                        <Trans>Close</Trans>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setProviderModal(true)}
                            className="min-w-[9rem] justify-between text-white/70 hover:text-black">
                        <span className="flex items-center gap-2"><Trans>Provider</Trans></span>
                        <div className="flex items-center gap-2 relative left-1 group-hover:!bg-black">
                            {selectedProviderItems.length > 0 && (
                                <Badge variant="secondary"
                                       className="rounded-full">{selectedProviderItems.length}</Badge>
                            )}
                            <ChevronDown className="h-4 w-4 opacity-70"/>
                        </div>
                    </Button>

                    <Button variant="outline" onClick={() => setCategoryModal(true)}
                            className="min-w-[9rem] justify-between text-white/70 hover:text-black">
                        <span className="flex items-center gap-2"><Trans>Category</Trans></span>
                        <div className="flex items-center gap-2 relative left-1 group-hover:!bg-black">
                            {selectedCategoryItems.length > 0 && (
                                <Badge variant="secondary" className="rounded-full">{selectedCategoryItems.length}</Badge>
                            )}
                            <ChevronDown className="h-4 w-4 opacity-70"/>
                        </div>
                    </Button>
                </div>
            </div>

            {/*/!* Active tags *!/*/}
            {selectedCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 px-2">
                    {[
                        ...selectedCategoryItems.map((i) => ({ ...i, _type: "category" as const })),
                        ...selectedProviderItems.map((i) => ({ ...i, _type: "provider" as const })),
                    ].map((item) => (
                        <Badge key={`selected-${item.combinedId}`} variant="secondary" className="flex  items-center gap-1">
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

            {/*/!* Results header *!/*/}
            <div className="flex flex-row items-center px-2 gap-3">

                <h3 className="text-md font-bold text-white"><Trans>Search results</Trans></h3>
                {totalGames > 0 && (
                    <Badge variant="outline" className="text-sm font-bold h-6 text-white bg-[#525766] rounded-4xl border-0 px-1.5">{totalGames}</Badge>
                )}
            </div>

            {/*/!* Results grid *!/*/}
            <div className={'w-full flex flex-col items-center justify-center'}>
                <div className="p-3 w-full">
                    {isLoading ? (
                        <div className="flex h-40 items-center justify-center">
                            <LoaderCircle className="w-10 h-10 animate-spin text-card stroke-[1px]"/>
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

            {/*/!* Category Dialog *!/*/}
            <Dialog open={categoryModal} onOpenChange={setCategoryModal}>
                <DialogContent className="max-h-[80vh] overflow-hidden p-0 xl:min-w-[700px]" closeButtonClassName="text-white w-[20px] h-[20px]">
                    <DialogHeader className="px-6 pt-5">
                        <DialogTitle className="text-white/70"><Trans>Categories</Trans></DialogTitle>
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

            {/*/!* Provider Dialog *!/*/}
            <Dialog open={providerModal} onOpenChange={setProviderModal}>
                <DialogContent className="max-h-[80vh] overflow-hidden p-0 xl:min-w-[700px]" closeButtonClassName="text-white w-[20px] h-[20px]">
                    <DialogHeader className="px-6 pt-5">
                        <DialogTitle className="text-white/70"><Trans>Providers</Trans></DialogTitle>
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
