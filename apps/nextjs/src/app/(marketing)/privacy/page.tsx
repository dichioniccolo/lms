import type { ServerRuntime } from "next";
import Link from "next/link";

import { env } from "~/env.mjs";

export const runtime: ServerRuntime = "edge";

export default function Page() {
  const updatedAt = "07 Ottobre 2024";

  return (
    <>
      <div className="flex h-48 w-full items-center justify-center bg-gray-400">
        <div className="relative text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Informativa sulla Privacy
          </h1>
          <div className="mt-4 flex justify-center">
            <div className="rounded-md bg-gray-800 px-2 py-0.5 text-xs text-white">
              Aggiornato {updatedAt}
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="max-w-3/4 relative mx-auto rounded-lg sm:w-2/4">
            <div className="ld-text-gray-500 max-w-none !p-8">
              {/* 1. Panoramica begins */}
              <div className="mb-5 text-xl font-bold">1. Panoramica</div>
              <div className="space-y-5">
                <p className="leading-7">
                  Accedendo al Sito, accetti non solo questa Informativa sulla
                  Privacy, ma anche i nostri Termini di Utilizzo e qualsiasi
                  altro accordo scritto per l'uso del Sito.
                </p>
                <p className="leading-7">
                  Questa Informativa sulla Privacy (la "Privacy Policy")
                  fornisce una descrizione completa di come{" "}
                  {env.NEXT_PUBLIC_APP_NAME} ("noi", "nostro", o "ci")
                  raccoglie, utilizza e condivide informazioni su di te in
                  relazione al sito web su{" "}
                  {env.VERCEL_URL ?? env.NEXT_PUBLIC_APP_DOMAIN}, oltre ai tuoi
                  diritti e scelte riguardo tali informazioni.
                </p>
              </div>
              {/* 1. Panoramica ends */}
              {/* 2. Raccolta delle Informazioni begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                2. Raccolta delle Informazioni
              </div>
              <div className="space-y-5">
                <p className="leading-7">
                  Potremmo raccogliere le seguenti informazioni su di te quando
                  utilizzi il Sito:
                </p>
                <ul className="list-inside list-disc">
                  <li className="leading-7">
                    Informazioni che fornisci come la tua email, feedback,
                    domande e segnalazioni di problemi.
                  </li>
                </ul>
                <p className="leading-7">
                  Potresti scegliere di fornirci volontariamente altre
                  informazioni che non abbiamo richiesto, e, in tali casi, sei
                  l'unico responsabile di tali informazioni.
                </p>
                <p className="leading-7">
                  Potremmo utilizzare tecnologie di tracciamento per raccogliere
                  automaticamente informazioni tra cui le seguenti:
                </p>
                <ul className="list-inside list-disc space-y-3">
                  <li className="leading-7">
                    <b>File di Log</b>, per registrare eventi o errori che si
                    verificano durante l'uso del nostro Sito.
                  </li>
                  <li className="leading-7">
                    <b>Cookie</b>, piccoli dati memorizzati sul tuo dispositivo
                    che sono necessari per navigare nel Sito.
                  </li>
                </ul>
              </div>
              {/* 2. Raccolta delle Informazioni ends */}
              {/* 3. Uso delle Informazioni begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                3. Uso delle Informazioni
              </div>
              <p className="leading-7">
                Potremmo doverle utilizzare per gestire e operare i Servizi su
                questo Sito (o altri), fornire supporto, assicurarci di
                rispettare leggi e regolamenti, rafforzare la sicurezza del Sito
                o apportare altri miglioramenti.
              </p>
              {/* 3. Uso delle Informazioni ends */}
              {/* 4. Terze Parti begins */}
              <div className="mb-5 mt-8 text-xl font-bold">4. Terze Parti</div>
              <p className="leading-7">
                Questa Informativa sulla Privacy non si applica a siti web, app,
                prodotti o servizi che non possediamo o controlliamo. Ad
                esempio, le tue interazioni con il portafoglio Ethereum sono
                regolate dalle politiche sulla privacy di quel particolare
                portafoglio.
              </p>
              {/* 4. Terze Parti ends */}
              {/* 5. Analitica begins */}
              <div className="mb-5 mt-8 text-xl font-bold">5. Analitica</div>
              <div className="space-y-5">
                <p className="leading-7">
                  Utilizziamo <b>ClickHouse</b> per raccogliere vari eventi
                  dalle azioni degli utenti e analizzarli per migliorare il
                  Sito.
                </p>
                <p className="leading-7">
                  Raccogliamo l'ID del profilo per identificare l'utente. Questo
                  assicura di offrire la migliore esperienza possibile.
                </p>
                <p className="leading-7">
                  Potremmo passare ad altri fornitori di servizi di analitica di
                  terze parti. L'Informativa sulla Privacy di tali servizi è
                  soggetta a ogni fornitore. Dovresti esaminare tutto prima di
                  utilizzare il Sito.
                </p>
              </div>
              {/* 5. Analitica ends */}
              {/* 6. I Tuoi Diritti e Scelte begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                6. I Tuoi Diritti e Scelte
              </div>
              <div className="space-y-5">
                <p className="leading-7">
                  Potremmo raccogliere le seguenti informazioni su di te quando
                  utilizzi il Sito:
                </p>
                <ul className="list-inside list-disc space-y-2">
                  <li className="leading-7">
                    <b>Cookie</b>. Utilizzeremo solo i cookie strettamente
                    necessari. Questi cookie sono essenziali per navigare nel
                    Sito e utilizzarne le funzionalità, inclusi l'accesso alle
                    aree sicure del Sito.
                  </li>
                  <li className="linkify leading-7">
                    <b>Do Not Track</b>. Le impostazioni del tuo browser
                    potrebbero permetterti di trasmettere automaticamente un
                    segnale "Do Not Track" ai servizi online che visiti.
                    Tuttavia, non esiste consenso nel settore su cosa fare con
                    questi segnali. Pertanto, a meno che la legge non ci imponga
                    di farlo, non monitoriamo o prendiamo provvedimenti riguardo
                    ai segnali "Do Not Track". Per maggiori informazioni su "Do
                    Not Track", visita{" "}
                    <Link
                      href="https://allaboutdnt.com"
                      rel="noreferrer"
                      target="_blank"
                    >
                      https://allaboutdnt.com
                    </Link>
                    .
                  </li>
                </ul>
              </div>
              {/* 6. I Tuoi Diritti e Scelte ends */}
              {/* 7. Sicurezza dei Dati begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                7. Sicurezza dei Dati
              </div>
              <p className="leading-7">
                Implementiamo e manteniamo misure di sicurezza amministrative,
                fisiche e tecniche ragionevoli per aiutare a proteggere le
                informazioni su di te da perdita, furto, uso improprio, accesso
                non autorizzato, divulgazione, alterazione e distruzione.
                Tuttavia, la trasmissione via internet non è completamente
                sicura e non possiamo garantire la sicurezza delle informazioni
                su di te.
              </p>
              {/* 7. Sicurezza dei Dati ends */}
              {/* 8. Minori begins */}
              <div className="mb-5 mt-8 text-xl font-bold">8. Minori</div>
              <p className="leading-7">
                Il Sito è destinato a un pubblico generale e non è diretto ai
                minori. Per utilizzare il Sito, devi essere legalmente in grado
                di stipulare l'Accordo. Non raccogliamo consapevolmente
                informazioni personali dai minori.
              </p>
              {/* 8. Minori ends */}
              {/* 9. Modifiche alla Politica begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                9. Modifiche alla Politica
              </div>
              <p className="leading-7">
                Ci riserviamo il diritto di rivedere e ripubblicare questa
                Informativa sulla Privacy in qualsiasi momento. Eventuali
                modifiche saranno efficaci immediatamente al momento della
                pubblicazione della Privacy Policy revisionata. Per evitare
                dubbi, il tuo uso continuato del Sito indica il tuo consenso
                alla Privacy Policy revisionata allora pubblicata.
              </p>
              {/* 9. Modifiche alla Politica ends */}
              {/* 10. Contatti begins */}
              <div className="mb-5 mt-8 text-xl font-bold">10. Contatti</div>
              <p className="leading-7">
                Se hai domande o commenti su questa Informativa sulla Privacy,
                sulle nostre pratiche di dati, o sulla nostra conformità alla
                legge applicabile, contattaci a info@andreadichio.it.
              </p>
              {/* 10. Contatti ends */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
