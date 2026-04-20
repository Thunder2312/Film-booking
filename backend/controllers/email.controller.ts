const { emailSchema } = require("../validators/email.validator");
const { sendEmail } = require("../services/email.service");

const sendEmailController = async (req: any, res: any) => {
    const parsed = emailSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            errors: parsed.error.flatten(),
        });
    }

    try {
        const result = await sendEmail(parsed.data);

        return res.json({
            success: true,
            messageId: result.messageId,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Email sending failed",
        });
    }
};

module.exports = { sendEmailController };