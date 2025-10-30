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
import { SearchIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Search from "@/components/shared/v2/casino/search";

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
  const [searchModal, setSearchModal] = React.useState(false);

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

  const { data, isFetching, isLoading, error } = useGetProviderListQuery(
    request,
    {
      skip: offset > 0 && !hasMore,
    }
  );

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
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isFetching &&
          !isLoadingMore
        ) {
          setIsLoadingMore(true);
          setOffset((prev) => prev + limit);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetching, isLoadingMore, hasMore, limit]
  );

  if (error) return null;

  const totalCount =
    typeof data?.total === "number" ? data.total : providers.length;
  const title = categorySlug
    ? `${categorySlug} ${t`Providers`}`
    : t`All Providers`;

  return (
    <>
      <div className="min-h-screen">
        <section>
          <div className="w-[94dvw] md:w-[calc(94dvw_-_60px)] min-[1440px]:max-w-300 ml-auto mr-[3dvw] min-[1440px]:mr-auto mx-auto px-2 lg:px-0">
            <div
                className={cn("sticky top-15 bg-[var(--grey-600)] z-10 py-2 ", {
                    "top-22 lg:top-15": optionalSideBarOpen,
                })}>
              <div className="py-3 flex items-center justify-between">

                <div className="flex items-center gap-x-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full text-white border border-white cursor-pointer lg:lg:group-hover:border-white lg:hover:bg-[var(--grey-500)] lg:hover:text-white transition">
                    <ArrowUpIcon className="w-4 h-4 -rotate-90" />
                  </button>

                  <div>
                    <h1 className="font-bold text-base text-primary-foreground capitalize">
                      {title}
                    </h1>
                    {totalCount > 0 && (
                      <p className="text-[var(--grey-200)] text-md leading-6">
                        {totalCount} providers
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <button onClick={() => setSearchModal(true)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1 w-[60px] rounded-[24px] border text-sm font-semibold transition
                   border-gray-600 text-gray-300 lg:hover:border-card lg:hover:text-white lg:hover:bg-popover/50">
                    <SearchIcon className="size-5" />
                  </button>

                  <button onClick={() => setIsSortingEnabled((prev) => !prev)}
                    className={cn(
                      "px-3 py-1 rounded-[24px] border w-[60px] text-sm font-semibold transition",
                      isSortingEnabled
                        ? "border-card text-card bg-popover/50"
                        : "border border-gray-600 text-gray-300 lg:hover:border-card lg:hover:text-white"
                    )}
                    disabled={isLoading || isFetching}>
                    A-Z
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {providers
                .filter(
                  (provider, index, self) =>
                    index === self.findIndex((p) => p.id === provider.id)
                )
                .map((provider) => (
                  <div
                    key={provider.id}
                    className="cursor-pointer h-[50px] md:h-[55px]  flex items-center justify-center rounded-lg bg-popover/50 lg:hover:bg-popover/80 transition p-4"
                    onClick={() => {
                      console.log(provider);
                      navigate(
                        `/${categorySlug}/provider/${provider.general_code}`
                      );
                    }}
                  >
                    {provider.logo && (
                      <img
                        className="max-h-9 max-w-[80%]"
                        src={`${config.baseUrl}/storage/${provider.logo}`}
                        loading="lazy"
                        alt={provider.name}
                      />
                    )}
                  </div>
                ))}

              {isLoading &&
                providers.length === 0 &&
                Array.from({ length: limit }).map((_, i) => (
                  <div
                    key={`sk-${i}`}
                    className="cursor-pointer h-[50px] md:h-[55px]  flex items-center justify-center rounded-lg bg-popover/50 animate-pulse p-4"
                  >
                    <div className="w-3/4 h-14 rounded" />
                  </div>
                ))}
            </div>

            {hasMore && <div ref={sentinelRef} style={{ height: "20px" }} />}
          </div>
        </section>
      </div>
      <Dialog open={searchModal} onOpenChange={() => setSearchModal(false)}>
        <DialogContent
          showCloseButton={false}
          className="border-none rounded-none overflow-y-auto shrink-0 p-0 top-[calc(50%_+_30px)] left-[calc(50%_+_30px)] z-100 grid w-[calc(100%-60px)] max-w-[calc(100%-60px)] min-w-[calc(100%-60px)] max-md:left-1/2 max-md:w-full max-md:max-w-full max-md:min-w-full !h-[calc(100%-60px)] translate-x-[-50%] translate-y-[-50%]"
        >
          <Search
            setSearchModal={setSearchModal}
            onCloseSearchModal={() => setSearchModal(false)}
          />
        </DialogContent>
      </Dialog>
      <Footer />
    </>
  );
};

export default AllProvidersList;
