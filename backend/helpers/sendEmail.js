const nodemailer = require("nodemailer");
const ejs = require('ejs');

let sendEmail = async ({ view, data, from, to, subject }) => {
    try {
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "00d6486c058ca5",
                pass: "5235312898201a"
            }
        });

        let dataString = await ejs.renderFile('./views/' + view + '.ejs', data);
        const info = await transport.sendMail({
            from,
            to,
            subject,
            html: dataString, // html body
        });
        console.log("Message sent: %s", info.messageId);
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = sendEmail;