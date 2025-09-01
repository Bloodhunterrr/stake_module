import { useAppSelector } from "@/hooks/rtk";
import { useCallback, useEffect, useState } from "react";
import { ALLOWED_LANGUAGES } from "@/types/lang";
import { useLazyGetSportIframeQuery } from "@/services/authApi";
import config from "@/config.ts";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import clsx from "clsx";

const Sport = () => {
  const currentLang = ALLOWED_LANGUAGES.en;

  const user = useAppSelector((state) => state.auth?.user);
  const userId = user?.id;
  const isDesktop = useIsDesktop(900);

  const [loggedSportUrl, setLoggedSportUrl] = useState<string | null>(null);
  const [triggerGetSportIframe, { isError }] = useLazyGetSportIframeQuery();

  const fetchUserSportUrl = useCallback(
    async (signal: AbortSignal) => {
      try {
        console.log("Fetching Sport URL for user:", userId);
        const data = await triggerGetSportIframe(
          { currency: "USD" },
          true
        ).unwrap();
        console.log("API Response:", data);

        if (!signal.aborted && data?.play_url) {
          console.log("Setting loggedSportUrl:", data.play_url);
          setLoggedSportUrl(data.play_url);
        } else {
          console.warn("No play_url in response or request was aborted");
        }
      } catch (e) {
        if (!signal.aborted) {
          console.error("Failed to fetch sport iframe URL", e);
        }
      }
    },
    [triggerGetSportIframe, userId]
  );

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    if (userId) {
      fetchUserSportUrl(signal);
    } else {
      console.log("User not logged in, resetting Sport URL");
      setLoggedSportUrl(null);
    }

    return () => {
      console.log("Cleaning up Sport URL request");
      controller.abort();
    };
  }, [userId, fetchUserSportUrl]);

  if (loggedSportUrl && !isError) {
    return (
      <iframe
        id="sportbook"
        src={loggedSportUrl}
        title={`${config.skinName} Sportbook`}
        className={clsx(
          "w-full",
          isDesktop ? "h-[100vh]" : "h-[calc(100vh-190px)]"
        )}
      />
    );
  }

  return (
    <iframe
      id="sportbook"
      src={config.sportUrl + currentLang.code}
      title={`${config.skinName} Sportbook`}
      className={clsx(
        "w-full",
        isDesktop ? "h-[100vh]" : "h-[calc(100vh-190px)]"
      )}
    />
  );
};

export default Sport;
