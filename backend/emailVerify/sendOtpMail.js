import nodemailer from "nodemailer"
import 'dotenv/config'

 

export const sendOTPMail = async(otp, email) => {

    console.log(email)


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });


    const mailConfigurations = {


        from: process.env.MAIL_USER,

        to: email,

        // Subject of Email
        subject: 'Password Reset Otp',

         html: `<p> Your otp for Password Reset is : <b>${otp}</b> </p> `
    };


    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error);
        console.log('Otp Sent Successfully');
        console.log(info);
    });

}









