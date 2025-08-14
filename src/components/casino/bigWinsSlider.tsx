import win1 from "@/assets/images/big-wins-1.webp";
import win2 from "@/assets/images/big-wins-2.webp";

import { useIsDesktop } from "@/hooks/useIsDesktop";
import ArrowUpIcon  from "@/assets/icons/arrow-up.svg?react";
import { useCallback } from "react";

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
  const isDesktop = useIsDesktop();


  const goToPrev = useCallback(() => {}, []);
  const goToNext = useCallback(() => {}, []);

  return (
    <section>
      <div>
        <div>
          <h2>
            <div>Big Wins</div>
          </h2>
        </div>

        {isDesktop && (
          <div>
            <div>
              <button onClick={goToPrev} aria-label="Previous provider">
                <ArrowUpIcon />
              </button>
            </div>
            <div>
              <button onClick={goToNext} aria-label="Next provider">
                <ArrowUpIcon />
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        {slides.map((slide, index) => (
          <div key={index}>
            <div>
              <img
                src={slide.image}
                alt={slide.title}
                width={80}
                height={80}
              />
              <div>
                <p>{slide.title}</p>
                <div>
                  <img
                    src={slide.image}
                    alt=""
                    width={32}
                    height={32}
                  />
                  <p>@{slide.username}</p>
                </div>
                <p>{slide.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
