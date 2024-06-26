import type { ServerRuntime } from "next";
import Link from "next/link";

import { env } from "~/env.mjs";

export const runtime: ServerRuntime = "edge";

export default function Page() {
  const updatedAt = "March 14, 2024";

  return (
    <>
      <div className="flex h-48 w-full items-center justify-center bg-gray-400">
        <div className="relative text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Privacy Policy
          </h1>
          <div className="mt-4 flex justify-center">
            <div className="rounded-md bg-gray-800 px-2 py-0.5 text-xs text-white">
              Updated {updatedAt}
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="max-w-3/4 relative mx-auto rounded-lg sm:w-2/4">
            <div className="ld-text-gray-500 max-w-none !p-8">
              {/* 1. Overview beings */}
              <div className="mb-5 text-xl font-bold">1. Overview</div>
              <div className="space-y-5">
                <p className="leading-7">
                  By accessing the Site, you agree to not only this Privacy
                  Policy, but also to our Terms of Use and any other written
                  agreements for using the Site.
                </p>
                <p className="leading-7">
                  This Privacy Policy (the “Privacy Policy”) provides a
                  comprehensive description of how {env.NEXT_PUBLIC_APP_NAME}{" "}
                  (“we,” “our,” or “us”) collects, uses, and shares information
                  about you in connection with the website at{" "}
                  {env.NEXT_PUBLIC_APP_DOMAIN}”, as well as your rights and
                  choices regarding such information.
                </p>
              </div>
              {/* 1. Overview ends */}
              {/* 2. Information Collection beings */}
              <div className="mb-5 mt-8 text-xl font-bold">
                2. Information Collection
              </div>
              <div className="space-y-5">
                <p className="leading-7">
                  We may collect the following information about you when you
                  use the Site:
                </p>
                <ul className="list-inside list-disc">
                  <li className="leading-7">
                    Information you provide such as your email, feedback,
                    question and issues reports.
                  </li>
                </ul>
                <p className="leading-7">
                  You may choose to voluntarily provide other information to us
                  that we have not solicited from you, and, in such instances,
                  you are solely responsible for such information.
                </p>
                <p className="leading-7">
                  We may use tracking technologies to automatically collect
                  information including the following:
                </p>
                <ul className="list-inside list-disc space-y-3">
                  <li className="leading-7">
                    <b>Log Files</b>, to record events or errors that occur when
                    using our Site.
                  </li>
                  <li className="leading-7">
                    <b>Cookies</b>, small data stored on your device that are
                    necessary for you to browse the Site.
                  </li>
                </ul>
              </div>
              {/* 2. Information Collection ends */}
              {/* 3. Use of Information begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                3. Use of Information
              </div>
              <p className="leading-7">
                We may need to use it to operate and manage the Services on this
                Site (or other places), provide you support, ensure we comply
                with laws and regulation, and enforce the security of the Site
                or make other improvements.
              </p>
              {/* 3. Use of Information ends */}
              {/* 4. Third-Parties begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                4. Third-Parties
              </div>
              <p className="leading-7">
                This Privacy Policy does not apply to websites, apps, products,
                or services that we do not own or control. For example, your
                interactions with Ethereum wallet are governed by the applicable
                privacy policies of that particular wallet.
              </p>
              {/* 4. Third-Parties ends */}
              {/* 5. Analytics begins */}
              <div className="mb-5 mt-8 text-xl font-bold">5. Analytics</div>
              <div className="space-y-5">
                <p className="leading-7">
                  We use <b>ClickHouse</b> to collect various events from user
                  actions to analyse and make decisions for Site improvements.
                </p>
                <p className="leading-7">
                  We collect profile id to identify the user. This makes sure to
                  give the best experience to the user.
                </p>
                <p className="leading-7">
                  We may change to other third-party analytics service provider.
                  The Privacy Policy of Analytics subjects to the every
                  provider. You should review everything before using the Site.
                </p>
              </div>
              {/* 5. Analytics ends */}
              {/* 6. Your Rights and Choices begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                6. Your Rights and Choices
              </div>
              <div className="space-y-5">
                <p className="leading-7">
                  We may collect the following information about you when you
                  use the Site:
                </p>
                <ul className="list-inside list-disc space-y-2">
                  <li className="leading-7">
                    <b>Cookies</b>. We will only use strictly necessary cookies.
                    These cookies are essential for you to browse the Site and
                    use its features, including accessing secure areas of the
                    Site.
                  </li>
                  <li className="linkify leading-7">
                    <b>Do Not Track</b>. Your browser settings may allow you to
                    automatically transmit a “Do Not Track” signal to the online
                    services you visit. Note, however, there is no industry
                    consensus as to what Site and app operators should do with
                    regard to these signals. Accordingly, unless and until the
                    law is interpreted to require us to do so, we do not monitor
                    or take action with respect to “Do Not Track” signals. For
                    more information on “Do Not Track,” visit{" "}
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
              {/* 6. Your Rights and Choices ends */}
              {/* 7. Data Security begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                7. Data Security
              </div>
              <p className="leading-7">
                We implement and maintain reasonable administrative, physical,
                and technical security safeguards to help protect information
                about you from loss, theft, misuse, unauthorised access,
                disclosure, alteration, and destruction. Nevertheless,
                transmission via the internet is not completely secure and we
                cannot guarantee the security of information about you.
              </p>
              {/* 7. Data Security ends */}
              {/* 8. Children begins */}
              <div className="mb-5 mt-8 text-xl font-bold">8. Children</div>
              <p className="leading-7">
                The Site is intended for general audiences and are not directed
                at children. To use the Site, you must legally be able to enter
                into the Agreement. We do not knowingly collect personal
                information from children.
              </p>
              {/* 8. Children ends */}
              {/* 9. Changes to Policy begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                9. Changes to Policy
              </div>
              <p className="leading-7">
                We reserve the right to revise and reissue this Privacy Policy
                at any time. Any changes will be effective immediately upon our
                posting of the revised Privacy Policy. For the avoidance of
                doubt, your continued use of the Site indicates your consent to
                the revised Privacy Policy then posted.
              </p>
              {/* 9. Changes to Policy ends */}
              {/* 10. Contact begins */}
              <div className="mb-5 mt-8 text-xl font-bold">10. Contact</div>
              <p className="leading-7">
                If you have any questions or comments about this Privacy Policy,
                our data practices, or our compliance with applicable law,
                please contact us at info@andreadichio.it
              </p>
              {/* 10. Contact ends */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
