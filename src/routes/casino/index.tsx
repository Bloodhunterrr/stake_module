import LobbySlider from "@/components/casino/lobbySlider";
import { useGetMainQuery } from "@/services/mainApi";
import { useNavigate, useParams } from "react-router";
import Sport from "@/routes/sport";
import InstallAppBanner from "@/components/shared/install-app-banner";
import Footer from "@/components/shared/footer";
import ProviderSlider from "@/components/casino/providerSlider";
import type { Provider } from "@/types/main";
import FeedbackForm from "@/components/casino/feedbackForm";
import BottomBanner from "@/components/casino/bottomBanner";
import homeBanner from "@/assets/images/home-banner.png";
import casinoLiveBanner from "@/assets/images/casino-live-banner.jpg";
import BigWinsSlider from "@/components/casino/bigWinsSlider";
import SubcategorySlider from "@/components/casino/subcategorySlider";
import JackpotBanner from "@/components/casino/jackpotBanner";
import LobbyBannerSlider from "@/components/casino/lobbyBannerSlider";

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
    if (category.providers?.length > 0) {
      category.providers.forEach((provider) => {
        const exists = acc.some((p) => p.id === provider.id);
        if (!exists) {
          acc.push(provider);
        }
      });
    }
    return acc;
  }, []);

  return (
    <div className="mx-auto gap-5 flex flex-col max-w-[1400px]">
      {categorySlug === "casino-live" && (
        <section>
          <div>
            <img src={casinoLiveBanner} alt="Banner" width="100%" />
          </div>
        </section>
      )}

      {categorySlug === "casino" && (
        <section>
          <div>
            <img src={homeBanner} alt="Banner" width="100%"/>
          </div>
        </section>
      )}

      <SubcategorySlider
        data={data.map((category) => ({
          [category.slug]: {
            subcategories: category.subcategories || [],
          },
        }))}
      />

      <section>
        <JackpotBanner />
      </section>

      {categorySlug === "casino" && (
        <>
          <LobbyBannerSlider />
          <BigWinsSlider />
        </>
      )}

      <div>
        {activeCategory?.subcategories.map((subcategory, index) => {
          const middleIndex = Math.floor(
            activeCategory.subcategories.length / 2
          );

          if (index === middleIndex - 1) {
            return (
              <>
                <LobbySlider
                  key={subcategory.id}
                  categorySlug={categorySlug ?? data[0]?.slug}
                  subcategory={subcategory}
                />
                <InstallAppBanner key="install-app-banner" />
              </>
            );
          }

          return (
            <LobbySlider
              key={subcategory.id}
              categorySlug={categorySlug ?? data[0]?.slug}
              subcategory={subcategory}
            />
          );
        })}

        {activeCategory && activeCategory.providers.length > 0 && (
          <ProviderSlider providers={allProviders} />
        )}

        <FeedbackForm />
        <BottomBanner />
      </div>

      <Footer />
    </div>
  );
};

export default Lobby;
