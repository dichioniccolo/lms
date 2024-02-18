import {
  Body,
  Button,
  Container,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { env } from "../env.mjs";
import Head from "./components/Head";

interface LoginLinkProps {
  siteName: string;
  url: string;
  user: {
    name?: string | null;
    email: string;
  };
}

export const LoginLink = ({ siteName, url, user }: LoginLinkProps) => {
  const previewText = `Login link on ${siteName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[500px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`https://${env.NEXT_PUBLIC_APP_DOMAIN}/logo.png`}
                width="40"
                height="37"
                alt={siteName}
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Autenticati su <strong>{siteName}</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Ciao {user.name ?? user.email},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              ecco il tuo link per eseguire l'autenticazione su{" "}
              <strong>{siteName}</strong>.
            </Text>
            <Section className="my-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Login
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              oppure copia e incolla questo URL sul tuo browser:{" "}
              <Link href={url} className="text-blue-600 no-underline">
                {url}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This email was intended for{" "}
              <span className="text-black">{user.name ?? user.email}</span>. If
              you were not expecting this email, you can ignore it. If you are
              concerned about your account&apos;s safety, please reply to this
              email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default LoginLink;
