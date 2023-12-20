import { signIn } from "@acme/auth";

export function SignInForm() {
  return (
    <form
      className="grid gap-2"
      action={async () => {
        "use server";
        await signIn("email", {
          redirect: false,
        });
      }}
    >
      <input name="email" />
    </form>
  );
}
