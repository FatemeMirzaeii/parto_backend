
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const translate = require("../config/translate");

const creds = {
    USER: 'Zand.z@partobanoo.com', 
    PASS: '9028104264'
}

const transport = {
    host: 'partobanoo.com', // Don’t forget to replace with the SMTP host of your provider
    port: 587,
    auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

let transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/Email', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let message = req.body.message;
    let title=req.body.title;
    let content = `name: ${name} \n email: ${email}\n title: ${title} \n message: ${message} `
  
    let mail = {
      from: 'Zand.z@partobanoo.com',
      //to: 'info@partobanoo.com',  
      to:'zzand7755@gmail.com',
      subject: req.body.title ,
      text: content
    }
    console.log("send  email");
    transporter.sendMail(mail, async(err, data) => {
      if (err) return res.status(500).json({message: await translate("SERVERERROR", "fa")});
      else return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
    })
  })

module.exports = router;