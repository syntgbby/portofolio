import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../../../../lib/mongodb"
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_NAME)

    // Access the `id` directly from the URL path
    const { id } = req.query

    // Validate the `id` format
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' })
    }

    const objectId = new ObjectId(id) // Convert the `id` to MongoDB ObjectId

    switch (req.method) {
        case "PUT":
            try {
                const filter = { _id: objectId }
                const body = JSON.parse(req.body) // Get the data to update from the request body
                const updateDoc = {
                    $set: {
                        content: body.content,
                        subTitle: body.subTitle,
                        title: body.title,
                    },
                }

                // Update the blog entry in the database
                const blogs = await db.collection("com_blogs_gebby").updateOne(filter, updateDoc, { upsert: true })

                res.status(200).json({ data: [blogs], message: 'Data successfully updated' })
            } catch (err) {
                res.status(422).json({ message: err.message })
            }
            break

        case "DELETE":
            try {
                const resDelete = await db.collection("com_blogs_gebby").deleteOne({ _id: objectId })

                if (resDelete.deletedCount < 1) {
                    throw new Error('Data not found')
                }

                res.json({ data: [resDelete], message: "Data successfully deleted" })
            } catch (err) {
                res.status(422).json({ message: err.message })
            }
            break

        default:
            // Fetch the blog by ID for other HTTP methods (GET)
            const education = await db.collection("com_blogs_gebby").findOne({ _id: objectId })

            if (!education) {
                return res.status(404).json({ message: 'Blog not found' })
            }

            res.json({ data: education })
            break
    }
}
