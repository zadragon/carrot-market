import mail from "@sendgrid/mail";
import twilio from "twilio";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";


mail.setApiKey(process.env.SENDGRID_KEY!);

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PWD,
    },
});

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { phone, email } = req.body;
    const user = phone ? { phone: +phone } : email ? { email } : null;
    if (!user) return res.status(400).json({ ok: false });
    const payload = Math.floor(100000 + Math.random() * 900000) + "";
    const token = await client.token.create({
        data: {
            payload,
            user: {
                connectOrCreate: {
                    where: {
                        ...user,
                    },
                    create: {
                        name: "Anonymous",
                        ...user,
                    },
                },
            },
        },
    });
    if (phone) {
        const message = await twilioClient.messages.create({
            messagingServiceSid: process.env.TWILIO_MSID,
            to: process.env.MY_PHONE!,
            body: `Your login token is ${payload}.`,
        });
        console.log(message);
    }else if (email) {
        const sendEmail = await transporter.sendMail({
            from: `ABC <thurpia01@gmail.com>`,
            to: email,
            subject: 'token',
            text: `your login token is ${payload}`,
            html: `
          <div style="text-align: center;">
            <h3 style="color: #FA5882">ABC</h3>
            <br />
            <p>your login token is ${payload}</p>
          </div>
      `})
            .then((result: any) => console.log(result))
            .catch((err: any) => console.log(err))
    }

    return res.json({
        ok: true,
    });
}

export default withHandler("POST", handler);