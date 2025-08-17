import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import win1 from "@/assets/images/big-wins-1.webp";
import win2 from "@/assets/images/big-wins-2.webp";

const slides = [
  {
    image: win1,
    title: "Mega Jackpot",
    username: "LuckyPlayer",
    price: "€3,450",
  },
  {
    image: win2,
    title: "Roulette Win",
    username: "SpinMaster",
    price: "€1,200",
  },
  {
    image: win1,
    title: "Poker Royal Flush",
    username: "CardShark",
    price: "€2,000",
  },
  {
    image: win2,
    title: "Blackjack Win",
    username: "AceHigh",
    price: "€1,500",
  },
  {
    image: win1,
    title: "Big Slot Win",
    username: "JackpotJoy",
    price: "€4,000",
  },
  {
    image: win2,
    title: "Lucky Roulette",
    username: "RedQueen",
    price: "€1,100",
  },
];

export default function BigWinsSlider() {
  return (
    <section className="relative max-w-[calc(var(--section-width)+10px)] mx-auto group">
      

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem
              key={index}
              className="basis-1/5 lg:basis-1/5 md:basis-1/3 sm:basis-1/2 p-2"
            >
              <div className="flex items-center gap-4 p-3 border border-primary-foreground rounded-lg bg-background shadow-sm shadow-white/10">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-20 h-20 rounded-md object-cover"
                />
                <div className="flex flex-col flex-1">
                  <p className="font-semibold text-sm">{slide.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <img
                      src={slide.image}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <p>@{slide.username}</p>
                  </div>
                  <p className="text-primary-foreground font-bold mt-1">{slide.price}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex justify-between mt-2">
          <CarouselPrevious className="hidden lg:flex top-1/2 px-6 border-none bg-background/80 hover:bg-background hover:text-primary-foreground opacity-0 group-hover:opacity-100 h-full disabled:hidden rounded-none left-0 z-10" />
          <CarouselNext className="hidden lg:flex absolute top-1/2 px-6 h-full border-none bg-background/80 hover:bg-background hover:text-primary-foreground opacity-0 group-hover:opacity-100 disabled:hidden rounded-none right-0 z-10" />
        </div>
      </Carousel>
    </section>
  );
}
