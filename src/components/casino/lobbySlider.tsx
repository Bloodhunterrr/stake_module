import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";
import { useEffect, useRef, useState } from "react";
import { useGetGameListQuery } from "@/services/mainApi";
import GameSlot from "@/components/shared/v2/slot";
import type { Game } from "@/types/game_list";
import type { Subcategory } from "@/types/main";
import { useNavigate } from "react-router";
import { Trans } from "@lingui/react/macro";

type LobbySliderProps = {
  categorySlug: string;
  subcategory: Subcategory;
};

const MOBILE_GAME_LIMIT = 5;

export const DesktopSlider = ({
  categorySlug,
  subcategory,
}: LobbySliderProps) => {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);

  const limit = subcategory.landing_page_game_number;

  const { data, isLoading, isFetching } = useGetGameListQuery({
    category_ids: subcategory?.id ? [subcategory.id] : [],
    device: "desktop",
    offset,
    limit,
  });

  const games = isLoading ? Array(limit).fill(null) : data?.games ?? [];
  const columns = subcategory.landing_page_game_row_number > games.length
      ? games.length
      : subcategory.landing_page_game_row_number;


  const handlePrev = () => {
    setOffset((prev) => Math.max(prev - limit, 0));
  };

  const handleNext = () => {
    setOffset((prev) => prev + limit);
  };

  const isPrevDisabled = offset === 0 || isFetching;
  const isNextDisabled = isFetching || (data?.total !== undefined && offset + limit >= data.total);

  const shouldNext = (data?.offset ?? 0) + columns > (data?.total ?? columns);

  const subcategoryTranslations: Record<string, any> = {
    "Megaways": <Trans>Megaways</Trans>,
    "Video Slots": <Trans>Video Slots</Trans>,
    "Instant Games": <Trans>Instant Games</Trans>,
    "Egyptian Theme": <Trans>Egyptian Theme</Trans>,
    "New Trend": <Trans>New Trend</Trans>,
    "Rome": <Trans>Rome</Trans>,
    "Lobby": <Trans>Lobby</Trans>,
    "Roulette": <Trans>Roulette</Trans>,
  };

  return (
    <section className="w-full mb-8">
      <div className="flex w-full items-center justify-between">
        <h2 className="font-bold mr-auto text-2xl px-3">{subcategoryTranslations[subcategory.name] ??
            subcategory.name}</h2>
        <button
          onClick={() => navigate(`/${categorySlug}/games/${subcategory.slug}`)}
          disabled={isLoading}
          className="flex items-center gap-1 text-sm border px-1.5 py-1 rounded-lg text-[13px] text-primary-foreground cursor-pointer disabled:opacity-50"
        >
          <Trans>View all</Trans>
        </button>
        <div className="hidden md:flex gap-2">
          <button onClick={handlePrev} disabled={isPrevDisabled}>
            <ArrowUpIcon className="rotate-270" />
          </button>
          <button onClick={handleNext} disabled={isNextDisabled}>
            <ArrowUpIcon className="rotate-90" />
          </button>
        </div>
      </div>

      <Carousel
        opts={{ align: "start", loop: false }}
        className="w-full relative group/items">
        <CarouselContent className="py-2 flex flex-wrap">
          {games.map((game, index) => (
            <CarouselItem
              style={{ flexBasis: `${100 / columns}%` }}
              key={game?.id ?? `skeleton-${index}`}
              className={`hover:scale-105 transition-all duration-300 py-2`}>
              <GameSlot game={game} isLoading={isLoading || isFetching} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          onClick={handlePrev}
          disabled={Number(data?.offset ?? 0) === 0}
          className="hidden cursor-pointer lg:flex top-1/2 px-6 border-none bg-background/80 hover:bg-background hover:text-primary-foreground opacity-0 group-hover/items:opacity-100 h-full disabled:hidden rounded-none left-0 z-10"/>
        <CarouselNext
          onClick={handleNext}
          disabled={shouldNext}
          className="hidden cursor-pointer lg:flex absolute top-1/2 px-6 h-full border-none bg-background/80 hover:bg-background hover:text-primary-foreground opacity-0 group-hover/items:opacity-100 disabled:hidden rounded-none right-0 z-10"/>
      </Carousel>
    </section>
  );
};

const MobileSlider = ({ categorySlug, subcategory }: LobbySliderProps) => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [offset, setOffset] = useState(0);

  const { data, isFetching } = useGetGameListQuery(
    {
      category_ids: subcategory?.id ? [subcategory.id] : [],
      device: "mobile",
      offset,
      limit: MOBILE_GAME_LIMIT,
    },
    { skip: !subcategory.id }
  );

  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!data) return;
    if (offset === 0) {
      setGames(data.games);
    } else {
      setGames((prev) => [...prev, ...data.games]);
    }
  }, [data, offset]);

  useEffect(() => {
    // setGames([]);
    setOffset(0);
  }, [subcategory.id]);

  const hasMore =
    data?.total !== undefined
      ? offset + games.length < data.total
      : games.length === offset + MOBILE_GAME_LIMIT;

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollWidth, scrollLeft, clientWidth } = event.currentTarget;
    if (
      !isFetching &&
      hasMore &&
      scrollWidth - scrollLeft - clientWidth < 100
    ) {
      setOffset((prev) => prev + MOBILE_GAME_LIMIT);
    }
  };

  return (
    <section className="w-full pt-4 lg:pt-0">
      <div className="flex items-center w-full justify-between mb-3">
        <h6 className="font-semibold">{subcategory.name}</h6>
        <button
          onClick={() => navigate(`/${categorySlug}/games/${subcategory.slug}`)}
          className=" text-primary-foreground border rounded-full py-1 px-1.5 text-xs">
          {/*Deleted Totals*/}
          {/*{data?.total != null && <span>({data.total})</span>}*/}
          <Trans>View all</Trans>
        </button>
      </div>

      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex gap-2 overflow-x-auto no-scrollbar snap-x">
        {games.map((game, i) => (
          <div
            key={`${game?.id ?? "skeleton"}-${i}`}
            className="flex-shrink-0 w-[150px] snap-start">
            <GameSlot game={game} isLoading={game === null} />
          </div>
        ))}

        {isFetching && Array.from({ length: MOBILE_GAME_LIMIT }).map((_, i) => (
            <div key={`sk-${i}`} className="flex-shrink-0 w-[150px]">
              <GameSlot game={null} isLoading={true} />
            </div>
          ))}
      </div>
    </section>
  );
};

const LobbySlider = (props: LobbySliderProps) => {
  return (
    <section>
      <div className="hidden lg:flex">
        <DesktopSlider {...props} />
      </div>
      <div className="lg:hidden flex">
        <MobileSlider {...props} />
      </div>
    </section>
  );
};

export default LobbySlider;
