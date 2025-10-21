// import React from "react";
import { Button } from "../ui/button";
// import { Trans } from "@lingui/react/macro";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const slides = [
  {
    id: 1,
    image: "https://cdn.sanity.io/images/tdrhge4k/stake-com-production/2222d4c4c16e08da857ccb1cfc3bbabf0dcec67b-1080x1080.png?w=220&h=220&fit=min&auto=format",
    title: "New releases",
    description: "Le Cowboy",
    subDescription: "New Early Access Game!",
    buttonTitle: "Play Now!",
  }, {
    id: 2,
    image: "https://cdn.sanity.io/images/tdrhge4k/stake-com-production/333362afbeea101f489182fb73b2305ca96900e1-1080x1080.png?w=220&h=220&fit=min&auto=format",
    title: "Exclusive Promotion",
    description: "It's Money Time",
    subDescription: "Share in $50,000!",
    buttonTitle: "Play Now",
  }, {
    id: 3,
    image: "https://cdn.sanity.io/images/tdrhge4k/stake-com-production/f46ff3edab0c5fcedc51e1120903cecd4ad1a2e5-1080x1080.png?w=220&h=220&fit=min&auto=format",
    title: "Promotion",
    description: "All in or Fold Jackpot",
    subDescription: "$500,000 In Prizes!",
    buttonTitle: "Learn More",
  }, {
    id: 4,
    image: "https://cdn.sanity.io/images/tdrhge4k/stake-com-production/e6fb8d7a35f22fcd9967254327cdaae122d2f71b-1080x1080.png?w=330&h=330&fit=min&auto=format",
    title: "Promotion",
    description: "Weekly Raffle",
    subDescription: "Share in $75,000 each week",
    buttonTitle: "Learn More",
  }, {
    id: 5,
    image: "https://cdn.sanity.io/images/tdrhge4k/stake-com-production/bd2dfd7d29c534593d9c4da040eb00a2ea71da47-1080x1080.png?w=330&h=330&fit=min&auto=format",
    title: "Promotion",
    description: "Daily Races",
    subDescription: "Play in our $100,000 Daily Race",
    buttonTitle: "Race Now",
  }, {
    id: 6,
    image: "https://cdn.sanity.io/images/tdrhge4k/stake-com-production/7e49b8a90b2e8341baf0a848777d83b814061c2e-1080x1080.png?w=330&h=330&fit=min&auto=format",
    title: "Promotion",
    description: "Conquer the Casino",
    subDescription: "Win a share in $50,000 every week",
    buttonTitle: "Play Now",
  }, {
    id: 7,
    image: "https://cdn.sanity.io/images/tdrhge4k/stake-com-production/0f8a99815a126f32ef05dc1ddcb56b4fd9dedc50-1080x1080.png?w=330&h=330&fit=min&auto=format",
    title: "Promotion",
    description: "Stake vs Eddie",
    subDescription: "Win a share in $50,000 every week",
    buttonTitle: "Play Now",
  }, {
    id: 8,
    image: "https://cdn.sanity.io/images/tdrhge4k/stake-com-production/b69d739b139cf35dcbbe5549963499568ce3e031-1080x1080.png?w=330&h=330&fit=min&auto=format",
    title: "Promotion",
    description: "Reel Rumble",
    subDescription: "Win a share in $40,000 every week",
    buttonTitle: "Play Now!",
  }, {
    id: 9,
    image: "https://cdn.sanity.io/images/tdrhge4k/stake-com-production/57d1eb33690b1e1f9b90358ae754b27fe243f459-1080x1080.png?w=330&h=330&fit=min&auto=format",
    title: "Promotion",
    description: "The Level Up",
    subDescription: "Win a share in $40,000 every week",
    buttonTitle: "Play Now!",
  }, {
    id: 10,
    image: "https://cdn.sanity.io/images/tdrhge4k/stake-com-production/06f1d29f304d176cf9424bee83acbd8b36fd1cca-1080x1080.png?w=330&h=330&fit=min&auto=format",
    title: "Promotion",
    description: "Originals Ascent",
    subDescription: "Win a share in $40,000 every week",
    buttonTitle: "Play Now",
  },
] as const;

