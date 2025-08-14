import { useAppSelector } from '@/hooks/rtk';
import './style.css';
import { useCallback, useEffect, useState } from 'react';
import { ALLOWED_LANGUAGES } from '@/types/lang';
import { useLazyGetSportIframeQuery } from '@/services/authApi';
import config from "@/config.ts";

const Sport = () => {
  const currentLang = ALLOWED_LANGUAGES.en;

  const user = useAppSelector((state) => state.auth?.user);
  const userId = user?.id;
  const [loggedSportUrl, setLoggedSportUrl] = useState<string | null>(null);
  const [triggerGetSportIframe, { isError }] = useLazyGetSportIframeQuery();

  const fetchUserSportUrl = useCallback(
    async (signal: AbortSignal) => {
      try {
        console.log('Fetching Sport URL for user:', userId);
        const data = await triggerGetSportIframe({ currency: 'USD' }, true).unwrap();
        console.log('API Response:', data);

        if (!signal.aborted && data?.play_url) {
          console.log('Setting loggedSportUrl:', data.play_url);
          setLoggedSportUrl(data.play_url);
        } else {
          console.warn('No play_url in response or request was aborted');
        }
      } catch (e) {
        if (!signal.aborted) {
          console.error('Failed to fetch sport iframe URL', e);
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
      console.log('User not logged in, resetting Sport URL');
      setLoggedSportUrl(null);
    }

    return () => {
      console.log('Cleaning up Sport URL request');
      controller.abort();
    };
  }, [userId, fetchUserSportUrl]);

  const defaultSportUrl = `https://spsh.gsportsbook.com/en/sport?serverUrl=https%3A%2F%2Fapispsh.gsportsbook.com&lang= ${currentLang.code}`;

  if (loggedSportUrl && !isError) {
    return <iframe title={`${config.skinName} Sportbook`} id="sportbook" src={loggedSportUrl} />;
  }

  return <iframe title={`${config.skinName} Sportbook`} id="sportbook" src={defaultSportUrl} />;
};

export default Sport;