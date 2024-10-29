import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from 'mongodb';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case "GET":
            try{
                if (!id || Array.isArray(id)) {
                    return res.status(400).json({ message: "Invalid ID" });
                }
                
                const work = await db.collection("work_gebby")
                    .find({_id: new ObjectId(id) }).toArray(); 

                res.status(200).json({data: work});
            }catch(err){
                res.status(422).json({ message: err.message});
            }
            break;
        default:
            res.status(404).json({message: "page not found"});
        break;
    }
}