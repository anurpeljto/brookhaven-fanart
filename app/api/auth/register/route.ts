import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import { CustomError } from "@/lib/errors/CustomError";
import { connectDB } from "@/lib/db";
import { BadRequest } from "@/lib/errors/BadRequest";

export const POST = async(req: NextRequest) => {
    try {
        await connectDB();
        const newUser = await req.json();
        const addedUser = await User.create(newUser);
        if(addedUser) {
            throw new BadRequest('User already exists');
        }
        return NextResponse.json({success: true, user: addedUser});
    } catch (error: any) {
        if(error instanceof CustomError){
            return NextResponse.json(
                {error: error.message},
                {status: error.statusCode}
            )
        }

        return NextResponse.json(
            {error: error.message},
            {status: 500}
        )
    }
}