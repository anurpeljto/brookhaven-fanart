import { NextRequest, NextResponse } from "next/server";
import authMiddleware from "./middlewares/authMiddleware";
import adminMiddleware from "./middlewares/adminMiddleware";

export function middleware(req: NextRequest) {
    const url = req.nextUrl.pathname;
    if(url.startsWith('/api/art/')) {
        const auth = authMiddleware(req);
        if(auth) {
            return auth;
        }
    }
    if(url.startsWith('/api/users')) {
        const adminAuth = adminMiddleware(req);
        if(adminAuth) {
            return adminAuth;
        }
    }
    return NextResponse.next();
}