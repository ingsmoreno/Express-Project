const nodemailer = require('nodemailer');
const pug = require('pug');
const {htmlToText} = require('html-to-text');
const Transport = require("nodemailer-brevo-transport");

//IDEA = new Email(user, url).sendWelcome();

module.exports = class Email{
  constructor(user, url){
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Saray Moreno <${process.env.EMAIL_FROM}>`
  }

  newTransporter(){
    if(process.env.NODE_ENV === 'production') {
      try{
        return nodemailer.createTransport(
          new Transport({
            apiKey: `${process.env.SENDINBLUE_PASSWORD}` // RETURNING ERROR, NOT WORKING REVIEW AFTER SESSION
          }))

      }catch(err){
        console.log(err)
      }
      
      
    }

     //Create transporter 
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: { 
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  //Send the actual email
  async send(template, subject){
    // 1. Render HTML based on the pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2. Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
  }

  // 3. create transport
    await this.newTransporter().sendMail(mailOptions)
  }

  async sendWelcome(){
    await this.send('welcome', 'Welcome to the Natours Family!')
  }

  async sendResetPassword(){
    await this.send('resetPassword', 'Your password reset token (valid for 10 minutes)')
  }
}