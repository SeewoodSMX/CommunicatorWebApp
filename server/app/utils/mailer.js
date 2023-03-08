require('dotenv').config();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
let token=""
const transporter = nodemailer.createTransport({
    host: process.env.MHOST,
    port: 587,
    auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPASS
    }
});
token = crypto.randomBytes(16).toString('hex');
let from = "admin@serwer2209635.home.pl";
let to = "nhgvrkbgudzglxmkmb@tmmcv.com";
let subject = "Reset hasła";
let html = "Link do resetu hasła :localhost:3000/tok="+token;
// send email;
async function sendEmail({ from, to, subject, html }) {

    await transporter.sendMail({ from, to, subject, html });
}
sendEmail({ from, to, subject, html })
console.log(token)
console.log(process.env.MAILUSER, process.env.MHOST)