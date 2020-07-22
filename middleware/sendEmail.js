
const creds=require("../config/email");
const nodemailer = require('nodemailer');


async function  sendEmail (from ,to,message,subject){
    const transport = {
        host: 'partobanoo.com', 
        port: 587,
        auth: {
        user: creds.USER,
        pass: creds.PASS
        }
    }

    let transporter =await nodemailer.createTransport(transport)

    transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
    });


    let mail = {
        from: from,
        to: to,  
        subject: subject ,
        text: message
    }
    
    await transporter.sendMail(mail, async(err, data) => {
        console.log("send email");
        if (err) return "ERROR";
        else return "SUCSSECFUL"+data;
    })

};

module.exports = sendEmail;
