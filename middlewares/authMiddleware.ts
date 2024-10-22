import { NextRequest, NextResponse } from "next/server";
import { Unauthorized } from "@/lib/errors/Unauthorized";
import { CustomError } from "@/lib/errors/CustomError";
import {jwtVerify} from 'jose';
import { BadRequest } from "@/lib/errors/BadRequest";

export default async function authMiddleware(req: NextRequest) {
    try {
        const auth = req.headers.get('Authorization');
        if(!auth) {
            throw new Unauthorized('No authentication header');
        }
        const authSplit = auth.split(' ');
        const token = authSplit[1];
        
        if(!token){
            throw new Unauthorized('Missing token!');
        }

        if(authSplit[0] !== 'Bearer'){
            throw new BadRequest('Invalid auth header');
        }

        const {payload} = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET) || 'secret1921');
        if(!payload){
            throw new Unauthorized('Invalid token');
        }

        return NextResponse.next();
    } catch (error: any) {
        if(error instanceof CustomError) {
            return NextResponse.json({error: error.message}, {status: error.statusCode});
        }
        return NextResponse.json({error: error.message}, {status: 500});
    }
}