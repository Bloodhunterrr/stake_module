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
import { useNavigate, useParams } from "react-router";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import type { Provider, ProviderListRequest } from "@/types/provider_list";
import { useGetProviderListQuery } from "@/services/mainApi";

const DESKTOP_LIMIT = 9;
const MOBILE_LIMIT = 3;

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

  const limit = isDesktop ? DESKTOP_LIMIT : MOBILE_LIMIT;

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
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className={`font-bold flex-1 ${isDesktop ? "text-lg" : "text-sm"}`}>
            <Trans>Providers</Trans>
          </h2>

          <button onClick={() =>
              navigate(
                categorySlug ? `/${categorySlug}/providers` : "/providers"
              )
            }
            disabled={isFetching || isLoading}
            className="flex items-center gap-1 text-sm hover:underline disabled:opacity-50">
            <span>
              <Trans>View all</Trans>
            </span>
            {isDesktop && total > 0 && <span>({total})</span>}
          </button>
        </div>

        <Carousel opts={{
            align: "start",
            slidesToScroll: isDesktop ? DESKTOP_LIMIT : MOBILE_LIMIT,
          }} className="w-full">
          <CarouselContent className="flex -ml-2">
            {isLoading || isFetching ? Array.from({
                  length: isDesktop ? DESKTOP_LIMIT : MOBILE_LIMIT,
                }).map((_, i) => (
                  <CarouselItem key={`sk-${i}`}
                    className={`pl-2 ${
                      isDesktop ? "basis-1/9" : "basis-[calc(100%/4)]"
                    }`}>
                    <div className="flex items-center justify-center rounded-lg bg-popover/50 hover:bg-popover/80 h-[50px] md:h-[55px]" />
                  </CarouselItem>
                ))
              : providers.filter(
                    (provider, index, self) =>
                      index === self.findIndex((p) => p.id === provider.id)
                  ).map((p: Provider) => (
                    <CarouselItem
                      key={p.id}
                      className={`pl-2 ${
                        isDesktop ? "basis-1/9" : "basis-[calc(100%/3)]"
                      } cursor-pointer`}
                      onClick={() =>
                        navigate(`/${categorySlug}/provider/${p.general_code}`)
                      }>
                      <div
                        className={`flex items-center justify-center rounded-lg bg-popover/50 hover:bg-popover/80 transition h-[50px] md:h-[55px] ${
                          providerCode === p.general_code ? "!bg-popover" : ""
                        }`}>
                        <img
                          className="max-w-[80%] max-h-9 md:max-w-[156px]"
                          src={
                            p.logo ? `${config.baseUrl}/storage/${p.logo}` : ""
                          } loading="lazy"
                          alt={p.name}/>
                      </div>
                    </CarouselItem>
                  ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex"
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0 || isFetching || isLoading}/>

          <CarouselNext className="hidden md:flex"
            onClick={() => setOffset(offset + limit)}
            disabled={
              isFetching ||
              isLoading ||
              providers.length < limit ||
              offset + limit >= total
            }/>
        </Carousel>
      </div>
    </section>
  );
};

export default ProviderSliderFromApi;
