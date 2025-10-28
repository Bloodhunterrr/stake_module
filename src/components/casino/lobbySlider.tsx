import { Badge } from "../ui/badge";
import { useNavigate } from "react-router";
import { Trans } from "@lingui/react/macro";
import type { Game } from "@/types/game_list";
import Search from "../shared/v2/casino/search";
import type { Subcategory } from "@/types/main";
import GameSlot from "@/components/shared/v2/slot";
import { Dialog, DialogContent } from "../ui/dialog";
import { SearchIcon, Settings2 } from "lucide-react";
import type { Provider } from "@/types/provider_list";
import { useGetGameListQuery } from "@/services/mainApi";
import React, { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CarouselBtns from "@/components/ui/carouselBtns.tsx";

type LobbySliderProps = {
  categorySlug: string;
  subcategory: Subcategory;
  providers: Provider[];
};

const MOBILE_GAME_LIMIT = 5;

const DesktopSlider = ({
                                categorySlug,
                                subcategory,
                                providers,
                              }: LobbySliderProps) => {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);

  const limit = 8;
  const [searchModal, setSearchModal] = useState(false);


  const { data, isLoading, isFetching } = useGetGameListQuery({
    subcategory_ids: subcategory?.id ? [subcategory.id] : [],
    device: "desktop",
    offset,
    limit,
  });

  const games = isLoading ? Array(limit).fill(null) : data?.games ?? [];
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
    const columns = width >= 1210 ? 8 : width >= 1060 ? 7 : width >= 910 ? 6 : width >= 718 ? 5 : 4;

  const handlePrev = () => {
    setOffset((prev) => Math.max(prev - limit, 0));
  };

  const handleNext = () => {
    setOffset((prev) => prev + limit);
  };

  const isPrevDisabled = offset === 0 || isFetching;
  const isNextDisabled =
      isFetching || (data?.total !== undefined && offset + limit >= data.total);

  // const shouldNext = (data?.offset ?? 0) + columns > (data?.total ?? columns);

  const subcategoryTranslations: Record<string, string | React.ReactNode> = {
    "Megaways": <Trans>Megaways</Trans>,
    "Video Slots": <Trans>Video Slots</Trans>,
    "Instant Games": <Trans>Instant Games</Trans>,
    "Egyptian Theme": <Trans>Egyptian Theme</Trans>,
    "New Trend": <Trans>New Trend</Trans>,
    "y2worldsoft": <Trans>y2worldsoft</Trans>,
    "testpopok": <Trans>testpopok</Trans>,
    "Nexu": <Trans>Nexu</Trans>,
    "Rome": <Trans>Rome</Trans>,
    "Lobby": <Trans>Lobby</Trans>,
    "Roulette": <Trans>Roulette</Trans>,
    "Virtual Games": <Trans>Virtual Games</Trans>,
    "Keno & Lottery": <Trans>Keno & Lottery</Trans>,
  };

  return (
      <section className="w-full mb-8">
        <div className="flex w-full items-center justify-between gap-4">
          <h2 className="font-bold mr-auto text-xl leading-7 px-3">
            {subcategoryTranslations[subcategory.name] ?? subcategory.name}
          </h2>
          <div className="flex flex-row gap-2">
            {" "}
            <button onClick={() =>
                    navigate(`/${categorySlug}/games/${subcategory.slug}`)
                } disabled={isLoading}
                className="flex items-center gap-1 text-sm border px-1.5 py-1 rounded-lg text-[13px] text-primary-foreground cursor-pointer disabled:opacity-50">
              <Trans>View all</Trans>
            </button>
            <Sheet>
              <SheetTrigger className="border px-1.5 py-1 rounded-lg flex gap-1 text-xs items-center justify-center">
                <Settings2 size={20} />
                <Trans>Filter</Trans>
              </SheetTrigger>

              <SheetContent className="border-none w-full border-r sm:max-w-sm h-[calc(100vh_-_128px)] top-[60px]"
                closeClassName="text-primary-foreground focus:ring-0">
                <SheetHeader className="h-26 flex items-center justify-end">
                  <SheetTitle className="text-xl leading-7 font-Wbold text-primary-foreground">
                    <Trans>Filters</Trans>
                  </SheetTitle>
                </SheetHeader>

                <div onClick={() => setSearchModal(true)}
                    className="flex h-10 min-h-10 container mx-auto rounded-full w-[calc(100%-1rem)] items-center mt-4 cursor-pointer px-3 gap-2 bg-popover lg:hover:bg-popover/80 transition">
                  <SearchIcon className="size-5 text-[var(--grey-300)]" />
                  <span className="font-semibold text-primary-foreground text-sm">
                  <Trans>Search</Trans>
                </span>
                </div>

                <div className="pl-4">
                  <Accordion type="single" defaultValue="providers" collapsible>
                    <AccordionItem value="providers" className="no-underline">
                      <AccordionTrigger className="flex text-primary-foreground items-center justify-start text-lg lg:hover:no-underline">
                        <Trans>Providers</Trans>
                      </AccordionTrigger>
                      <AccordionContent className="flex-1 space-x-2 space-y-2 overflow-y-scroll h-[calc(100vh-260px)] gap-2">
                        {providers.filter(
                            (provider: Provider, index: number, self: Provider[]) =>
                                index === self.findIndex((p) => p.id === provider.id)
                        ).map((p: Provider) => (
                            <Badge
                                key={p.id}
                                onClick={() =>
                                    navigate(
                                        `/${categorySlug}/provider/${p.general_code}`
                                    )
                                }
                                variant="secondary"
                                className="text-xs cursor-pointer bg-popover border-[1px] border-card/30 text-primary-foreground p-1 uppercase">
                              {p.name}
                            </Badge>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <Dialog open={searchModal}
                    onOpenChange={() => setSearchModal(false)}>
                  <DialogContent showCloseButton={false}
                      className="border-none rounded-none pt-0 px-3.5 overflow-y-auto shrink-0 p-0 top-[calc(50%_+_30px)] left-[calc(50%_+_30px)] z-100 grid w-[calc(100%-60px)] max-w-[calc(100%-60px)] min-w-[calc(100%-60px)] max-md:w-full max-md:max-w-full max-md:min-w-full !h-[calc(100%-60px)] translate-x-[-50%] translate-y-[-50%]">
                    <Search setSearchModal={setSearchModal}
                        onCloseSearchModal={() => setSearchModal(false)}/>
                  </DialogContent>
                </Dialog>
              </SheetContent>
            </Sheet>
          </div>

          {/*<div className="hidden md:flex gap-2">*/}
          {/*  <button onClick={handlePrev} disabled={isPrevDisabled}>*/}
          {/*    <ArrowUpIcon className="rotate-270" />*/}
          {/*  </button>*/}
          {/*  <button onClick={handleNext} disabled={isNextDisabled}>*/}
          {/*    <ArrowUpIcon className="rotate-90" />*/}
          {/*  </button>*/}
          {/*</div>*/}
            <CarouselBtns className={"flex relative size-8 rounded-full box-content bg-transparent lg:hover:bg-popover/50 border border-[color:var(--grey-400)] items-center cursor-pointer text-white lg:hover:text-white border-solid h-[40px] w-[56px] m-0"}
                          prevClassName={"rounded-tr-none rounded-br-none top-0 left-0"}
                          nextClassName={"rounded-tl-none rounded-bl-none top-0 right-0"}
                          prevOnClick={handlePrev}
                          prevDisabled={isPrevDisabled}
                          nextOnClick={handleNext}
                          nextDisabled={isNextDisabled} />
        </div>

        <Carousel
            opts={{ align: "start", loop: false }}
            className="w-full relative group/items">
          <CarouselContent className="py-2 flex flex-row">
            {games.map((game, index) => (
                <CarouselItem
                    style={{ flexBasis: `${100 / columns}%` }}
                    key={game?.id ?? `skeleton-${index}`}
                    className={`lg:hover:translate-y-[-4%] transition-all duration-300 py-3`}>
                  <GameSlot game={game} isLoading={isLoading || isFetching} />
                </CarouselItem>
            ))}
          </CarouselContent>

          {/*<CarouselPrevious onClick={handlePrev} disabled={Number(data?.offset ?? 0) === 0}*/}
          {/*    className="hidden cursor-pointer lg:flex top-1/2 px-6 border-none bg-background/80 lg:hover:bg-background lg:hover:text-primary-foreground opacity-0 group-hover/items:opacity-100 h-full disabled:hidden rounded-none left-0 z-10"/>*/}
          {/*<CarouselNext onClick={handleNext} disabled={shouldNext}*/}
          {/*    className="hidden cursor-pointer lg:flex absolute top-1/2 px-6 h-full border-none bg-background/80 lg:hover:bg-background lg:hover:text-primary-foreground opacity-0 group-hover/items:opacity-100 disabled:hidden rounded-none right-0 z-10"/>*/}
        </Carousel>
      </section>
  );
};

const MobileSlider = ({categorySlug, subcategory, providers}: LobbySliderProps) => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [offset, setOffset] = useState(0);
  const [searchModal, setSearchModal] = useState(false);

  const { data, isFetching } = useGetGameListQuery(
      {
        subcategory_ids: subcategory?.id ? [subcategory.id] : [],
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
          <div className="flex gap-2">
            <button onClick={() =>
                    navigate(`/${categorySlug}/games/${subcategory.slug}`)
                } className=" text-primary-foreground border rounded-full py-1 px-1.5 text-xs">
              {/*Deleted Totals*/}
              {/*{data?.total != null && <span>({data.total})</span>}*/}
              <Trans>View all</Trans>
            </button>
            <Sheet>
              <SheetTrigger className="border px-1.5 py-1 rounded-full flex gap-1 text-xs ">
                <Settings2 size={20} />
              </SheetTrigger>

              <SheetContent className="border-none w-full border-r sm:max-w-sm h-[calc(100vh_-_128px)] top-[60px]"
                closeClassName="text-primary-foreground focus:ring-0">
                <SheetHeader className="h-26 flex items-center justify-end">
                  <SheetTitle className="text-2xl font-semibold text-primary-foreground">
                    <Trans>Filters</Trans>
                  </SheetTitle>
                </SheetHeader>

                <div onClick={() => setSearchModal(true)}
                    className="flex h-10 min-h-10 container mx-auto rounded-full w-[calc(100%-1rem)] items-center mt-4 cursor-pointer px-3 gap-2 bg-popover lg:hover:bg-popover/80 transition">
                  <SearchIcon className="size-5 text-[var(--grey-300)]" />
                  <span className="font-semibold text-primary-foreground text-sm">
                  <Trans>Search</Trans>
                </span>
                </div>

                <div className="pl-4">
                  <Accordion type="single" defaultValue="providers" collapsible>
                    <AccordionItem value="providers" className="no-underline">
                      <AccordionTrigger className="flex text-primary-foreground items-center justify-start text-lg lg:hover:no-underline">
                        <Trans>Providers</Trans>
                      </AccordionTrigger>
                      <AccordionContent className="flex-1 space-x-2 space-y-2 overflow-y-scroll h-[calc(100vh-260px)] gap-2">
                        {providers.filter(
                            (provider: Provider, index: number, self: Provider[]) =>
                                index === self.findIndex((p) => p.id === provider.id)
                        ).map((p: Provider, i: number) => (
                            <Badge
                              key={`${p.id}-${p.general_code}-${i}`} 
                                onClick={() =>
                                    navigate(
                                        `/${categorySlug}/provider/${p.general_code}`
                                    )
                                } variant="secondary"
                                className="text-xs cursor-pointer bg-popover border-[1px] border-card/30 text-primary-foreground p-1 uppercase">
                              {p.name}
                            </Badge>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <Dialog open={searchModal} onOpenChange={() => setSearchModal(false)}>
                  <DialogContent showCloseButton={false}
                      className="border-none rounded-none pt-0 px-3.5 overflow-y-auto shrink-0 p-0 top-[calc(50%_+_30px)] left-[calc(50%_+_30px)] z-100 grid w-[calc(100%-60px)] max-w-[calc(100%-60px)] min-w-[calc(100%-60px)] max-md:w-full max-md:max-w-full max-md:min-w-full !h-[calc(100%-60px)] translate-x-[-50%] translate-y-[-50%]">
                    <Search setSearchModal={setSearchModal}
                        onCloseSearchModal={() => setSearchModal(false)}/>
                  </DialogContent>
                </Dialog>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div ref={carouselRef} onScroll={handleScroll}
            className="flex gap-2 overflow-x-auto no-scrollbar snap-x">
          {games.map((game, i) => (
              <div key={`${game?.id ?? "skeleton"}-${i}`}
                  className="flex-shrink-0 w-[150px] snap-start">
                <GameSlot game={game} isLoading={game === null} />
              </div>
          ))}

          {isFetching &&
              Array.from({ length: MOBILE_GAME_LIMIT }).map((_, i) => (
                  <div key={`sk-${i}`} className="flex-shrink-0 w-[150px]">
                    <GameSlot game={null} isLoading={true} />
                  </div>
              ))}
        </div>
      </section>
  );
};

export default function LobbySlider(props: LobbySliderProps) {
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
