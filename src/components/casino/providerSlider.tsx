import * as React from "react";
import config from "@/config";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { Trans } from "@lingui/react/macro";
import type { Provider } from "@/types/main";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {useEffect, useState} from "react";

interface Props {
  providers: Provider[];
}

const ProviderSlider: React.FC<Props> = ({ providers }) => {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();

  const { categorySlug } = useParams<{
    categorySlug?: string;
  }>();

    const useWindowWidth = () => {
        const [width, setWidth] = useState(window.innerWidth);
        useEffect(() => {
            const handleResize = () => setWidth(window.innerWidth);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);

        return width;
    };
    const width = useWindowWidth();
    const limit = width >= 1210 ? 8 : width >= 1060 ? 7 : width >= 910 ? 6 : width >= 718 ? 5 : width >= 500 ? 4 : 3;

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2
            className={`font-bold flex-1 ${isDesktop ? "text-lg" : "text-sm"}`}>
            <Trans>Publishers</Trans>
          </h2>

          <button
            onClick={() =>
              navigate(
                categorySlug ? `/${categorySlug}/providers` : "/providers"
              )
            } className="flex items-center gap-1 text-sm lg:hover:underline disabled:opacity-50">
            <span>
              <Trans>View all</Trans>
            </span>
            {isDesktop && <span>({providers.length})</span>}
          </button>
        </div>

        <Carousel
          opts={{
            align: "start",
            slidesToScroll: limit,
          }}
          className="w-full">
            <div className="relative w-max">
                <CarouselPrevious className="hidden md:flex"/>
                <CarouselNext className="hidden md:flex"
                              disabled = {
                                  providers.length < (limit)
                              } />
            </div>
          <CarouselContent className="flex -ml-2">
            {providers.map((p) => (
              <CarouselItem
                key={p.id}
                className={`pl-2 min-[1210px]:basis-1/8 min-[1060px]:basis-1/7 min-[910px]:basis-1/6 min-[718px]:basis-1/5 min-[500px]:basis-1/4 basis-1/3 cursor-pointer`}
                onClick={() => navigate(`/${categorySlug}/provider/${p.code}`)}
              >
                <div className="flex items-center justify-center rounded-lg bg-card/10 lg:hover:bg-card/20 transition h-[68px] md:h-[88px]">
                  <img
                    className="max-w-[80%] max-h-9 md:max-w-[156px] md:max-h-14"
                    src={config.baseUrl + "/storage/" + p.logo}
                    loading="lazy"
                    alt={p.name}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default ProviderSlider;
