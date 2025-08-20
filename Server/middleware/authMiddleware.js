import { clerkClient } from "@clerk/express";

// Protect educator route

export const protectEducator = async (req, res, next) => {

    try {

        const userId = req.auth.userId
        const response = await clerkClient.users.getUser(userId)

        if (response.publicMetadata.role !== 'educator') {
            res.json({ success: false, message: 'Unauthorised Access' })
        }

        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}