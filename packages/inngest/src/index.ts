import { EventSchemas, Inngest } from "inngest";

interface WrapWithData<T> {
  data: T;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type InngestEvents = {
  "user/login-link": WrapWithData<{
    email: string;
    url: string;
  }>;
};

export const inngest = new Inngest({
  id: "lms",
  schemas: new EventSchemas().fromRecord<InngestEvents>(),
});
