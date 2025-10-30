import { useGetMainQuery, useGetProviderListQuery } from "@/services/mainApi";
import { useNavigate, useParams } from "react-router";
import Sport from "@/routes/sport";
import InstallAppBanner from "@/components/shared/install-app-banner";
import LobbyBannerSlider from "@/components/casino/lobbyBannerSlider";
import Jackpot from "@/components/shared/v2/jackpot";
import SingleSubcategorySlider from "@/components/shared/v2/casino/single-subcategory-slider.tsx";
import ProviderSliderFromApi from "@/components/casino/provider-slider-from-api";
import LobbySlider from "@/components/casino/lobbySlider";
import CategoriesSlider from "@/routes/casino/categoriesSlider.tsx";
import {useState} from "react";

export default function Lobby() {
    const { data, error, isLoading } = useGetMainQuery();
    const { categorySlug } = useParams();
    const navigate = useNavigate();
    const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

    const {
        data: providerData,
        isLoading: isProvidersLoading,
        isFetching: isProvidersFetching,
    } = useGetProviderListQuery({
        device: "desktop",
        offset: 0,
        limit: 300,
        order_by: "order",
        order_dir: "asc",
        ...(categorySlug ? { routeSlug: [categorySlug] } : {}),
    });

    const handleSubcategoryClick = (subcategoryId: string | null) => {
        setActiveSubcategory(subcategoryId);
    };

    if (isLoading || error || isProvidersLoading || isProvidersFetching) {
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

    const categoryProviders = providerData?.providers ?? [];

    const filteredSubcategories = activeSubcategory
        ? activeCategory?.subcategories.filter(sub => sub.id.toString() === activeSubcategory)
        : activeCategory?.subcategories;

    return (
        <div className="min-h-[calc(100dvh_-_450px)] lg:px-0 gap-5 flex flex-col w-[94dvw] md:w-[calc(94dvw_-_60px)] min-[1440px]:max-w-300 ml-auto mr-[3dvw] min-[1440px]:mr-auto mt-5">
            <section className="w-full space-y-4 mx-auto">
                <LobbyBannerSlider />
            </section>

            <section className="w-full mx-auto">
                <SingleSubcategorySlider data={data.map((category) => ({
                    [category.slug]: {
                        subcategories: category.subcategories || [],
                    },
                }))} />
            </section>

            {categorySlug === "casino" && <Jackpot />}
            <CategoriesSlider categories={activeCategory}
                onSubcategoryClick={handleSubcategoryClick}
                activeSubcategory={activeSubcategory}
                casino={categorySlug}/>

            <div>
                {filteredSubcategories?.map((subcategory, index) => {
                    const middleIndex = Math.floor(
                        activeCategory.subcategories.length / 2
                    );

                    // Only show InstallAppBanner when showing all categories and at the middle
                    const shouldShowInstallAppBanner = !activeSubcategory && index === middleIndex - 1;

                    if (shouldShowInstallAppBanner) {
                        return (
                            <section key={`section-${subcategory.id}`}>
                                <LobbySlider
                                    key={subcategory.id}
                                    categorySlug={categorySlug ?? data[0]?.slug}
                                    subcategory={subcategory}
                                    providers={categoryProviders}/>
                                <InstallAppBanner key="install-app-banner" />
                            </section>
                        );
                    }

                    return (
                        <LobbySlider
                            key={subcategory.id}
                            providers={categoryProviders}
                            categorySlug={categorySlug ?? data[0]?.slug}
                            subcategory={subcategory}
                        />
                    );
                })}
            </div>

            {activeCategory && <ProviderSliderFromApi categorySlug={categorySlug} />}
        </div>
    );
};