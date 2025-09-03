import * as React from "react";
import { useNavigate, useParams } from "react-router";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useGetProviderListQuery } from "@/services/mainApi";
import type { ProviderListRequest, Provider } from "@/types/provider_list";
import Footer from "@/components/shared/v2/footer.tsx";
import config from "@/config";
import { cn } from "@/lib/utils.ts";
import { useTheme } from "@/hooks/useTheme.tsx";
import { useLingui } from "@lingui/react/macro";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";

const DESKTOP_LIMIT = 20;
const MOBILE_LIMIT = 12;

const AllProvidersList = () => {
  const navigate = useNavigate();
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const isDesktop = useIsDesktop();
  const { optionalSideBarOpen } = useTheme();
  const { t } = useLingui();

  const [offset, setOffset] = React.useState(0);
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [isSortingEnabled, setIsSortingEnabled] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const limit = isDesktop ? DESKTOP_LIMIT : MOBILE_LIMIT;


  React.useEffect(() => {
    setOffset(0);
    setProviders([]);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [categorySlug, isSortingEnabled, isDesktop]);

  const request: ProviderListRequest = React.useMemo(() => {
    const order_by: "order" | "name" = "order"; 
    const req: ProviderListRequest = {
      device: isDesktop ? "desktop" : "mobile",
      offset,
      limit,
      order_by,
      order_dir: "asc",
    };
    if (categorySlug) req.routeSlug = [categorySlug];
    return req;
  }, [isDesktop, offset, limit, categorySlug]);

  const { data, isFetching, isLoading, error } = useGetProviderListQuery(request, {
    skip: offset > 0 && !hasMore,
  });


  React.useEffect(() => {
    if (!data) return;

    setProviders((prev) => {
      const incoming = data.providers || [];
      if (offset === 0) return incoming;

      const map = new Map<number, Provider>();
      for (const p of prev) map.set(p.id, p);
      for (const p of incoming) map.set(p.id, p);
      return Array.from(map.values());
    });

    setHasMore((data.providers?.length || 0) === limit);
    setIsLoadingMore(false);
  }, [data, offset, limit]);


  const observerRef = React.useRef<IntersectionObserver>(null);
  const sentinelRef = React.useCallback(
    (node: HTMLDivElement) => {
      if (isFetching || isLoadingMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching && !isLoadingMore) {
          setIsLoadingMore(true);
          setOffset((prev) => prev + limit);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetching, isLoadingMore, hasMore, limit]
  );

  if (error) return null;

  const totalCount = typeof data?.total === "number" ? data.total : providers.length;
  const title = categorySlug ? `${categorySlug} ${t`Providers`}` : t`All Providers`;

  return (
    <>
      <div className="min-h-screen">
        <section>
          <div className="max-w-7xl mx-auto px-4">
            <div
              className={cn("sticky top-16 bg-background z-10 py-2", {
                "top-27 lg:top-16": optionalSideBarOpen,
              })}>
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full text-card border border-card cursor-pointer hover:border-card hover:bg-popover hover:text-white transition">
                    <ArrowUpIcon className="w-4 h-4 -rotate-90" />
                  </button>

                  <div>
                    <h1 className="font-bold text-base text-primary-foreground uppercase">{title}</h1>
                    {totalCount > 0 && <p className="text-gray-500 text-sm">{totalCount} providers</p>}
                  </div>
                </div>

                <button
                  onClick={() => setIsSortingEnabled((prev) => !prev)}
                  className={cn(
                    "px-3 py-1 rounded-full border text-sm font-semibold transition",
                    isSortingEnabled
                      ? "border-card text-card bg-popover"
                      : "border border-gray-600 text-gray-300 hover:border-card hover:text-white"
                  )}
                  disabled={isLoading || isFetching}>
                  A-Z
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {providers.filter((provider, index, self) =>
                  index === self.findIndex(p => p.id === provider.id)
              ).map((provider) => (
                  <div
                      key={provider.id}
                      className="cursor-pointer h-[72px] flex items-center justify-center rounded-lg bg-card/10 hover:bg-card/20 transition p-4"
                      onClick={() => {
                        console.log(provider);
                        navigate(`/${categorySlug}/provider/${provider.general_code}`);
                      }}>
                    {provider.logo && (
                        <img
                            className="max-h-14 max-w-[80%]"
                            src={`${config.baseUrl}/storage/${provider.logo}`}
                            loading="lazy"
                            alt={provider.name}/>
                    )}
                  </div>
              ))}

              {isLoading && providers.length === 0 &&
                Array.from({ length: limit }).map((_, i) => (
                  <div
                    key={`sk-${i}`}
                    className="cursor-pointer h-[72px] flex items-center justify-center rounded-lg bg-card/10 animate-pulse p-4">
                    <div className="w-3/4 h-14 rounded" />
                  </div>
                ))
              }
            </div>

            {hasMore && <div ref={sentinelRef} style={{ height: "20px" }} />}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AllProvidersList;
