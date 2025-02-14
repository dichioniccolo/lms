import { z } from "zod";

export const RequiredString = z
  .string({
    required_error: "Richiesto",
    invalid_type_error: "Must be a string",
  })
  .min(1, { message: "Richiesto" });

export const RequiredEmail = RequiredString.email({
  message: "Inserisci indirizzo email",
});

export const UserAuthSchema = z.object({
  email: RequiredEmail,
});

export type UserAuthSchemaType = z.input<typeof UserAuthSchema>;
