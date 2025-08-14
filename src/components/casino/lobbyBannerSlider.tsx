import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import banner1 from "@/assets/images/lobby-banner-1.webp";
import banner2 from "@/assets/images/lobby-banner-2.webp";
import banner3 from "@/assets/images/lobby-banner-3.webp";
import { Button } from "../ui/button";

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
];

export default function LobbyBannerSlider() {
  return (
    <section className="relative w-full mx-auto group">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="md:basis-1/3 sm:basis-1/2 basis-full p-[5px]"
            >
              <div
                className="flex items-center h-[190px] w-full rounded-[20px] bg-cover bg-center bg-no-repeat relative overflow-hidden p-4"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="flex flex-col items-start justify-between h-full relative z-[1] rounded-[16px]">
                  <Button variant="outline" size="sm">{slide.title}</Button>
                  <div>
                    <h4 className="font-bold text-yellow-300 text-2xl">
                      {slide.description}
                    </h4>
                    <p className=" text-yellow-300 ">{slide.subDescription}</p>
                  </div>
                  <Button variant="outline">{slide.buttonTitle}</Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}
