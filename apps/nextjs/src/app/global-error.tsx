"use client";

// Error boundaries must be Client Components
import { useEffect } from "react";
import Error from "next/error";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Qualcosa è andato storto!</h2>
        <button onClick={() => reset()}>Riprova</button>
      </body>
    </html>
  );
}
