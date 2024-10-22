import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import { CustomError } from "@/lib/errors/CustomError";
import { connectDB } from "@/lib/db";
import { BadRequest } from "@/lib/errors/BadRequest";

export const POST = async(req: NextRequest) => {
    try {
        await connectDB();
        const userInput = await req.json();
        const user = await User.findOne({email: userInput.email})
        if(!user) {
            throw new BadRequest('User does not exist');
        }

        const passwordCorrect = await user.comparePW(userInput.password, user.password);
        if(!passwordCorrect) {
            throw new BadRequest('Incorrect password and/or email');
        }

        const token = await user.createJWT();
        return NextResponse.json({success: true, user: user, token: token});
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