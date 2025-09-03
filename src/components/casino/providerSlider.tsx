import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import config from "@/config";
import { Trans } from "@lingui/react/macro";
import { useNavigate } from "react-router";
import type { Provider } from "@/types/main";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useParams } from "react-router";

const DESKTOP_LIMIT = 9;
const MOBILE_LIMIT = 3;

interface Props {
  providers: Provider[];
}

const ProviderSlider: React.FC<Props> = ({ providers }) => {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();

  const { categorySlug } = useParams<{
    categorySlug?: string;
  }>();

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2
            className={`font-bold flex-1 ${isDesktop ? "text-lg" : "text-sm"}`}>
            <Trans>Providers</Trans>
          </h2>

          <button
            onClick={() =>
              navigate(
                categorySlug ? `/${categorySlug}/providers` : "/providers"
              )
            } className="flex items-center gap-1 text-sm hover:underline disabled:opacity-50">
            <span>
              <Trans>View all</Trans>
            </span>
            {isDesktop && <span>({providers.length})</span>}
          </button>
        </div>

        <Carousel
          opts={{
            align: "start",
            slidesToScroll: isDesktop ? DESKTOP_LIMIT : MOBILE_LIMIT,
          }}
          className="w-full">
          <CarouselContent className="flex -ml-2">
            {providers.map((p) => (
              <CarouselItem
                key={p.id}
                className={`pl-2 ${
                  isDesktop ? "basis-1/9" : "basis-[calc(100%/4)]" 
                } cursor-pointer`}
                onClick={() => navigate(`/${categorySlug}/provider/${p.code}`)}
              >
                <div className="flex items-center justify-center rounded-lg bg-card/10 hover:bg-card/20 transition h-[68px] md:h-[88px]">
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

          <CarouselPrevious className="hidden md:flex"/>
          <CarouselNext className="hidden md:flex"
          disabled = {
              providers.length < (isDesktop ? DESKTOP_LIMIT : MOBILE_LIMIT)
          } />
        </Carousel>
      </div>
    </section>
  );
};

export default ProviderSlider;
