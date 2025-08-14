import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";
import SearchIcon from "@/assets/icons/search.svg?react";
import CloseIcon from "@/assets/icons/close.svg?react";

import GameListRenderer from "@/routes/casino/gameListRenderer";
import { useEffect, useState } from "react";
import "./search.css";
import { LoaderSpinner } from "@/components/shared/Loader";
import { useGetMainQuery } from "@/services/mainApi";
import type { Provider, Subcategory } from "@/types/main";
import AllItemsList from "./allItemsListSearch";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

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
}: {
  onCloseSearchModal?: () => void;
}) => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [categoryModal, setCategoryModal] = useState<boolean>(false);
  const [selectedCategoryItems, setSelectedCategoryItems] = useState<
    Array<SearchFilterChild>
  >([]);

  const [providerModal, setProviderModal] = useState<boolean>(false);
  const [selectedProviderItems, setSelectedProviderItems] = useState<
    Array<SearchFilterChild>
  >([]);

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

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [debouncedSearch, totalGames]);

  useEffect(() => {
    if (!mainData) return;

    const catItems: SearchFilterItem[] = [];
    const provItems: SearchFilterItem[] = [];
    const allProvidersMap = new Map<number, Provider>();

    const allSubcategories: (Subcategory & { categorySlug: string })[] = [];

    mainData.forEach((category) => {
      if (category.subcategories?.length > 0) {
        catItems.push({
          id: category.id,
          name: category.name,
          children: category.subcategories.map((sCat) => ({
            id: sCat.id,
            combinedId: category.id + category.name + sCat.id + sCat.name,
            name: sCat.name,
          })),
        });

        category.subcategories.forEach((sCat) => {
          allSubcategories.push({
            ...sCat,
            categorySlug: category.slug,
          });
        });
      }

      if (category.providers?.length > 0) {
        provItems.push({
          id: category.id,
          name: category.name,
          children: category.providers.map((provider) => {
            if (!allProvidersMap.has(provider.id)) {
              allProvidersMap.set(provider.id, provider);
            }
            return {
              id: provider.id,
              combinedId:
                category.id + category.name + provider.id + provider.name,
              name: provider.name,
            };
          }),
        });
      }
    });

    const allProviders: Provider[] = Array.from(allProvidersMap.values());

    setAllProviders(allProviders);
    setAllSubcategories(allSubcategories);
  }, [mainData]);

  return (
    <>
      <div className="search-wrapper">
        <div className="m-input m-gradient-border m-input--dark m-input--m search-input">
          <div className="m-icon-container m-input-prepend">
            <SearchIcon className="w-6 h-6" />
          </div>
          <div className="m-input-content">
            <input
              placeholder="Search"
              className="search-input"
              value={searchQuery ?? ""}
              onChange={handleSearchChange}
              aria-label="Search games"
            />
          </div>
          {searchQuery && (
            <div
              onClick={() => setSearchQuery(null)}
              className="m-icon-container m-input-append"
            >
              <CloseIcon className="w-6 h-6" />
            </div>
          )}
        </div>

        <div className="search-filters">
          <div
            className="m-dropdown m-select search-filters__select"
            onClick={() => setProviderModal(true)}
          >
            <div className="m-dropdown-activator">
              <div className="m-input m-gradient-border m-input--dark m-input--m">
                <div className="m-input-content">
                  <input disabled type="text" placeholder=" " />
                  <div className="m-input-content-label">
                    <div className="search-filters__label">
                      <div>Provider</div>
                      {selectedProviderItems.length > 0 && (
                        <div className="m-counter m-counter--secondary m-counter--l">
                          <div className="m-counter-content">
                            {selectedProviderItems.length}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="m-input-append">
                  <div className="m-icon-container">
                    <ArrowDownIcon className="m-icon m-icon-loadable m-chevron m-select-chevron" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="m-dropdown m-select search-filters__select"
            onClick={() => setCategoryModal(true)}
          >
            <div className="m-dropdown-activator">
              <div className="m-input m-gradient-border m-input--dark m-input--m">
                <div className="m-input-content">
                  <input disabled type="text" placeholder=" " />
                  <div className="m-input-content-label">
                    <div className="search-filters__label">
                      <div>Category</div>
                      {selectedCategoryItems.length > 0 && (
                        <div className="m-counter m-counter--secondary m-counter--l">
                          <div className="m-counter-content">
                            {selectedCategoryItems.length}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="m-input-append">
                  <div className="m-icon-container">
                    <ArrowDownIcon className="m-icon m-icon-loadable m-chevron m-select-chevron" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {[...selectedCategoryItems, ...selectedProviderItems].length > 0 && (
          <div className="search-tags">
            <div className="search-tags__combobox">
              {[...selectedCategoryItems, ...selectedProviderItems].map(
                (item) => (
                  <div
                    key={`selected-${item.combinedId}`}
                    className="m-tag m-tag--s m-tag--fill m-gradient-border"
                  >
                    <div className="m-tag-content">{item.name}</div>
                    <div
                      className="m-icon-container m-tag-append"
                      onClick={() => removeSelectedItem(item)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Remove ${item.name}`}
                    >
                      <CloseIcon className="m-icon m-icon-loadable" />
                    </div>
                  </div>
                )
              )}

              <p
                className="m-text m-fs12 m-fw600 m-lh160 m-combobox-search-clear"
                style={{ color: "var(--color-white)" }}
                onClick={clearAllSelected}
                role="button"
                tabIndex={0}
              >
                <div>Clear all</div>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="search-results__header-wrapper">
        <p
          className="m-text m-fs16 m-fw700 m-lh150"
          style={{ color: "var(--color-light-grey-5)" }}
        >
          <div>Search results</div>
        </p>
        {totalGames > 0 && (
          <div className="m-counter m-counter--secondary m-counter--xl">
            <div className="m-counter-content">{totalGames}</div>
          </div>
        )}
      </div>

      <div className="search-results m-thin-scrollbar">
        <div className="games-section-search games-section-search--web">
          <div className="ItemsGridSearch-wrapper">
            {isLoading ? (
              <div className="load-spinner-wrapper">
                <LoaderSpinner />
              </div>
            ) : (
              <GameListRenderer
                categoriesIDs={selectedCategoryItems.map((c) => c.id)}
                providersIDs={selectedProviderItems.map((p) => p.id)}
                searchQuery={debouncedSearch ?? ""}
                order_by="order"
                onTotalChange={setTotalGames}
                skip={false}
                gameDynamicClass="items-grid--cols4"
                showNoData={true}
              />
            )}
          </div>
        </div>
      </div>

      <Dialog open={categoryModal} onOpenChange={() => setCategoryModal(false)}>
        <DialogContent className="overflow-auto max-h-[80%]">
          <DialogTitle>Categories</DialogTitle>
          <AllItemsList
            items={allSubcategories}
            type="subcategory"
            onClose={() => {
              setProviderModal(false);
              setCategoryModal(false);
              onCloseSearchModal();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={providerModal} onOpenChange={() => setProviderModal(false)}>
        <DialogContent className="overflow-auto max-h-[80%]">
          <DialogTitle>Providers</DialogTitle>
          <AllItemsList
            items={allProviders}
            type="provider"
            onClose={() => {
              setProviderModal(false);
              setCategoryModal(false);
              onCloseSearchModal();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Search;
