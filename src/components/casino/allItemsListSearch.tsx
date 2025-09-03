import React, { useState, useMemo } from "react";
import {useNavigate, useParams} from "react-router";
import SearchIcon from "@/assets/icons/search.svg?react";
import CloseIcon from "@/assets/icons/close.svg?react";
import type { Subcategory } from "@/types/main";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import NoDataAvailable from "@/components/shared/v2/no-data-available.tsx";
import config from "@/config.ts";
import { Trans, useLingui } from "@lingui/react/macro";
import type { Provider } from "@/types/provider_list";

type Props = {
  items: Provider[] | Subcategory[];
  onClose: () => void;
  type: "provider" | "subcategory";
  params?: string;
};

const AllItemsList = ({ items, onClose, type, params }: Props) => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const { t } = useLingui();
  const { categorySlug } = useParams<{ categorySlug?: string }>();

  const [searchVal, setSearchVal] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  const filteredItems = useMemo(() => {
    if (!searchVal) return items;
    const lower = searchVal.toLowerCase();
    if (type === "provider") {
      return (items as Provider[]).filter((p) =>
        p.name.toLowerCase().includes(lower)
      );
    } else {
      return (items as Subcategory[]).filter((s) =>
        s.name.toLowerCase().includes(lower)
      );
    }
  }, [items, searchVal, type]);

  const subcategoryTranslations: Record<string, any> = {
    "Video Slots": <Trans>Video Slots</Trans>,
    "Megaways": <Trans>Megaways</Trans>,
    "Instant Games": <Trans>Instant Games</Trans>,
    "Egyptian Theme": <Trans>Egyptian Theme</Trans>,
    "Rome": <Trans>Rome</Trans>,
    "New Trend": <Trans>New Trend</Trans>,
    "y2worldsoft": <Trans>y2worldsoft</Trans>,
    "testpopok": <Trans>testpopok</Trans>,
    "Baccarat": <Trans>Baccarat</Trans>,
    "Game Show": <Trans>Game Show</Trans>,
    "Roulette": <Trans>Roulette</Trans>,
    "Blackjack": <Trans>Blackjack</Trans>,
    "Lobby": <Trans>Lobby</Trans>,
    "Lobby Crash": <Trans>Lobby Crash</Trans>,
    "Virtual Games": <Trans>Virtual Games</Trans>,
    "Keno & Lottery": <Trans>Keno & Lottery</Trans>,
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="sticky top-0 z-20 bg-background/90 p-2 pt-4 pb-3">
        <div className="relative flex items-center pl-3.5 h-10 rounded-full bg-popover hover:bg-popover/80 w-full gap-2">
          <SearchIcon className="size-5 text-muted-foreground" />
          <input
            onChange={handleSearchChange}
            value={searchVal}
            placeholder={t`Search`}
            className="flex placeholder:text-primary-foreground/70 text-primary-foreground placeholder:text-sm placeholder:font-semibold h-10 border-none focus-visible:outline-none focus-visible:ring-0 rounded-full w-full"
          />
          {searchVal && (
            <div
              onClick={() => setSearchVal("")}
              className="absolute right-3 cursor-pointer"
            >
              <CloseIcon className="size-5 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>


      <div
        className="flex-1 overflow-auto mt-2 p-2"
        style={{ paddingRight: 12 }}
      >
        {filteredItems.length === 0 ? (
          <div className="p-4">
            <NoDataAvailable info={null} />
          </div>
        ) : (
          <div
            className={`grid gap-4 ${
              type === "subcategory"
                ? isDesktop
                  ? "lg:grid-cols-3"
                  : "grid-cols-1"
                : isDesktop
                ? "lg:grid-cols-3"
                : "grid-cols-2"
            }`}
          >
            {filteredItems.map((item) => {
              if (type === "provider") {
                const provider = item as Provider;
                return (
                  <div
                    key={provider.id}
                    className="m-category-slider__item"
                    onClick={() => {
                      navigate(`/${categorySlug}/provider/` + provider.code);
                      onClose();
                    }}
                  >
                    <div className="provider-card all-providers bg-popover/50 hover:bg-popover transition flex items-center justify-center cursor-pointer h-[50px] max-[960px]:h-[68px] min-w-[130px] rounded-xl">
                      <img
                        className="provider-card__img h-[calc(100%-15px)]"
                        src={`${config.baseUrl}/storage/${provider.logo}`}
                        loading="lazy"
                        alt={provider.name}
                      />
                    </div>
                  </div>
                );
              } else {
                const subcategory = item as Subcategory;
                if (subcategory.categorySlug === params) {
                  return (
                    <div
                      key={subcategory.id}
                      className="m-category-slider__item"
                      onClick={() => {
                        navigate(
                          `/${subcategory.categorySlug}/games/${subcategory.slug}`
                        );
                        onClose();
                      }}
                    >
                      <div className="provider-card all-providers all-subcategories bg-popover/50 hover:bg-popover transition flex gap-2.5 items-center justify-start px-5 h-[50px] max-[960px]:h-[68px] min-w-[130px] rounded-xl">
                        <img
                          className="provider-card__icon h-[calc(100%-15px)]"
                          src={`${config.baseUrl}/storage/${subcategory.icon}`}
                          alt={subcategory.name}
                          loading="lazy"
                        />
                        <p className="subcategory-card__name text-[15px] overflow-hidden text-ellipsis whitespace-nowrap text-white font-semibold">
                          {subcategoryTranslations[subcategory.name] ??
                            subcategory.name}
                        </p>
                      </div>
                    </div>
                  );
                }
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllItemsList;
