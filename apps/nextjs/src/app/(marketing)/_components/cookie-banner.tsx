"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { handleCookieAction } from "../actions";

type Props = {
  consent: string;
};

export function CookieBanner({ consent }: Props) {
  if (consent !== "undecided") {
    return null;
  }

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 70, damping: 20 }}
      className="fixed bottom-0 left-0 z-50 w-full bg-gray-900 p-4 text-white"
    >
      <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
        <p className="mb-2 text-sm md:mb-0 md:text-base">
          Utilizziamo i cookie per migliorare l'esperienza utente. Leggi la
          nostra{" "}
          <Link href="/privacy" className="underline">
            Politica sulla Privacy
          </Link>
          .
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => handleCookieAction("rejected")}
            className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
          >
            Rifiuta
          </button>
          <button
            onClick={() => handleCookieAction("accepted")}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
          >
            Accetta
          </button>
        </div>
      </div>
    </motion.div>
  );
}
