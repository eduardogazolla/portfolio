import { z } from "zod";

export type ContactLocale = "pt" | "en";

export const CONTACT_LIMITS = {
  nameMin: 3,
  nameMax: 100,
  emailMax: 254,
  messageMin: 1,
  messageMax: 500,
  websiteMax: 200,
} as const;

const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;
// The message keeps \n (0x0A) and \t (0x09).
const CONTROL_CHARS_EXCEPT_NEWLINE_TAB = /[\u0000-\u0008\u000b-\u001f\u007f]/g;

type EmailProblem =
  | "empty"
  | "missingAt"
  | "missingLocal"
  | "missingDomain"
  | "missingTld"
  | "spaces"
  | "tooLong"
  | "invalid";

type Messages = {
  nameRequired: string;
  nameTooShort: string;
  nameTooLong: string;
  messageRequired: string;
  messageTooLong: string;
  email: Record<EmailProblem, string>;
};

export const contactMessages: Record<ContactLocale, Messages> = {
  pt: {
    nameRequired: "Diga seu nome para eu saber com quem falo.",
    nameTooShort: "O nome precisa ter pelo menos 3 letras. Escreva seu nome completo.",
    nameTooLong: "O nome passou de 100 caracteres. Use uma versão mais curta.",
    messageRequired: "Escreva uma mensagem. Uma frase já basta.",
    messageTooLong: "A mensagem passou de 500 caracteres. Resuma um pouco.",
    email: {
      empty: "Informe seu e-mail. Use algo como nome@gmail.com.",
      missingAt: "Falta o @. Use algo como nome@gmail.com.",
      missingLocal: "Falta o que vem antes do @. Use algo como nome@gmail.com.",
      missingDomain: "Falta o domínio. Use algo como nome@gmail.com.",
      missingTld: "Falta o final do domínio, como .com. Use algo como nome@gmail.com.",
      spaces: "O e-mail não pode ter espaços. Remova-os e tente de novo.",
      tooLong: "O e-mail passou de 254 caracteres. Confira se está certo.",
      invalid: "Esse e-mail não parece válido. Use algo como nome@gmail.com.",
    },
  },
  en: {
    nameRequired: "Tell me your name so I know who I am talking to.",
    nameTooShort: "The name needs at least 3 letters. Write your full name.",
    nameTooLong: "The name is over 100 characters. Use a shorter version.",
    messageRequired: "Write a message. One sentence is enough.",
    messageTooLong: "The message is over 500 characters. Trim it a little.",
    email: {
      empty: "Enter your email. Use something like name@gmail.com.",
      missingAt: "The @ is missing. Use something like name@gmail.com.",
      missingLocal: "Something is missing before the @. Use something like name@gmail.com.",
      missingDomain: "The domain is missing. Use something like name@gmail.com.",
      missingTld: "The domain ending is missing, such as .com. Use something like name@gmail.com.",
      spaces: "The email cannot contain spaces. Remove them and try again.",
      tooLong: "The email is over 254 characters. Check that it is correct.",
      invalid: "That email does not look valid. Use something like name@gmail.com.",
    },
  },
};

const simpleEmail = z.string().email();

// Classifies the first problem found so each message can teach one fix.
const findEmailProblem = (email: string): EmailProblem | null => {
  if (email.length === 0) return "empty";
  if (email.length > CONTACT_LIMITS.emailMax) return "tooLong";
  if (/\s/.test(email)) return "spaces";
  const at = email.indexOf("@");
  if (at === -1) return "missingAt";
  if (email.indexOf("@", at + 1) !== -1) return "invalid";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (!local) return "missingLocal";
  if (!domain) return "missingDomain";
  if (!domain.includes(".") || domain.startsWith(".") || domain.endsWith(".")) {
    return "missingTld";
  }
  return simpleEmail.safeParse(email).success ? null : "invalid";
};

/**
 * Shared by the form (client, user's locale) and the API route (server, which
 * only needs pass/fail, so it uses "pt").
 */
export const createContactSchema = (locale: ContactLocale) => {
  const m = contactMessages[locale];
  return z.object({
    name: z
      .string({ required_error: m.nameRequired, invalid_type_error: m.nameRequired })
      .transform((value) => value.replace(CONTROL_CHARS, "").trim())
      .superRefine((value, ctx) => {
        // One message per field: empty, too short or too long.
        const message =
          value.length === 0
            ? m.nameRequired
            : value.length < CONTACT_LIMITS.nameMin
              ? m.nameTooShort
              : value.length > CONTACT_LIMITS.nameMax
                ? m.nameTooLong
                : null;
        if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
      }),
    email: z
      .string({ required_error: m.email.empty, invalid_type_error: m.email.invalid })
      .transform((value) => value.replace(CONTROL_CHARS, "").trim())
      .superRefine((value, ctx) => {
        const problem = findEmailProblem(value);
        if (problem) ctx.addIssue({ code: z.ZodIssueCode.custom, message: m.email[problem] });
      }),
    message: z
      .string({ required_error: m.messageRequired, invalid_type_error: m.messageRequired })
      .transform((value) => value.replace(CONTROL_CHARS_EXCEPT_NEWLINE_TAB, "").trim())
      .pipe(
        z
          .string()
          .min(CONTACT_LIMITS.messageMin, m.messageRequired)
          .max(CONTACT_LIMITS.messageMax, m.messageTooLong)
      ),
    // Honeypot: hidden in the UI, so only bots fill it. The API drops those.
    website: z.string().max(CONTACT_LIMITS.websiteMax).default(""),
  });
};

export type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;
export type ContactFormInput = z.input<ReturnType<typeof createContactSchema>>;
