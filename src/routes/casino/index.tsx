import { useGetMainQuery } from "@/services/mainApi";
import { useNavigate, useParams } from "react-router";
import Sport from "@/routes/sport";
import InstallAppBanner from "@/components/shared/install-app-banner";
import Footer from "@/components/shared/v2/footer.tsx";
import type { Provider } from "@/types/main";
import LobbyBannerSlider from "@/components/casino/lobbyBannerSlider";
import Jackpot from "@/components/shared/v2/jackpot";
import SingleSubcategorySlider from "@/components/shared/v2/casino/single-subcategory-slider.tsx";
import ProviderSliderFromApi from "@/components/casino/provider-slider-from-api";
import LobbySlider from "@/components/casino/lobbySlider";

const Lobby = () => {
  const { data, error, isLoading } = useGetMainQuery();
  const { categorySlug } = useParams();
  const navigate = useNavigate();

  if (isLoading || error) {
    return null;
  }

  if (!data || !Array.isArray(data)) {
    navigate("/");
    return null;
  }

  const isValidCategory = data.some((el) => el.slug === categorySlug);

  if (!isValidCategory && categorySlug) {
    navigate("/");
  }

  const activeCategory = data.find((el) => el.slug === categorySlug) ?? data[0];

  if (activeCategory?.is_sportbook) {
    return <Sport />;
  }

  const allProviders = data.reduce<Provider[]>((acc, category) => {
    category.providers?.forEach((p) => {
      if (!acc.find((prov) => prov.id === p.id)) acc.push(p);
    });
    return acc;
  }, []);

  const categoryProviders = categorySlug
    ? activeCategory?.providers || []
    : allProviders;

  return (
    <div className="lg:px-0 px-3 gap-5 flex flex-col container mx-auto">
      <section className="container mx-auto">
        <SingleSubcategorySlider
          data={data.map((category) => ({
            [category.slug]: {
              subcategories: category.subcategories || [],
            },
          }))}
        />
      </section>

     
      {activeCategory && <ProviderSliderFromApi categorySlug={categorySlug} />}

      <section className="container space-y-4 mx-auto">
        <LobbyBannerSlider />
        {/*<BigWinsSlider/>*/}
      </section>

      {categorySlug === "casino" && <Jackpot />}

      <div>
        {activeCategory?.subcategories.map((subcategory, index) => {
          const middleIndex = Math.floor(
            activeCategory.subcategories.length / 2
          );

          if (index === middleIndex - 1) {
            return (
              <section className="conteiner mx-auto">
                <LobbySlider
                  key={subcategory.id}
                  categorySlug={categorySlug ?? data[0]?.slug}
                  subcategory={subcategory}
                  providers={categoryProviders}
                />
                <InstallAppBanner key="install-app-banner" />
              </section>
            );
          }

          return (
            <LobbySlider
              providers={categoryProviders}
              key={subcategory.id}
              categorySlug={categorySlug ?? data[0]?.slug}
              subcategory={subcategory}
            />
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default Lobby;
