import twilio from "twilio";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";

import nodemailer from "nodemailer";
import mgTransport from "nodemailer-mailgun-transport";

// 이메일을 보내는 논리적인 동작을 구현했습니다.
const sendMail = (email:any) => {
    const options = {
        auth: {
            api_key: process.env.MAILGUN_API,
            domain: process.env.MAILGUN_DOMAIN,
        },
    };
    const clientt = nodemailer.createTransport(mgTransport(options));
    return clientt
        .sendMail(email)
        .then(() => {
            console.log("Message sent!");
        })
        .catch((error) => {
            console.log(error);
        });
};

// 메일에 대한 내용을 다룹니다. sendMail을 통해 메일을 보냅니다.
const sendSecretMail = (address:string, secret:string) => {
    const email = {
        from: "test@edupopkorn.com",
        to: address,
        subject: "Login Secret for Prismagram 🚀",
        html: `<h1>hello! your login secret is ${secret}.</h1>
        <h2>Copy paste on the web/app to Login</h2>`,
    };
    console.log(email)
    return sendMail(email);
};

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
        const email = await sendSecretMail("yongs7786@gmail.com","test words")
            .then((result: any) => console.log(result))
            .catch((err: any) => console.log(err))
    }

    return res.json({
        ok: true,
    });
}

export default withHandler("POST", handler);
