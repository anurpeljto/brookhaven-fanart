import { BadRequest } from "@/lib/errors/BadRequest";
import { CustomError } from "@/lib/errors/CustomError";
import User from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest, context: {params: any}) {
    const {userId} = context.params;
    const user = await User.findById(userId);
    if(!user) {
        throw new BadRequest('User does not exist');
    } 

    return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, context: {params: any}) {
    try {
        const {userId} = context.params;
        const body = await req.json();
        const updatedUser = await User.findOneAndUpdate({_id: userId}, {...body}, {new: true, runValidators: true});
        if(!updatedUser){
            throw new BadRequest('User not found');
        }
    
        return NextResponse.json(updatedUser);
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

export async function DELETE(req: NextRequest, context: {params: any}){
    try {
        const {userId} = context.params;
        const user = await User.findOneAndDelete({_id: userId});
        if(!user){
            throw new BadRequest('User not found');
        }
        return NextResponse.json({user: user});
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