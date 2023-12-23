import ReactConfetti from "react-confetti";

import { useConfetti } from "~/hooks/use-confetti";

export function Confetti() {
  const confetti = useConfetti();

  if (!confetti.isOpen) {
    return null;
  }

  return (
    <ReactConfetti
      className="pointer-events-none z-[99999]"
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={() => confetti.close()}
    />
  );
}
