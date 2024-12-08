import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const { id } = req.query;

    // Validate the `id` format
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    const objectId = new ObjectId(id); // Convert the `id` to MongoDB ObjectId

    try {
        switch (req.method) {
            case "GET":
                // Fetch a single document by its `_id`
                const work = await db.collection("work_gebby").findOne({ _id: objectId });

                if (!work) {
                    return res.status(404).json({ message: 'Data not found' });
                }

                res.status(200).json({ data: work });
                break;

            case "PUT":
                const body = req.body;

                // Ensure the body is properly parsed and has required fields
                if (
                    !body.title ||
                    !body.employmentType ||
                    !body.company ||
                    !body.location ||
                    !body.startDate ||
                    !body.endDate
                ) {
                    return res.status(400).json({ message: "Invalid or missing fields in request body" });
                }

                const updateDoc = {
                    $set: {
                        title: body.title,
                        employmentType: body.employmentType,
                        company: body.company,
                        location: body.location,
                        startDate: body.startDate,
                        endDate: body.endDate,
                    },
                };

                const result = await db
                    .collection("work_gebby")
                    .updateOne({ _id: objectId }, updateDoc, { upsert: true });

                res.status(200).json({ message: 'Data successfully updated' });
                break;

            default:
                res.status(405).json({ message: 'Method not allowed' });
                break;
        }
    } catch (err: any) {
        console.error('Error handling request:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}
