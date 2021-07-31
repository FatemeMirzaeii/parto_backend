
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
       
        return new Promise((resolve, reject) => {

        let mailOptions = {
            from: from,
            to: to,
            subject: subject,
            text: message
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("error is " + error);
                resolve(500); // or use rejcet(false) but then you will have to handle errors
            }
            else {
                console.log('Email sent: ' + info.response);
                resolve(200);
            }
        });
    })
};

module.exports = sendEmail;
