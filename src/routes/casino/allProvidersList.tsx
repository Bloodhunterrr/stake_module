import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";
import { useNavigate } from "react-router";
import { useGetMainQuery } from "@/services/mainApi";
import { useState } from "react";
import type { Provider } from "@/types/main";
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
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center rounded-full justify-center w-10 h-10 border border-gray-600 text-gray-700 hover:border-primary hover:bg-primary hover:text-white transition"
              >
                <ArrowUpIcon className="w-4 h-4 -rotate-90" />
              </button>

              <div>
                <h1 className="font-bold text-lg text-gray-900">
                  All Providers
                </h1>
                {finalProviders.length > 0 && (
                  <p className="text-gray-500 text-sm">
                    {finalProviders.length} providers
                  </p>
                )}
              </div>

              <button
                onClick={() => setIsSortingEnabled((prev) => !prev)}
                className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold border transition ${
                  isSortingEnabled
                    ? "bg-primary border-primary text-white hover:bg-primary-dark"
                    : "border-gray-600 text-gray-700 hover:border-primary hover:text-primary hover:bg-gray-100"
                }`}
              >
                A-Z
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {finalProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="cursor-pointer flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-400 transition p-4"
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
      <Footer />
    </>
  );
};

export default AllProvidersList;
