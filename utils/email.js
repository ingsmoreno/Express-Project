const nodemailer = require('nodemailer');

const sendEmail = async options => {
    //Create transporter 
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: { 
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

    await transport.sendMail({
        from: 'Sara <sara@test.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        //html:
    })
}

module.exports = sendEmail;
