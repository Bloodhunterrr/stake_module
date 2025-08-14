import ArrowUpIcon  from "@/assets/icons/arrow-up.svg?react";
import { useNavigate } from "react-router";

import { useGetMainQuery } from "@/services/mainApi";
import { useState } from "react";
import type {Provider} from "@/types/main";
import Footer from "@/components/shared/footer";
import config from "@/config";

const AllProvidersList = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetMainQuery();
  const [isSortingEnabled, setIsSortingEnabled] = useState(false);

  if (isLoading || error) return null;
  if (!data || !Array.isArray(data)) {
    navigate("/");
    return null;
  }

  const allProviders = data.reduce<Provider[]>((acc, category) => {
    if (category.providers?.length > 0) {
      category.providers.forEach((provider) => {
        const exists = acc.some((p) => p.id === provider.id);
        if (!exists) acc.push(provider);
      });
    }
    return acc;
  }, []);

  const sortedProviders = [...allProviders].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const finalProviders = isSortingEnabled ? sortedProviders : allProviders;

  return (
    <>
      <div className="category-wrapper">
        <section id="category-section" className="CategorySection">
          <div className="category-games-section">
            <div className="items-grid-wrapper">
              <div className="items-grid-header items-grid-header--sticky">
                <div className="Wrapper">
                  <div className="list-header">
                    <div className="list-header__button">
                      <button
                        onClick={() => navigate(-1)}
                        className="m-button m-gradient-border m-button--secondary m-button--m"
                      >
                        <div className="m-icon-container">
                          <ArrowUpIcon
                            className="m-icon m-icon-loadable"
                            style={{ transform: "rotate(270deg)" }}
                          />
                        </div>
                      </button>
                    </div>

                    <div>
                      <p className="m-text m-fs16 m-fw700 m-lh150">
                        <div>All Providers</div>
                      </p>
                      {finalProviders.length > 0 && (
                        <p
                          className="m-text m-fs12 m-fw500 m-lh160"
                          style={{ color: "var(--color-mid-grey-1)" }}
                        >
                          {finalProviders.length} <div>providers</div>
                        </p>
                      )}
                    </div>

                    <div className="list-header__sort">
                      <button
                        onClick={() => setIsSortingEnabled((prev) => !prev)}
                        className={`m-button m-gradient-border m-button--${
                          isSortingEnabled
                            ? "primary"
                            : "outline m-button--secondary"
                        } m-button--m`}
                      >
                        <div className="m-button-content">
                          <p
                            className="m-text m-fs12 m-fw600 m-lh160"
                            style={{ color: "var(--color-white)" }}
                          >
                            A-Z
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="Wrapper">
                <div className="items-grid items-grid--cols5 grid__columns--2 grid__column-gap--16">
                  {finalProviders.map((provider) => (
                    <div
                      key={provider.id}
                      className="m-category-slider__item"
                      onClick={() => navigate("/provider/" + provider.code)}
                    >
                      <div className="provider-card all-providers">
                        <img
                          className="provider-card__img"
                          src={config.baseUrl + "/storage/" + provider.logo}
                          loading="lazy"
                          alt={provider.name}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AllProvidersList;
