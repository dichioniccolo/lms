import {
  Body,
  Button,
  Container,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { env } from "../env.mjs";
import Head from "./components/Head";

interface Props {
  siteName: string;
  user: {
    name?: string | null;
    email: string;
  };
  course: {
    title: string;
  };
}

export const CoursePurchased = ({
  siteName,
  user = {
    name: "John Doe",
    email: "test@example.com",
  },
  course = {
    title: "Course title",
  },
}: Props) => {
  const previewText = `Thank you for purchasing the course ${course.title}`;

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
              {course.title}
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {user.name ?? user.email},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              thank you for purchasing the course{" "}
              <strong>{course.title}</strong>. Your purchase is now complete and
              you can watching the course by clicking the button below.
            </Text>
            <Section className="my-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={`https://${env.NEXT_PUBLIC_APP_DOMAIN}/login`}
              >
                Sign in
              </Button>
            </Section>
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

export default CoursePurchased;
