import { z } from "zod";

export const RequiredString = z
  .string({
    required_error: "Cannot be empty",
    invalid_type_error: "Must be a string",
  })
  .min(1, { message: "Cannot be empty" });

export const RequiredEmail = RequiredString.email({
  message: "Invalid email address",
});

export const UserAuthSchema = z.object({
  email: RequiredEmail,
});

export type UserAuthSchemaType = z.input<typeof UserAuthSchema>;
