import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import SearchIcon  from "@/assets/icons/search.svg?react";
import CloseIcon  from "@/assets/icons/close.svg?react";
import type {Provider, Subcategory} from "@/types/main";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import NoDataAvailable from "@/components/shared/v2/no-data-available/NoDataAvailable";
import config from "@/config.ts";

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

  return (
    <div className="select-screen">
      <div className="search-wrapper">
        <div
          className="m-input m-gradient-border m-input--dark m-input--m search-input select-screen__input"
          tabIndex={0}
        >
          <div className="m-icon-container m-input-prepend">
            <SearchIcon className="m-icon m-icon-loadable" />
          </div>
          <div className="m-input-content">
            <input
              onChange={handleSearchChange}
              value={searchVal}
              id="select-screen-input"
              placeholder="Search"
              className="search-input select-screen__input"
            />
          </div>
          {searchVal && (
            <div
              onClick={() => setSearchVal("")}
              className="m-icon-container m-input-append"
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
        }}
      >
        {filteredItems.length === 0 ? (
          <div style={{ padding: "1rem" }}>
            <NoDataAvailable info={null} />
          </div>
        ) : (
          <div
            className={`items-grid ${
              isDesktop ? "grid__columns--3" : "grid__columns--2"
            } grid__column-gap--16`}
          >
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
                    <div className="provider-card all-providers">
                      <img
                        className="provider-card__img"
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
                    <div className="provider-card all-providers all-subcategories">
                      <img
                        className="provider-card__icon"
                        src={`${config.baseUrl}/storage/${subcategory.icon}`}
                        alt={subcategory.name}
                        loading="lazy"
                      />
                      <p className="subcategory-card__name">{subcategory.name}</p>
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
