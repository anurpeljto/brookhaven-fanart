import { connectDB } from "@/lib/db";
import { BadRequest } from "@/lib/errors/BadRequest";
import { CustomError } from "@/lib/errors/CustomError";
import Fanart from "@/lib/models/Fanart";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const art = await Fanart.find();
        return NextResponse.json(art);
    } catch (error) {
        if(error instanceof CustomError){
            return NextResponse.json(
                {error: error.message},
                {status: error.statusCode}
            )
        }

        return NextResponse.json(
            {error: 'An unexpected error ocurred, try again.'},
            {status: 500}
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const auth = req.headers.get('Authorization');

        if(!auth){
            throw new BadRequest('User not logged in');
        }
        const token = auth.split(' ')[1];
        const {payload} = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET) || 'secret1921');
        body.createdBy = payload.id;
        const art = await Fanart.create({...body});
        return NextResponse.json({art});
    } catch (error) {
        if(error instanceof CustomError){
            return NextResponse.json(
                {error: error.message},
                {status: error.statusCode}
            )
        }

        return NextResponse.json(
            {error: error},
            {status: 500}
        )
    }
}