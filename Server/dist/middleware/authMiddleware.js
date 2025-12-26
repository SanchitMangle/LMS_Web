import { clerkClient } from "@clerk/express";
export const protectEducator = async (req, res, next) => {
    try {
        const authReq = req;
        const userId = authReq.auth.userId;
        const response = await clerkClient.users.getUser(userId);
        if (response.publicMetadata.role !== 'educator') {
            res.json({ success: false, message: 'Unauthorised Access' });
            return;
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
