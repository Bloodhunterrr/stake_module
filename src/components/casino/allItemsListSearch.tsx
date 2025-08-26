import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import SearchIcon  from "@/assets/icons/search.svg?react";
import CloseIcon  from "@/assets/icons/close.svg?react";
import type {Provider, Subcategory} from "@/types/main";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import NoDataAvailable from "@/components/shared/v2/no-data-available/NoDataAvailable";
import config from "@/config.ts";
import { useLingui } from "@lingui/react/macro";

type Props = {
  items: Provider[] | Subcategory[];
  onClose: () => void;
  type: "provider" | "subcategory";
};

const AllItemsList = ({ items, onClose, type }: Props) => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const [searchVal, setSearchVal] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  const filteredItems = useMemo(() => {
    if (!searchVal) return items;

    const lower = searchVal.toLowerCase();

    if (type === "provider") {
      return (items as Provider[]).filter((provider) =>
        provider.name.toLowerCase().includes(lower)
      );
    } else {
      return (items as Subcategory[]).filter((subcategory) =>
        subcategory.name.toLowerCase().includes(lower)
      );
    }
  }, [items, searchVal, type]);

  const { t } = useLingui()

  return (
    <div className="select-screen">
      <div className="search-wrapper">
        <div
          className="m-input m-gradient-border m-input--dark m-input--m search-input select-screen__input relative flex items-center pl-3.5 h-10 rounded-full bg-popover hover:bg-popover/80 w-full gap-2"
          tabIndex={0}
        >
          <div className="m-icon-container m-input-prepend">
            <SearchIcon className="m-icon m-icon-loadable size-5 text-muted-foreground" />
          </div>
          <div className="m-input-content w-[calc(100%_-_70px)]">
            <input
              onChange={handleSearchChange}
              value={searchVal}
              id="select-screen-input"
              placeholder={t`Search`}
              className="search-input select-screen__input flex placeholder:text-primary-foreground/70 text-primary-foreground placeholder:text-sm placeholder:font-semibold h-10 border-none focus-visible:outline-none focus-visible:border-none focus-visible:ring-0 rounded-full items-center gap-2 cursor-pointer transition w-full"
            />
          </div>
          {searchVal && (
            <div
              onClick={() => setSearchVal("")}
              className="m-icon-container m-input-append size-5 text-muted-foreground"
            >
              <CloseIcon className="m-icon m-icon-loadable" />
            </div>
          )}
        </div>
      </div>

      <div
        className="Wrapper m-thin-scrollbar"
        style={{
          marginTop: 20,
          overflow: "auto",
          paddingRight: 24,
          marginRight: -24,
        }}>
        {filteredItems.length === 0 ? (
          <div style={{ padding: "1rem" }}>
            <NoDataAvailable info={null} />
          </div>
        ) : (
          <div className={`grid ${isDesktop ? "grid-cols-3" : "grid-cols-2"} gap-[16px]`}>
            {filteredItems.map((item) => {
              if (type === "provider") {
                const provider = item as Provider;
                return (
                  <div
                    key={provider.id}
                    className="m-category-slider__item"
                    onClick={() => {
                      navigate("/provider/" + provider.code);
                      onClose();
                    }}
                  >
                    <div className="provider-card all-providers bg-[#2a2d35] hover:bg-[#373b45] transition-[background] items-center cursor-pointer flex h-[50px] max-[960px]:h-[68px] justify-center min-w-[130px] rounded-xl">
                      <img
                        className="provider-card__img h-[calc(100%_-_15px)]"
                        src={`${config.baseUrl}/storage/${provider.logo}`}
                        loading="lazy"
                        alt={provider.name}
                      />
                    </div>
                  </div>
                );
              } else {
                const subcategory = item as Subcategory;
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
                    style={{ cursor: "pointer" }}
                  >
                    <div className="provider-card all-providers all-subcategories bg-[#2a2d35] hover:bg-[#373b45] transition-[background] duration-[0.3s] ease-[ease] items-center cursor-pointer flex gap-2.5 justify-start px-5 py-0 h-[50px] max-[960px]:h-[68px] min-w-[130px] rounded-xl">
                      <img
                        className="provider-card__icon h-[calc(100%_-_15px)]"
                        src={`${config.baseUrl}/storage/${subcategory.icon}`}
                        alt={subcategory.name}
                        loading="lazy"
                      />
                      <p className="subcategory-card__name text-[15px] overflow-hidden text-ellipsis whitespace-nowrap text-white font-semibold">{subcategory.name}</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllItemsList;
