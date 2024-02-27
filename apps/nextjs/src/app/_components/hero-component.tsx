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
          className="absolute top-0 -z-10 h-full w-[1560px] max-w-[unset] object-cover blur-sm"
          src="/_static/hero-section.jpeg"
          alt={env.NEXT_PUBLIC_APP_NAME}
          width={1513}
          height={480}
        />
        <div className="mt-8 flex max-w-[355px] flex-col items-center justify-center gap-4 text-balance md:max-w-fit md:gap-4 md:px-4">
          <Logo size={200} alt={env.NEXT_PUBLIC_APP_NAME} />
          <h1 className="text-heading-xl max-w-[660px] px-3 md:px-0 md:text-[54px]">
            {env.NEXT_PUBLIC_APP_NAME}
          </h1>
          <p className="max-w-[600px] px-4 text-lg font-normal md:px-0">
            Se sei alla ricerca di crescita personale, benessere interiore e
            strumenti pratici per vivere una vita più piena e appagante, sei nel
            posto giusto.
          </p>
          <p className="max-w-[600px] px-4 text-lg font-normal md:px-0">
            {env.NEXT_PUBLIC_APP_NAME} offre una vasta gamma di corsi, workshop
            e risorse progettate per aiutarti a scoprire il tuo potenziale e a
            raggiungere i tuoi obiettivi.
          </p>

          <div className="flex gap-4 md:pt-4">
            <Button variant="default" size="lg">
              <Link href="/login">Crea un account gratuito</Link>
            </Button>
          </div>

          <div className="mt-4 flex flex-col items-center gap-4">
            <div className="text-lg font-normal tracking-[-0.024em] text-primary">
              Cosa offriamo
            </div>
            <div className="mt-0 flex items-center gap-6">
              <span className="font-semibold text-primary-foreground">
                Corsi Specializzati
              </span>
              <span className="font-semibold text-primary-foreground">
                Risorse Online
              </span>
              <span className="font-semibold text-primary-foreground">
                Approccio Olistico
              </span>
              <span className="font-semibold text-primary-foreground">
                Supporto Continuo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
