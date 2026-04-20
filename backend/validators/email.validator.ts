const z = require("zod/v4").z;

const emailSchema = z.object({
    to: z.union([
        z.string().email(),
        z.array(z.string().email()).min(1),
    ]),

    templateId: z.enum(["WELCOME_EMAIL", "RESET_PASSWORD", "TICKET_CONFIRMATION"]),

    variables: z.record(z.string(), z.string()).default({}),
});

module.exports = { emailSchema };