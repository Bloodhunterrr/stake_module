import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";
import { useNavigate } from "react-router";
import { useGetMainQuery } from "@/services/mainApi";
import { useState } from "react";
import type { Provider } from "@/types/main";
import Footer from "@/components/shared/footer";
import config from "@/config";
import {cn} from "@/lib/utils.ts";
import {useTheme} from "@/hooks/useTheme.tsx";

const AllProvidersList = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetMainQuery();
  const [isSortingEnabled, setIsSortingEnabled] = useState(false);
  const {optionalSideBarOpen} = useTheme();

  if (isLoading || error) return null;
  if (!data || !Array.isArray(data)) {
    navigate("/");
    return null;
  }

  const allProviders = data.reduce<Provider[]>((acc, category) => {
    if (category.providers?.length > 0) {
      category.providers.forEach((provider) => {
        if (!acc.some((p) => p.id === provider.id)) {
          acc.push(provider);
        }
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
        <div className="min-h-screen">
          <section className="">
            <div className="max-w-7xl mx-auto px-4">
              <div className={cn("sticky top-16 bg-background  z-10 py-2 ", {
                'top-27 lg:top-16': optionalSideBarOpen
              })}>
                <div className="p-3 flex items-center justify-between">
                  <div className={'flex items-center gap-x-3 '}>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-10 h-10 rounded-full text-card border border-card cursor-pointer hover:border-card hover:bg-popover hover:text-white transition"
                    >
                      <ArrowUpIcon className="w-4 h-4 -rotate-90"/>
                    </button>

                    <div>
                      <h1 className="font-bold text-lg text-primary-foreground">
                        {"All Providers"}
                      </h1>
                      {finalProviders.length > 0 && (
                          <p className="text-gray-500 text-sm">
                            {finalProviders.length} providers
                          </p>
                      )}
                    </div>
                  </div>


                  <button
                      onClick={() => setIsSortingEnabled((p) => !p)}
                      className={`px-3 py-1 rounded-full border  text-sm font-semibold transition ${
                          isSortingEnabled
                              ? "border-card text-card bg-popover"
                              : "border border-gray-600 text-gray-300 hover:border-card hover:text-white"
                      }`}
                  >
                    A-Z
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {finalProviders.map((provider) => (
                    <div
                        key={provider.id}
                        className="cursor-pointer aspect-sqaure h-full  flex items-center justify-center rounded-lg bg-card/10 hover:bg-card/20 transition p-4"
                        onClick={() => navigate(`/provider/${provider.code}`)}
                    >
                      <img
                          className="max-h-14 max-w-[80%]"
                          src={config.baseUrl + "/storage/" + provider.logo}
                          loading="lazy"
                          alt={provider.name}
                      />
                    </div>
                ))}
              </div>
            </div>
          </section>
        </div>
        <Footer/>
      </>
  );
};

export default AllProvidersList;
