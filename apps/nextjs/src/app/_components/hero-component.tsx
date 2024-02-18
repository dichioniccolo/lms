import Image from "next/image";
import Link from "next/link";

import { Button } from "@acme/ui/components/ui/button";
import { Logo } from "@acme/ui/icons/logo";

import { env } from "~/env.mjs";

export function HeroComponent() {
  return (
    <div className="border-divider-primary min-h-[620px] w-full overflow-hidden border-b-2 text-center md:min-h-[580px]">
      <div className="relative flex h-full w-full flex-col items-center justify-between pb-6">
        <Image
          className="absolute top-0 -z-10 mt-16 hidden h-full w-[1560px] max-w-[unset] scale-90 object-contain md:block"
          src="/hero-banner-2.webp"
          alt="ConversionRateExpert"
          width={1513}
          height={480}
        />
        <div className="mt-8 flex max-w-[355px] flex-col items-center justify-center gap-4 text-balance md:max-w-fit md:gap-4 md:px-4">
          <Logo size={200} alt={env.NEXT_PUBLIC_APP_NAME} />
          <h1 className="text-heading-xl max-w-[660px] px-3 md:px-0 md:text-[54px]">
            Benvenuti all&apos;{env.NEXT_PUBLIC_APP_NAME}
          </h1>
          <p className="max-w-[600px] px-4 text-lg font-normal md:px-0">
            <span>
              Se siete alla ricerca di crescita personale, benessere interiore e
              strumenti pratici per vivere una vita più piena e appagante, siete
              nel posto giusto. L&apos;{env.NEXT_PUBLIC_APP_NAME} offre una
              vasta gamma di corsi, workshop e risorse progettate per aiutarvi a
              scoprire il vostro potenziale e a raggiungere i vostri obiettivi.
            </span>
          </p>

          <div className="flex gap-4 md:pt-4">
            <Button variant="default" size="lg">
              <Link href="/login">Crea un account</Link>
            </Button>
          </div>

          <div className="mt-4 flex flex-col items-center gap-4 text-muted-foreground/80">
            <div className="text-sm font-normal tracking-[-0.024em]">
              Cosa offriamo
            </div>
            <div className="mt-0 flex items-center gap-6">
              <span className="font-semibold text-black">
                Corsi Specializzati
              </span>
              <span className="font-semibold text-black">Risorse Online</span>
              <span className="font-semibold text-black">
                Approccio Olistico
              </span>
              <span className="font-semibold text-black">
                Supporto Continuo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
