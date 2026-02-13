import { useCallback, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from "react";

type Heart = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
};

const HEART_EMOJIS = ["💖", "💘", "💕", "💗", "💓", "💞"];
const NO_BUTTON_SIZE = { width: 112, height: 48 };

const App = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [noPosition, setNoPosition] = useState({ x: 176, y: 96 });
  const [accepted, setAccepted] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);

  const moveNoButton = useCallback((cursorX?: number, cursorY?: number) => {
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const maxX = Math.max(8, rect.width - NO_BUTTON_SIZE.width - 8);
    const maxY = Math.max(8, rect.height - NO_BUTTON_SIZE.height - 8);

    let nextX = Math.random() * maxX;
    let nextY = Math.random() * maxY;

    if (typeof cursorX === "number" && typeof cursorY === "number") {
      let attempts = 0;
      while (attempts < 18) {
        const distance = Math.hypot(nextX - cursorX, nextY - cursorY);
        if (distance > 120) break;
        nextX = Math.random() * maxX;
        nextY = Math.random() * maxY;
        attempts += 1;
      }
    }

    setNoPosition({ x: nextX, y: nextY });
  }, []);

  const maybeDodgeNoButton = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (accepted) return;

      const stage = stageRef.current;
      if (!stage) return;

      const stageRect = stage.getBoundingClientRect();
      const noCenterX = noPosition.x + NO_BUTTON_SIZE.width / 2;
      const noCenterY = noPosition.y + NO_BUTTON_SIZE.height / 2;
      const cursorX = event.clientX - stageRect.left;
      const cursorY = event.clientY - stageRect.top;

      const distance = Math.hypot(cursorX - noCenterX, cursorY - noCenterY);
      if (distance < 95) {
        moveNoButton(cursorX, cursorY);
      }
    },
    [accepted, moveNoButton, noPosition.x, noPosition.y],
  );

  const launchHearts = useCallback(() => {
    const burst: Heart[] = Array.from({ length: 44 }, (_, index) => ({
      id: Date.now() + index,
      left: Math.random() * 100,
      size: 18 + Math.random() * 24,
      duration: 1.8 + Math.random() * 2,
      delay: Math.random() * 0.35,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
    }));

    setHearts(burst);
    window.setTimeout(() => setHearts([]), 4200);
  }, []);

  const handleYes = useCallback(() => {
    setAccepted(true);
    launchHearts();
  }, [launchHearts]);

  const heroText = useMemo(
    () =>
      accepted
        ? "Best decision ever. I love you • Be ready for dinner on February 14."
        : "Will you be my Valentine? 💘",
    [accepted],
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-pink-100 to-fuchsia-100 px-4 py-10 text-slate-800">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,_#f9a8d4_0%,transparent_40%),radial-gradient(circle_at_80%_30%,_#fbcfe8_0%,transparent_35%),radial-gradient(circle_at_50%_80%,_#fda4af_0%,transparent_40%)]" />

      <section className="relative mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl border border-rose-200/70 bg-white/80 p-6 text-center shadow-xl backdrop-blur-md transition-all duration-500 sm:p-10">
        <p className="mb-2 text-sm font-medium text-rose-500">💌 Hey cutie • tu me fais fondre 🫶</p>
        <h1 className="text-balance text-3xl font-bold leading-tight text-rose-600 transition-all duration-500 sm:text-4xl">
          {heroText}
        </h1>
        <p className="mt-3 text-sm text-rose-500 sm:text-base">🌹✨ Une petite question romantique, version fun et douce.</p>

        <div
          ref={stageRef}
          onMouseMove={maybeDodgeNoButton}
          className="relative mt-8 h-60 w-full max-w-md rounded-2xl border border-rose-200 bg-rose-50/70 p-4"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={handleYes}
              className="h-12 min-w-28 rounded-full bg-rose-500 px-6 text-base font-semibold text-white shadow-lg shadow-rose-300/70 transition-all duration-300 hover:scale-105 hover:bg-rose-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-300"
            >
              Yes 💖
            </button>
          </div>

          {!accepted && (
            <button
              type="button"
              onMouseEnter={(event) => {
                const stage = stageRef.current;
                if (!stage) return;
                const stageRect = stage.getBoundingClientRect();
                moveNoButton(event.clientX - stageRect.left, event.clientY - stageRect.top);
              }}
              onClick={(event) => {
                event.preventDefault();
                const stage = stageRef.current;
                if (!stage) return;
                const stageRect = stage.getBoundingClientRect();
                moveNoButton(event.clientX - stageRect.left, event.clientY - stageRect.top);
              }}
              className="absolute h-12 min-w-28 rounded-full border-2 border-rose-300 bg-white px-6 text-base font-semibold text-rose-500 shadow-md transition-transform duration-300"
              style={{
                left: `${noPosition.x}px`,
                top: `${noPosition.y}px`,
              }}
            >
              No 🙈
            </button>
          )}
        </div>
      </section>

      {hearts.map((heart) => (
        <span
          key={heart.id}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 animate-[floatHeart_var(--dur)_ease-out_forwards]"
          style={
            {
              left: `${heart.left}%`,
              fontSize: `${heart.size}px`,
              animationDelay: `${heart.delay}s`,
              "--dur": `${heart.duration}s`,
            } as CSSProperties
          }
        >
          {heart.emoji}
        </span>
      ))}

      <style>{`
        @keyframes floatHeart {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.6) rotate(0deg);
          }
          12% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-78vh) scale(1.5) rotate(28deg);
          }
        }
      `}</style>
    </main>
  );
};

export default App;
