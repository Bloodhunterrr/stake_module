import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import React from "react";
import { Button } from "../ui/button";
import { Trans } from "@lingui/react/macro";
import banner1 from "@/assets/images/lobby-banner-1.webp";
import banner2 from "@/assets/images/lobby-banner-2.webp";
import banner3 from "@/assets/images/lobby-banner-3.webp";

const slides = [
  {
    id: 1,
    image: banner1,
    title: "SECOND DEPOSIT BONUS",
    description: "55% up to",
    subDescription: "€500 + 100 Free Spins",
    buttonTitle: "Deposit Now",
  },
  {
    id: 2,
    image: banner2,
    title: "ROOKIE RUMBLE TOURNAMENT",
    description: "€2,500 Daily",
    subDescription: "",
    buttonTitle: "Begin Now",
  },
  {
    id: 3,
    image: banner3,
    title: "WEEKLY CASHBACK",
    description: "up to 25%",
    subDescription: "",
    buttonTitle: "Read More",
  },
  {
    id: 4,
    image: banner1,
    title: "SECOND DEPOSIT BONUS",
    description: "55% up to",
    subDescription: "€500 + 100 Free Spins",
    buttonTitle: "Deposit Now",
  },
  {
    id: 5,
    image: banner2,
    title: "ROOKIE RUMBLE TOURNAMENT",
    description: "€2,500 Daily",
    subDescription: "",
    buttonTitle: "Begin Now",
  },
] as const;

type ButtonTitle = typeof slides[number]['buttonTitle'];
type SlideTitle = typeof slides[number]['title'];
type SlideDescription = typeof slides[number]['description'];

const buttonTranslations: Record<ButtonTitle, React.ReactNode> = {
  "Deposit Now": <Trans>Deposit Now</Trans>,
  "Begin Now": <Trans>Begin Now</Trans>,
  "Read More": <Trans>Read More</Trans>,
};

const titleTranslations: Record<SlideTitle, React.ReactNode> = {
  "SECOND DEPOSIT BONUS": <Trans>SECOND DEPOSIT BONUS</Trans>,
  "ROOKIE RUMBLE TOURNAMENT": <Trans>ROOKIE RUMBLE TOURNAMENT</Trans>,
  "WEEKLY CASHBACK": <Trans>WEEKLY CASHBACK</Trans>,
};

const descriptionTranslations: Record<SlideDescription, React.ReactNode> = {
  "55% up to": <Trans>55% up to</Trans>,
  "€2,500 Daily": <Trans>€2,500 Daily</Trans>,
  "up to 25%": <Trans>up to 25%</Trans>,
};

const subDescriptionTranslations: Record<string, React.ReactNode> = {
  "€500 + 100 Free Spins": <Trans>€500 + 100 Free Spins</Trans>,
  "": "",
};

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
                <CarouselItem
                    key={slide.id}
                    className="md:basis-1/3 sm:basis-1/2 basis-full p-[5px] hover:scale-[1.03] transition-all duration-300 "
                >
                  <div className="
                  flex items-center h-[190px] w-full
                   transition-all duration-200 
                  rounded-[20px] bg-cover
                  bg-center bg-no-repeat
                  relative overflow-hidden p-4"
                       style={{ backgroundImage: `url(${slide.image})` }}>
                    <div className="flex flex-col items-start justify-between h-full relative z-[1] rounded-[16px]">
                      <Button variant="outline" size="sm" className={'text-card bg-background/50 hover:text-card hover:bg-background/ border-none'}>
                        {titleTranslations[slide.title]}
                      </Button>
                      <div>
                        <h4 className="font-bold text-yellow-300 text-2xl">
                          {descriptionTranslations[slide.description]}
                        </h4>
                        <p className="text-yellow-300">
                          {subDescriptionTranslations[slide.subDescription] || slide.subDescription}
                        </p>
                      </div>
                      <Button variant="outline" className={'bg-popover text-card border-card/10 hover:text-card hover:bg-popover/80'}>
                        {buttonTranslations[slide.buttonTitle]}
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden lg:flex top-1/2 px-6 border-none bg-background/80 hover:bg-background hover:text-primary-foreground opacity-0 group-hover:opacity-100 h-full disabled:hidden rounded-none left-0 z-10" />
          <CarouselNext className="hidden lg:flex absolute top-1/2 px-6 h-full border-none bg-background/80 hover:bg-background hover:text-primary-foreground opacity-0 group-hover:opacity-100 disabled:hidden rounded-none right-0 z-10" />
        </Carousel>
      </section>
  );
}