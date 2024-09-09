import type { NextApiRequest, NextApiResponse } from 'next'
 
interface ResponseData {
    location: location | null,
    social: SocialMedia,
    phone: Phone
}

interface location {
    country: string,
    city: string,
    street: string
}

interface SocialMedia {
    email: string,
    skype: string,
    telegram: string
}

interface Phone {
    support: string | null,
    office: string,
    personal: string
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) 
{
  const response : ResponseData = {
    location:{
        city: "Jakarta",
        country: "Indonesia",
        street: "Jl. Kembang"
    },
    phone:{
        office: "021 2345",
        personal: "0812 1122 1212",
        support: null
    },
    social:{
        email: "myname@gmail.com",
        skype: "myname",
        telegram: "myname"
    }
  } 
  res.status(200).json(response)
}