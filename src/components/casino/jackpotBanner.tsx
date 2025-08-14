import { useEffect, useRef, useState } from "react";

import "./jackpotBanner.css";

import card1 from "@/assets/images/jackpot-1.png";
import card2 from "@/assets/images/jackpot-2.png";
import card3 from "@/assets/images/jackpot-3.png";

const SlotMachineDigit = ({
  startChar,
  endChar,
  index,
  totalDigits,
  trigger,
}: {
  startChar: string;
  endChar: string;
  index: number;
  totalDigits: number;
  trigger: boolean;
}) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [transitionStyle, setTransitionStyle] = useState<React.CSSProperties>(
    {}
  );
  const digitHeight = 65;

  const generateDigitSequence = (start: number, end: number): string[] => {
    const result: string[] = [];
    const step = (current: number) => {
      result.push(current.toString());
      const next = (current + 1) % 10;
      if (next !== (end + 1) % 10) {
        step(next);
      }
    };
    step(start);
    return result;
  };

  useEffect(() => {
    if (!/^\d$/.test(endChar)) return;

    if (startChar === endChar) {
      setSequence([endChar]);
      setTransitionStyle({ transform: `translateY(0px)` });
      return;
    }

    const startDigit = parseInt(startChar, 10);
    const endDigit = parseInt(endChar, 10);

    const seq = generateDigitSequence(startDigit, endDigit);
    setSequence(seq);

    if (trigger) {
      const isLeftmost = index === totalDigits - 1;
      const minDuration = 800;
      const maxDuration = 4000;

      const duration =
        minDuration + ((maxDuration - minDuration) * index) / (totalDigits - 1);

      if (isLeftmost) {
        setTransitionStyle({
          transition: "none",
          transform: `translateY(0px)`,
        });

        setTimeout(() => {
          setTransitionStyle({
            transition: `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            transform: `translateY(-${digitHeight * (seq.length - 1)}px)`,
          });
        }, 20);
      } else {
        const cycles = 2;
        const fastDuration = duration * 0.3;
        const slowDuration = duration * 0.7;

        setTransitionStyle({
          transition: "none",
          transform: `translateY(0px)`,
        });

        setTimeout(() => {
          setTransitionStyle({
            transition: `transform ${fastDuration}ms cubic-bezier(0.4, 0, 1, 1)`,
            transform: `translateY(-${digitHeight * 10 * cycles}px)`,
          });

          setTimeout(() => {
            setTransitionStyle({
              transition: `transform ${slowDuration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
              transform: `translateY(-${
                digitHeight * 10 * cycles + digitHeight * (seq.length - 1)
              }px)`,
            });
          }, fastDuration);
        }, 20);
      }
    }
  }, [trigger, startChar, endChar, index, totalDigits]);

  if (!/^\d$/.test(endChar)) {
    return <div className="digit-static">{endChar}</div>;
  }

  return (
    <div className="slot-digit">
      <div className="digit-strip" style={transitionStyle}>
        {[...Array(index === totalDigits - 1 ? 0 : 2)].flatMap(
          (_, roundIndex) => {
            const digits: number[] = Array.from(
              { length: 10 },
              (_, i) => (parseInt(startChar, 10) + i) % 10
            );
            return digits.map((d, i) => (
              <div key={`pre-${roundIndex}-${i}`} className="digit-cell">
                {d}
              </div>
            ));
          }
        )}
        {sequence.map((d, i) => (
          <div key={`final-${i}`} className="digit-cell">
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

const SimpleSlideDigit = ({
  startChar,
  endChar,
  trigger,
  duration = 1000,
  height = 12,
  width = 12,
  fontSize = 12,
}: {
  startChar: string;
  endChar: string;
  trigger: boolean;
  duration?: number;
  height?: number;
  width?: number;
  fontSize?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || startChar === endChar) return;

    const container = containerRef.current;
    container.innerHTML = `
      <div class="digit-cell" style="height:${height}px; width:${width}px; font-size:${fontSize}px; line-height:${height}px; text-align:center;">${startChar}</div>
      <div class="digit-cell" style="height:${height}px; width:${width}px; font-size:${fontSize}px; line-height:${height}px; text-align:center;">${endChar}</div>
    `;

    container.style.transition = "none";
    container.style.transform = `translateY(0px)`;

    if (trigger) {
      setTimeout(() => {
        container.style.transition = `transform ${duration}ms ease-in-out`;
        container.style.transform = `translateY(-${height}px)`;
      }, 20);
    }
  }, [trigger, startChar, endChar, duration, height, width, fontSize]);

  if (startChar === endChar) {
    return (
      <div
        className="digit-static"
        style={{
          height,
          width,
          fontSize,
          lineHeight: `${height}px`,
          textAlign: "center",
        }}
      >
        {endChar}
      </div>
    );
  }

  return (
    <div className="slot-digit simple-slide-digit" style={{ height, width }}>
      <div ref={containerRef} className="digit-strip" />
    </div>
  );
};

const MainAnimatedNumber = ({
  startValue,
  endValue,
  className = "",
  mode = "slot",
}: {
  startValue: string;
  endValue: string;
  className?: string;
  mode?: "slot" | "simple";
}) => {
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    setTrigger(true);
  }, [startValue, endValue]);

  const endChars = endValue.split("");
  const totalDigits = endChars.filter((c) => /\d/.test(c)).length;

  const cleanStart = startValue
    .replace(/[^\d]/g, "")
    .padStart(totalDigits, "0");
  const cleanEnd = endValue.replace(/[^\d]/g, "").padStart(totalDigits, "0");

  const startDigits = cleanStart.split("");
  const endDigits = cleanEnd.split("");

  let digitIndex = startDigits.length - 1;

  const rendered = [...endChars]
    .reverse()
    .map((char, i) => {
      const reversedIndex = endChars.length - 1 - i;

      if (/\d/.test(char)) {
        const sChar = startDigits[digitIndex];
        const eChar = endDigits[digitIndex];

        const shouldAnimate = sChar !== eChar;
        const digitOffset =
          totalDigits - 1 - (startDigits.length - 1 - digitIndex);

        digitIndex--;

        if (!shouldAnimate) {
          return (
            <div key={reversedIndex} className="digit-static static-digit">
              {eChar}
            </div>
          );
        }

        return mode === "simple" ? (
          <SimpleSlideDigit
            key={reversedIndex}
            startChar={sChar}
            endChar={eChar}
            trigger={trigger}
            height={12}
            width={12}
            fontSize={12}
          />
        ) : (
          <SlotMachineDigit
            key={reversedIndex}
            startChar={sChar}
            endChar={eChar}
            index={digitOffset}
            trigger={trigger}
            totalDigits={totalDigits}
          />
        );
      } else {
        return (
          <div key={reversedIndex} className="digit-static">
            {char}
          </div>
        );
      }
    })
    .reverse();

  return (
    <div className={`animated-number-sequence ${className}`}>{rendered}</div>
  );
};

