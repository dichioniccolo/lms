import { EventSchemas, Inngest } from "inngest";

interface WrapWithData<T> {
  data: T;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type InngestEvents = {
  "lms/user/login-link": WrapWithData<{
    email: string;
    url: string;
  }>;
  "lms/course/invitation": WrapWithData<{
    course: {
      title: string;
    };
    user: {
      name?: string | null;
      email: string;
    };
  }>;
  "lms/course/purchased": WrapWithData<{
    course: {
      id: string;
      title: string;
    };
    user: {
      id: string;
      stripeCustomerId: string;
      name?: string | null;
      email: string;
    };
  }>;
};

export const inngest = new Inngest({
  id: "lms",
  schemas: new EventSchemas().fromRecord<InngestEvents>(),
});
