const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (msg) => {
    if (!msg) {
        msg = { // esempoio
            to: process.env.SENDGRID_EMAIL,
            subject: 'Sending with Twilio SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
    }
    msg['from'] = process.env.SENDGRID_EMAIL;// Questa email deve essere verificata su SendGrid
    try {
        const res = await sgMail.send(msg);
        console.log(`sent... ${msg.to}: ${msg.text} `);
    } catch (error) {
        console.log("error ",error);
    }
}

module.exports = sendMail;