const JackpotBanner = () => {
  const cards = [
    {
      id: 1,
      image: card1,
      start: "20,057€",
      end: "20,843€",
      desc: "major",
    },
    { id: 2, image: card2, start: "10,024€", end: "11,234€", desc: "minor" },
    { id: 3, image: card3, start: "2,906€", end: "3,159€", desc: "mini" },
  ];

  return (
    <div className="jackpot-banner rounded-2xl">
      <div className="jackpot-overlay">
        <h1 className="jackpot-title">
          <span className="jackpot-mega">
            <div>Mega</div>
          </span>
          <br />
          <span className="jackpot-main">
            <div>Jackpot</div>
          </span>
        </h1>

        <div className="jackpot-value-wrapper">
          <MainAnimatedNumber
            startValue="23,123.23€"
            endValue="23,124.89€"
            className="jackpot-main-value"
            mode="slot"
          />
        </div>

        <div className="jackpot-cards">
          {cards.map((card) => (
            <div key={card.id} className="jackpot-card">
              <img
                src={card.image}
                alt={`Card ${card.id}`}
                className="card-image"
              />
              <div className="card-content">
                <span className="card-description">
                  <div id={card.desc}>{card.desc}</div>
                </span>
                <MainAnimatedNumber
                  startValue={card.start}
                  endValue={card.end}
                  mode="simple"
                  className="jackpot-sub-value"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JackpotBanner;
