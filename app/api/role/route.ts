import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const user = await User.findOne({email: body.email});
        const userRole = user.role;
        return NextResponse.json({role: userRole});
    } catch (error) {
        return error;
    }
}