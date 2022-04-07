import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";

async function handler(req: NextApiRequest,res: NextApiResponse) {
    const {phone, email} = req.body;
    if(email){
        const user = await client.user.findUnizque({
            where:{
                email,
            }
        });
        if(!user){
            await client.user.create({

            })
        }
    }

    res.status(200).end()
}

export default withHandler("POST",handler)
