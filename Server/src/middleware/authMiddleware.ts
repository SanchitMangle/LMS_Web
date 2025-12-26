import { clerkClient } from "@clerk/express";
import { Request, Response, NextFunction } from 'express';

// Protect educator route

interface ProtectedRequest extends Request {
    auth: {
        userId: string;
    }
}

export const protectEducator = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const authReq = req as ProtectedRequest;
        const userId = authReq.auth.userId
        const response = await clerkClient.users.getUser(userId)

        if (response.publicMetadata.role !== 'educator') {
            res.json({ success: false, message: 'Unauthorised Access' })
            return;
        }

        next();

    } catch (error: any) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}