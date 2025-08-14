import type {Subcategory} from '@/types/main';
import ArrowUpIcon from '@/assets/icons/arrow-up.svg?react';
import {useIsDesktop} from '@/hooks/useIsDesktop';
import {useEffect, useRef, useState} from 'react';
import {useGetGameListQuery} from '@/services/mainApi';
import GameSlot from '@/components/shared/slot';
import type {Game, GameListRequest} from '@/types/game_list';
import {useNavigate} from 'react-router';

type LobbySliderProps = {
  categorySlug: string;
  subcategory: Subcategory;
};

// Animation duration is currently 0, but a non-zero value would improve the UX
const ANIMATION_DURATION = 300;

export const DesktopSlider = ({categorySlug, subcategory}: LobbySliderProps) => {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);

  const {
    data,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useGetGameListQuery(
      {
        category_ids: subcategory?.id ? [subcategory.id] : [],
        device: 'desktop',
        offset,
        limit: subcategory.landing_page_game_number,
      },
      {skip: !subcategory.id} // Skip the query if subcategory ID is not available
  );

  const games = isQueryLoading
      ? Array(subcategory.landing_page_game_number).fill(null)
      : data?.games ?? [];

  const handlePrev = () => {
    setOffset(prevOffset =>
        Math.max(prevOffset - subcategory.landing_page_game_number, 0)
    );
  };

  const handleNext = () => {
    setOffset(prevOffset => prevOffset + subcategory.landing_page_game_number);
  };

  const isPrevDisabled = offset === 0 || isQueryFetching;
  const isNextDisabled =
      isQueryFetching ||
      (data?.total !== undefined &&
          offset + subcategory.landing_page_game_number >= data.total);

  return (
      <section>
        <div>
          <div>
            <h2>{subcategory.name}</h2>
          </div>
          <div>
            <button
                onClick={() => navigate(`/${categorySlug}/games/${subcategory.slug}`)}
                disabled={isQueryLoading}
            >
              <span>View all</span>
              {data?.total !== undefined && <span>{data.total}</span>}
            </button>
          </div>
          <div>
            <div>
              <button onClick={handlePrev} disabled={isPrevDisabled}>
                <ArrowUpIcon style={{transform: 'rotate(270deg)'}} />
              </button>
            </div>
            <div>
              <button onClick={handleNext} disabled={isNextDisabled}>
                <ArrowUpIcon style={{transform: 'rotate(90deg)'}} />
              </button>
            </div>
          </div>
        </div>
        <div>
          {/*
           Using a key on the container to force a re-render can be a performance concern.
           A better approach would be to use a transition effect without unmounting the whole list.
           For this example, I've kept the key, but it's something to be mindful of.
        */}
          <div key={`slider-${offset}`}>
            {games.map((game, index) => (
                <GameSlot
                    key={game?.id ?? `skeleton-${index}`}
                    game={game}
                    isLoading={isQueryLoading || isQueryFetching}
                />
            ))}
          </div>
        </div>
      </section>
  );
};

const MOBILE_GAME_LIMIT = 5;

const MobileSlider = ({categorySlug, subcategory}: LobbySliderProps) => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [offset, setOffset] = useState(0);

  const {data, isFetching} = useGetGameListQuery(
      {
        category_ids: subcategory?.id ? [subcategory.id] : [],
        device: 'mobile',
        offset,
        limit: MOBILE_GAME_LIMIT,
      },
      {skip: !subcategory.id}
  );

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!data) return;

    setGames(prev => [...prev, ...data.games]);

    // Reset the offset and games state if the subcategory changes
    // This is a cleaner way to handle the state reset logic
    if (offset === 0) {
      setGames(data.games);
    }
  }, [data, offset]);

  useEffect(() => {
    // Reset state when subcategory changes
    setGames([]);
    setOffset(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [subcategory.id]);

  const hasMore =
      data?.total !== undefined
          ? offset + games.length < data.total
          : games.length === offset + MOBILE_GAME_LIMIT;

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const {scrollWidth, scrollLeft, clientWidth} = event.currentTarget;
    // Check if the user has scrolled to the end of the container
    if (
        !isFetching &&
        hasMore &&
        scrollWidth - scrollLeft - clientWidth < 100 // A small threshold for "near the end"
    ) {
      setOffset(prev => prev + MOBILE_GAME_LIMIT);
    }
  };

  return (
      <section>
        <div>
          <div>
            <h6>{subcategory.name}</h6>
          </div>
          <div>
            <button
                onClick={() => navigate(`/${categorySlug}/games/${subcategory.slug}`)}
            >
              <span>View all</span>
              {data?.total != null && <span>{data.total}</span>}
            </button>
          </div>
        </div>
        <div>
          <div ref={scrollContainerRef} onScroll={handleScroll}>
            {games.map((game, i) => (
                <div key={`${game?.id ?? 'skeleton'}-${i}`}>
                  <GameSlot game={game} isLoading={game === null} />
                </div>
            ))}

            {isFetching &&
                Array.from({length: MOBILE_GAME_LIMIT}).map((_, i) => (
                    <div key={`sk-${i}`}>
                      <GameSlot game={null} isLoading={true} />
                    </div>
                ))}
          </div>
        </div>
      </section>
  );
};

const LobbySlider = (props: LobbySliderProps) => {
  const isDesktop = useIsDesktop();

  if (isDesktop) return <DesktopSlider {...props} />;
  return <MobileSlider {...props} />;
};

export default LobbySlider;