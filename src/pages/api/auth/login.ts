import type { NextApiRequest,NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import{setCookie} from 'cookies-next';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    
    switch(req.method){
        case "POST":
            try{
                const body =JSON.parse(req.body)

                if (body.email== "") {
                    throw new Error('email is requires')
                }
                if (body.password == "") {
                    throw new Error('password is required')
                }
                if (body.email == "admin@mail.com" && body.password == "123") {
                    setCookie('auth-session', 'value' , {req,res,maxAge :60 * 6 * 24});
                }else{
                    throw new Error('invalid username and password')
                }
                res.status(200).json({message: 'login berhasil'});
            }catch(err){
                res.status(422).json({message:err.message});
            }
    }
}