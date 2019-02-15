import nodemailer from 'nodemailer';

export class MailService {
    static async send(to: string, subject: string, html: any) {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'huuthong.mgd@gmail.com',
                pass: 'cezuvlwxfbuvfmxw'
            }
        });

        let mailOptions = {
            from: '"Dental Tech" <dentaltech@gmail.com>',
            to,
            subject,
            html
        }
        return await transporter.sendMail(mailOptions);
    }
}