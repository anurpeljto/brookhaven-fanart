import { NextRequest, NextResponse } from "next/server";
import { Unauthorized } from "@/lib/errors/Unauthorized";
import { CustomError } from "@/lib/errors/CustomError";
import { jwtVerify } from 'jose';

export default async function adminMiddleware(req: NextRequest) {
    try {
        const auth = req.headers.get('Authorization');
        if (!auth) {
            throw new Unauthorized('Authorization header is missing');
        }

        const authSplit = auth.split(' ');
        if (authSplit[0] !== 'Bearer' || !authSplit[1]) {
            throw new Unauthorized('Invalid authorization format');
        }

        const token = authSplit[1];

        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || 'secret1921'));
        const userEmail = payload.email;
        const response = await fetch('http://localhost:3000/api/role/', {method: 'POST', body: JSON.stringify({email: userEmail})})

        const {role} = await response.json();
        if(role !== 'admin'){
            throw new Unauthorized('You do not have permission to access this content');
        }
        return NextResponse.next();
    } catch (error: any) {
        if (error instanceof CustomError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode });
        }

        console.error('Middleware error:', error); 
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
