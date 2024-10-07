import type { ServerRuntime } from "next";

export const runtime: ServerRuntime = "edge";

export default function Page() {
  const updatedAt = "07 Ottobre 2024";

  return (
    <>
      {/* Sezione Header */}
      <div className="flex h-48 w-full items-center justify-center bg-gray-400">
        <div className="relative text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Termini & Condizioni
          </h1>
          <div className="mt-4 flex justify-center">
            <div className="rounded-md bg-gray-800 px-2 py-0.5 text-xs text-white">
              Aggiornato il {updatedAt}
            </div>
          </div>
        </div>
      </div>

      {/* Sezione Contenuto Principale */}
      <div className="relative">
        <div className="flex justify-center">
          <div className="max-w-3/4 relative mx-auto rounded-lg sm:w-2/4">
            <div className="ld-text-gray-500 max-w-none !p-8">
              {/* 1. Panoramica */}
              <div className="mb-5 text-xl font-bold">1. Panoramica</div>
              <div className="space-y-5">
                <p className="leading-7">
                  Il sito web {process.env.NEXT_PUBLIC_APP_DOMAIN} (il "Sito")
                  offre corsi online.
                </p>
                <p className="leading-7">
                  Visitando il Sito, accetti di essere vincolato dai seguenti
                  termini e condizioni (“Termini”), inclusi quelli aggiuntivi e
                  politiche qui riferiti e/o disponibili tramite hyperlink
                  (collettivamente, l’“Accordo”). L'Accordo si applica a tutti
                  gli utenti del Sito, inclusi a titolo esemplificativo utenti
                  che sono navigatori, costruttori e/o contributori di
                  contenuti.
                </p>
                <p className="leading-7">
                  Ti preghiamo di leggere attentamente questi Termini prima di
                  accedere o utilizzare il Sito. Se non accetti tutti i termini
                  dell'Accordo, non dovresti accedere al Sito; tuttavia,
                  accedendo al Sito, acconsenti all'Accordo.
                </p>
                <p className="leading-7">
                  Eventuali nuove funzionalità o strumenti aggiunti al Sito
                  saranno soggetti ai Termini. Puoi rivedere la versione più
                  aggiornata dei Termini in qualsiasi momento su questa pagina.
                  Ci riserviamo il diritto di aggiornare, modificare o
                  sostituire qualsiasi parte di questi Termini pubblicando
                  aggiornamenti e/o modifiche sul nostro Sito. È tua
                  responsabilità controllare periodicamente questa pagina per
                  eventuali modifiche. L’uso continuato del Sito dopo la
                  pubblicazione di eventuali modifiche costituisce accettazione
                  di tali modifiche.
                </p>
              </div>
              {/* 1. Panoramica ends */}

              {/* 2. Condizioni Generali */}
              <div className="mb-5 mt-8 text-xl font-bold">
                2. Condizioni Generali
              </div>
              <p className="leading-7">
                Non puoi utilizzare il nostro Sito per scopi illegali o non
                autorizzati, né puoi, nell'utilizzo del Servizio, violare alcuna
                legge nella tua giurisdizione (incluso, ma non limitato alle
                leggi sul copyright). Ci riserviamo il diritto di rifiutare i
                servizi a chiunque per qualsiasi motivo in qualsiasi momento.
                Possiamo interrompere (in modo permanente o temporaneo) la
                fornitura dei servizi o di qualsiasi funzionalità all'interno
                del Sito a te o agli utenti in generale.
              </p>
              {/* 2. Condizioni Generali ends */}

              {/* 3. Servizi */}
              <div className="mb-5 mt-8 text-xl font-bold">3. Servizi</div>
              <div className="space-y-5">
                <p className="leading-7">
                  Ci riserviamo il diritto - ma non l'obbligo - di limitare la
                  fornitura di Profili o Servizi a qualsiasi persona, regione
                  geografica o giurisdizione. Potremmo esercitare questo diritto
                  caso per caso a nostra esclusiva discrezione.
                </p>
                <ul className="list-inside list-disc space-y-3">
                  <li className="leading-7">
                    Il tuo profilo, la tua responsabilità.
                  </li>
                  <li className="leading-7">
                    Sei responsabile della sicurezza del tuo account.
                  </li>
                  <li className="leading-7">
                    Sei l'unico responsabile della valutazione del Sito e delle
                    sue funzionalità prima di utilizzarle.
                  </li>
                </ul>
              </div>
              {/* 3. Servizi ends */}

              {/* 4. Modifica dei Servizi */}
              <div className="mb-5 mt-8 text-xl font-bold">
                4. Modifica dei Servizi
              </div>
              <p className="leading-7">
                Ci riserviamo il diritto di modificare o interrompere il Sito (o
                qualsiasi parte o contenuto di esso) in qualsiasi momento senza
                preavviso. Non saremo responsabili nei tuoi confronti o nei
                confronti di terze parti per eventuali modifiche, cambiamenti di
                informazioni, sospensioni o interruzioni del Sito.
              </p>
              {/* 4. Modifica dei Servizi ends */}

              {/* 5. Informazioni Personali */}
              <div className="mb-5 mt-8 text-xl font-bold">
                5. Informazioni Personali
              </div>
              <p className="leading-7">
                L'invio di informazioni personali tramite il Sito è regolato
                dalla nostra{" "}
                <a href="/privacy" className="text-blue-500 underline">
                  Privacy Policy
                </a>
                .
              </p>
              {/* 5. Informazioni Personali ends */}

              {/* 6. Usi Proibiti */}
              <div className="mb-5 mt-8 text-xl font-bold">6. Usi Proibiti</div>
              <div className="space-y-5">
                <p className="leading-7">
                  Non è consentito utilizzare il Sito per scopi illegali,
                  violare i diritti di proprietà intellettuale di altre persone,
                  molestie o comportamenti abusivi, diffondere false
                  informazioni o virus, spamming o interferire con le
                  funzionalità di sicurezza del Sito.
                </p>
                <p className="leading-7">È vietato utilizzare il Sito per:</p>
                <ul className="list-inside list-disc space-y-2">
                  <li className="leading-7">
                    qualsiasi scopo illegale e per sollecitare altri a compiere
                    o partecipare ad atti illeciti;
                  </li>
                  <li className="leading-7">
                    violare qualsiasi regolamento internazionale, federale,
                    provinciale o statale, regole, leggi o ordinanze locali;
                  </li>
                  <li className="leading-7">
                    infrangere o violare i nostri diritti di proprietà
                    intellettuale o i diritti di proprietà intellettuale di
                    altri;
                  </li>
                  <li className="leading-7">
                    molestare, abusare, insultare, danneggiare, diffamare,
                    calunniare, denigrare, intimidire o discriminare in base al
                    genere, orientamento sessuale, religione, etnia, razza, età,
                    origine nazionale o disabilità;
                  </li>
                  <li className="leading-7">
                    inviare informazioni false o fuorvianti o caricare o
                    trasmettere virus o qualsiasi altro tipo di codice dannoso
                    che possa influire sulla funzionalità o sul funzionamento
                    del Sito o di qualsiasi sito correlato, altri siti web o
                    Internet;
                  </li>
                  <li className="leading-7">
                    raccogliere o tracciare le informazioni personali di altri
                    per spamming, phishing, pretexting, crawling o scraping;
                  </li>
                  <li className="leading-7">
                    qualsiasi scopo osceno o immorale o per interferire con o
                    aggirare le funzionalità di sicurezza del Sito o di
                    qualsiasi sito correlato, altri siti web o Internet. Ci
                    riserviamo il diritto di terminare il tuo utilizzo del Sito
                    o di qualsiasi sito correlato per la violazione di uno
                    qualsiasi degli usi proibiti.
                  </li>
                </ul>
              </div>
              {/* 6. Usi Proibiti ends */}

              {/* 7. Esclusione di Garanzie */}
              <div className="mb-5 mt-8 text-xl font-bold">
                7. Esclusione di Garanzie
              </div>
              <p className="leading-7">
                Il Sito è fornito "così com'è" e "come disponibile". Non
                garantiamo che l'uso del Sito sarà ininterrotto, tempestivo,
                sicuro o privo di errori.
              </p>
              {/* 7. Esclusione di Garanzie ends */}

              {/* 8. Legge Applicabile */}
              <div className="mb-5 mt-8 text-xl font-bold">
                8. Legge Applicabile
              </div>
              <p className="leading-7">
                Questi Termini e qualsiasi Accordo separato in base al quale
                forniamo i Servizi saranno regolati e interpretati in base alle
                leggi di {process.env.NEXT_PUBLIC_APP_COUNTRY}.
              </p>
              {/* 8. Legge Applicabile ends */}

              {/* 9. Informazioni di Contatto */}
              <div className="mb-5 mt-8 text-xl font-bold">
                9. Informazioni di Contatto
              </div>
              <p className="leading-7">
                Domande sui Termini & Condizioni devono essere inviate a{" "}
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_APP_CONTACT}`}
                  className="text-blue-500 underline"
                >
                  {process.env.NEXT_PUBLIC_APP_CONTACT}
                </a>
                .
              </p>
              {/* 9. Informazioni di Contatto ends */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
