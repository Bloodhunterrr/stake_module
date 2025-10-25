import config from "@/config";
import * as React from "react";
import { Trans } from "@lingui/react/macro";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useNavigate, useParams } from "react-router";
import { useGetProviderListQuery } from "@/services/mainApi";
import type { Provider, ProviderListRequest } from "@/types/provider_list";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import {useEffect, useState} from "react";
import CarouselBtns from "@/components/ui/carouselBtns.tsx";

const ProviderSliderFromApi = ({
  categorySlug,
  providerGeneralSlugs,
  search,
}: {
  categorySlug?: string;
  providerGeneralSlugs?: string[];
  search?: string;
}) => {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const { providerCode } = useParams<{ providerCode?: string }>();

  const [offset, setOffset] = React.useState(0);

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
  const limit = width >= 1210 ? 8 : width >= 1060 ? 7 : width >= 910 ? 6 : width >= 718 ? 5 : 4;

  const request: ProviderListRequest = React.useMemo(
    () => ({
      device: isDesktop ? "desktop" : "mobile",
      offset,
      limit,
      order_by: "order",
      order_dir: "asc",
      search,
      ...(categorySlug ? { routeSlug: [categorySlug] } : {}),
      ...(providerGeneralSlugs?.length
        ? { provider_general_codes: providerGeneralSlugs }
        : {}),
    }),
    [isDesktop, offset, limit, search, categorySlug, providerGeneralSlugs]
  );

  React.useEffect(() => {
    setOffset(0);
  }, [categorySlug]);

  const { data, isFetching, isLoading } = useGetProviderListQuery(request);

  const providers = data?.providers ?? [];
  const total = data?.total ?? 0;

  return (
    <section>
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className={`font-bold flex-1 ${isDesktop ? "text-lg" : "text-sm"}`}>
            <Trans>Providers</Trans>
          </h2>

          <button onClick={() => navigate(categorySlug ? `/${categorySlug}/providers` : "/providers")}
            disabled={isFetching || isLoading} className="flex items-center gap-1 text-sm lg:hover:underline disabled:opacity-50">
            <span>
              <Trans>View all</Trans>
            </span>
            {isDesktop && total > 0 && <span>({total})</span>}
          </button>
            <CarouselBtns className={"hidden md:flex relative size-8 rounded-full box-content bg-transparent lg:hover:bg-popover/50 border border-[color:var(--grey-400)] items-center cursor-pointer text-white lg:hover:text-white border-solid h-[40px] w-[56px] m-0"}
                          prevClassName={"rounded-tr-none rounded-br-none top-0 left-0"}
                          nextClassName={"rounded-tl-none rounded-bl-none top-0 right-0"}
                          prevOnClick={() => setOffset(Math.max(0, offset - limit))}
                          prevDisabled={offset === 0 || isFetching || isLoading}
                          nextOnClick={() => setOffset(offset + limit)}
                          nextDisabled={isFetching || isLoading || providers.length < limit || offset + limit >= total} />
        </div>

        <Carousel opts={{
            align: "start",
            slidesToScroll: limit,
          }} className="w-full [position:initial]">
          <CarouselContent className="flex -ml-2 my-2">
            {isLoading || isFetching ? Array.from({
                  length: limit,
                }).map((_, i) => (
                  <CarouselItem key={`sk-${i}`}
                    className={`pl-2 min-[1210px]:basis-1/8 min-[1060px]:basis-1/7 min-[910px]:basis-1/6 min-[718px]:basis-1/5 basis-1/4`}>
                    <div className="flex items-center justify-center rounded-lg bg-popover/50 lg:hover:bg-popover/80 h-[50px] md:h-[55px]" />
                  </CarouselItem>
                ))
              : providers.filter(
                    (provider, index, self) =>
                      index === self.findIndex((p) => p.id === provider.id)
                  ).map((p: Provider) => (
                    <CarouselItem key={p.id}
                      className={`pl-2 min-[1210px]:basis-1/8 min-[1060px]:basis-1/7 min-[910px]:basis-1/6 min-[718px]:basis-1/5 basis-1/4`}
                      onClick={() =>
                        navigate(`/${categorySlug}/provider/${p.general_code}`)
                      }>
                      <div
                        className={`flex items-center justify-center rounded-lg bg-[var(--grey-400)]/80 lg:hover:lg:translate-y-[-6%] transition-transform duration-300 max-w-[169px] max-h-[67px] aspect-[2.52239_/_1] group ${
                          providerCode === p.general_code ? "!bg-popover" : ""
                        }`}>
                        <img
                          className="max-w-[80%] max-h-9 md:max-w-[156px] grayscale-[1] mix-blend-hard-light duration-300 transition-all lg:group-hover:grayscale-[0] lg:group-hover:mix-blend-initial"
                          src={
                            p.logo ? `${config.baseUrl}/storage/${p.logo}` : ""
                          } loading="lazy"
                          alt={p.name}/>
                      </div>
                    </CarouselItem>
                  ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default ProviderSliderFromApi;
