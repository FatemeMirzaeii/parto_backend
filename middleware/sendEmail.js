
const creds = require("../config/email");
const nodemailer = require('nodemailer');


async function sendEmail(from, to, message, subject) {
    const transport = {
        host: 'parto.email',
        port: 587,
        auth: {
            user: creds.USER,
            pass: creds.PASS
        }
    }

    let transporter = await nodemailer.createTransport(transport)

    transporter.verify((error, success) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Server is ready to take messages');
        }
    });


    let mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: message
    }
    try {
        let info = await transporter.sendMail(mailOptions);
        return { response: info.response }
    } catch (err) {

    }

};

module.exports = sendEmail;
