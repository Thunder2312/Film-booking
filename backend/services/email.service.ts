const transporter = require("../config/mailer");
const { EmailTemplates } = require("../templates/email.templates");
const { compileTemplate } = require("../utils/template.engine");

const sendEmail = async (data: any) => {
    const template = EmailTemplates[data.templateId];

    const subject = compileTemplate(template.subject, data.variables);
    const html = compileTemplate(template.html, data.variables);

    return transporter.sendMail({
        from: `"FilmZ" <${process.env.EMAIL_USER}>`,
        to: data.to,
        subject,
        html,
    });
};

module.exports = { sendEmail };