// type ButtonTitle = typeof slides[number]['buttonTitle'];
// type SlideTitle = typeof slides[number]['title'];
// type SlideDescription = typeof slides[number]['description'];

// const buttonTranslations: Record<ButtonTitle, React.ReactNode> = {
//   "Deposit Now": <Trans>Deposit Now</Trans>,
//   "Begin Now": <Trans>Begin Now</Trans>,
//   "Read More": <Trans>Read More</Trans>,
// };
//
// const titleTranslations: Record<SlideTitle, React.ReactNode> = {
//     "SECOND DEPOSIT BONUS": <Trans>SECOND DEPOSIT BONUS</Trans>,
//     "ROOKIE RUMBLE TOURNAMENT": <Trans>ROOKIE RUMBLE TOURNAMENT</Trans>,
//     "WEEKLY CASHBACK": <Trans>WEEKLY CASHBACK</Trans>,
// };
//
// const descriptionTranslations: Record<SlideDescription, React.ReactNode> = {
//   "55% up to": <Trans>55% up to</Trans>,
//   "€2,500 Daily": <Trans>€2,500 Daily</Trans>,
//   "up to 25%": <Trans>up to 25%</Trans>,
// };
//
// const subDescriptionTranslations: Record<string, React.ReactNode> = {
//   "€500 + 100 Free Spins": <Trans>€500 + 100 Free Spins</Trans>,
//   "": "",
// };

export default function LobbyBannerSlider() {
  return (
      <section className="relative w-full mx-auto group">
        <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full relative" >
          <CarouselContent>
            {slides.map((slide) => (
                <CarouselItem key={slide.id}
                    className="md:basis-1/3 sm:basis-1/2 basis-full py-2 px-[5px] lg:hover:brightness-92 transition-all duration-300">
                  <div className="grid items-center aspect-[364.18/220] grid-cols-[45%_55%] max-h-[220px] min-h-[220px] w-full transition-all duration-200 rounded-[20px] bg-cover bg-center bg-no-repeat relative overflow-hidden bg-[var(--grey-500)]"
                       // style={{ backgroundImage: `url(${slide.image})` }}
                  >
                    <div className="flex flex-col items-start justify-start h-full relative z-[1] rounded-[4px] p-4">
                      <Button variant="outline" className={'w-max max-w-full h-[16px] justify-start text-xs leading-4 overflow-hidden truncate px-1 py-0 mb-2 text-[var(--grey-900)] rounded-[4px] bg-white border-none'}>
                        {
                            // titleTranslations[
                                slide.title
                                // ]
                        }
                      </Button>
                      <div className="flex flex-col gap-y-0.5">
                        <h4 className="font-medium text-white text-xl">
                          {
                              // descriptionTranslations[
                                  slide.description
                                  // ]
                          }
                        </h4>
                        <p className="text-white font-[500] text-sm leading-6.5">
                          {
                              // subDescriptionTranslations[slide.subDescription] ||
                              slide.subDescription
                          }
                        </p>
                      </div>
                      <Button variant="outline" className={'absolute bottom-3 left-3 md:bottom-4 md:left-4 px-4 py-2 min-w-[7.5rem] max-w-[10.625rem] h-max bg-transparent rounded-lg text-md text-white border-white hover:text-white hover:bg-popover/80'}>
                        {
                            // buttonTranslations[
                                slide.buttonTitle
                                // ]
                        }
                      </Button>
                    </div>
                      <div className="relative flex items-center justify-end h-full w-full">
                          <img src={slide.image}
                               className="max-w-[220px] max-h-[220px] aspect-square w-full my-auto" />
                      </div>
                  </div>
                </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden lg:flex top-1/2 px-6 border-none bg-transparent hover:bg-transparent hover:text-primary-foreground opacity-0 group-hover:opacity-100 h-full disabled:hidden rounded-none -left-9 z-10" />
          <CarouselNext className="hidden lg:flex absolute top-1/2 px-6 h-full border-none bg-transparent hover:bg-transparent hover:text-primary-foreground opacity-0 group-hover:opacity-100 disabled:hidden rounded-none -right-9 z-10" />
        </Carousel>
      </section>
  );
}