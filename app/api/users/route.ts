import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import { CustomError } from "@/lib/errors/CustomError";
import { connectDB } from "@/lib/db";
import { BadRequest } from "@/lib/errors/BadRequest";

export const GET = async(req: NextRequest) => {
    try {
        await connectDB();
        const users = await User.find({});
        return NextResponse.json({users});
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

