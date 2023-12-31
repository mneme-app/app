// import { confetti } from "canvas-confetti";
import confetti from "canvas-confetti";

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

const audio =
    typeof window !== "undefined" && typeof Audio !== "undefined"
        ? new Audio(
              `${
                  process.env.NEXT_PUBLIC_BASEPATH ?? ""
              }/assets/sounds/clap.wav`,
          )
        : null;
if (audio) audio.volume = 0.1;

export function correctConfetti() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
    };

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: {
                    x: randomInRange(0.1, 0.3),
                    y: Math.random() - 0.2,
                },
            }),
        );
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: {
                    x: randomInRange(0.7, 0.9),
                    y: Math.random() - 0.2,
                },
            }),
        );
    }, 250);

    if (audio) audio.play();
}
