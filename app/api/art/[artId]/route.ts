import { BadRequest } from "@/lib/errors/BadRequest";
import { CustomError } from "@/lib/errors/CustomError";
import { Unauthorized } from "@/lib/errors/Unauthorized";
import Fanart from "@/lib/models/Fanart";
import { jwtVerify } from "jose";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: {params: any}) {
    try {
        const {artId} = context.params;
        const art = await Fanart.findById(artId);
        if(!art){
            throw new BadRequest('This fanart does not exist');
        }
    
        return NextResponse.json(art);
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

export async function PATCH(req: NextRequest, context: {params: any}) {
    try {
        const body = await req.json();
        const auth = req.headers.get('Authorization');
        const {artId} = context.params;
        const art = await Fanart.findById(artId);

        if(!auth){
            throw new BadRequest('User not logged in');
        }
        const token = auth.split(' ')[1];
        const {payload} = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET) || 'secret1921');
        const user_id = new mongoose.Types.ObjectId(String(payload.id));
        const createdById = art.createdBy;

        if(!user_id.equals(createdById)){
            throw new Unauthorized('You do not have permission to modify this fanart');
        }

        const updatedArt = await Fanart.findByIdAndUpdate(artId, {... body}, {new: true, runValidators: true})
        return NextResponse.json(updatedArt);
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

export async function DELETE(req: NextRequest, context: {params: any}) {
    try {
        const auth = req.headers.get('Authorization');
        const {artId} = context.params;
        const art = await Fanart.findById(artId);

        if(!auth){
            throw new BadRequest('User not logged in');
        }
        const token = auth.split(' ')[1];
        const {payload} = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET) || 'secret1921');
        const user_id = new mongoose.Types.ObjectId(String(payload.id));
        const createdById = art.createdBy;

        if(!user_id.equals(createdById)){
            throw new Unauthorized('You do not have permission to modify this fanart');
        }

        const deleteArt = await Fanart.findByIdAndDelete(artId, {new: true})
        return NextResponse.json(deleteArt);
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