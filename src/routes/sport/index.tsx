import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/hooks/rtk";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { useGetSportIframeQuery } from "@/services/authApi";
import { useGetMainQuery } from "@/services/mainApi";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useParams } from "react-router";
import { Trans, useLingui } from "@lingui/react/macro";
import type { Wallet } from "@/types/auth";
import config from "@/config.ts";

const Sport: React.FC = () => {
  const { i18n } = useLingui();
  const { categorySlug } = useParams();
  const { optionalSideBarOpen } = useTheme();
  const user = useAppSelector((s) => s.auth?.user);
  const defaultWallet: Wallet | null =
    user?.wallets?.find((w: Wallet) => w.default) || null;

  const isDesktop = useIsDesktop(1024);

  const { data: mainData, isLoading: isMainLoading } = useGetMainQuery();

  const activeCategory = useMemo(() => {
    if (!mainData?.length) return null;
    return mainData.find((el) => el.slug === categorySlug) ?? mainData[0];
  }, [mainData, categorySlug]);

  const isSportsbook = activeCategory?.is_sportbook ?? false;

  const {
    data: iframeResp,
    isFetching: isIframeLoading,
    isError: isIframeError,
    refetch,
  } = useGetSportIframeQuery(
    {
      currency: (defaultWallet?.slug || "EUR").toUpperCase(),
      lang: i18n.locale,
      device: isDesktop ? "desktop" : "mobile",
      route_id: activeCategory?.id || 0,
    },
    {
      refetchOnFocus: false,
      refetchOnReconnect: false,
      skip: activeCategory === null ,
    }
  );

  useEffect(() => {
    refetch();
  }, [user?.id, refetch]);

  const playUrl =
    iframeResp?.play_url ?? (iframeResp as any)?.data?.play_url ?? null;


  // TODO

    if (activeCategory?.id === 2) {
    return (
      <iframe
        id="sportbook"
        src={config.sportUrl + i18n.locale}
        title={`${config.skinName} Sportbook`}
        className={cn(
          "w-full h-[calc(100vh-64px)] transition-all duration-300",
          {
            "h-[calc(100vh-110px)] lg:h-[calc(100vh-64px)]":
              optionalSideBarOpen,
          }
        )}
      />
    );
  }

  if (isMainLoading || (isSportsbook && isIframeLoading && !playUrl)) {
    return (
      <div className="grid place-items-center h-[60vh]">
        <span>
          <Trans>Loading sportsbook…</Trans>
        </span>
      </div>
    );
  }

  if (!activeCategory || !isSportsbook) {
    return (
      <div className="grid place-items-center h-[60vh]">
        <span>
          <Trans>No sportsbook category selected.</Trans>
        </span>
      </div>
    );
  }

  if (!playUrl) {
    return (
      <div className="grid place-items-center h-[60vh]">
        <span>
          {isIframeError ? (
            <Trans>Unable to load sportsbook.</Trans>
          ) : (
            <Trans>No sportsbook URL available.</Trans>
          )}
        </span>
      </div>
    );
  }


  return (
    <iframe
      id="sportbook"
      title="Sportbook"
      src={playUrl}
      className={cn("w-full h-[calc(100svh-44px)] lg:h-[calc(100svh-64px)] transition-all duration-300", {
        "h-[calc(100svh-88px)] lg:[calc(100svh-64px)]": optionalSideBarOpen,
        // "h-[calc(100svh-36px)] transition-all duration-300 -mt-2": isNoCategoryOrSportsbook && !isDesktop
      })}
      allow="clipboard-read; clipboard-write; autoplay; fullscreen"
    />
  );
};

export default Sport;
