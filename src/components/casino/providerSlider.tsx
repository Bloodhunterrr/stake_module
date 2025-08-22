import * as React from "react";
import { useNavigate } from "react-router";
import { useIsDesktop } from "@/hooks/useIsDesktop";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Provider } from "@/types/main";
import config from "@/config";

interface Props {
  providers: Provider[];
}

const ProviderSlider: React.FC<Props> = ({ providers }) => {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();

  return (
    <section className="py-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2
            className={`font-bold ${isDesktop ? "text-lg" : "text-sm"} flex-1`}
          >
            Providers
          </h2>

          <button
            onClick={() => navigate(`/providers`)}
            className="flex items-center gap-1 text-sm border px-1.5 py-1 rounded-lg text-[13px] text-primary-foreground cursor-pointer disabled:opacity-50"
          >
            <span>View all</span>
            {isDesktop && <span>({providers.length})</span>}
          </button>
        </div>

        <Carousel
          opts={{
            align: "start",
            slidesToScroll: isDesktop ? 9 : 3,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-2">
            {providers.map((p) => (
              <CarouselItem
                key={p.id}
                className={`pl-2 ${
                  isDesktop ? "basis-1/9" : "basis-1/3"
                } cursor-pointer`}
                onClick={() => navigate(`/provider/${p.code}`)}
              >
                <div className="flex items-center justify-center rounded-lg  bg-card/10 hover:bg-card/20 transition h-[68px] md:h-[88px]">
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

          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default ProviderSlider;
