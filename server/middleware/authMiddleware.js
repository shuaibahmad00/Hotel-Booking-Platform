import User from "../models/User.js";
import { clerkClient } from "../server.js";

export const protect = async (req, res, next) => {
    try {
        const {userId} = req.auth();
        
        if(!userId) {
            return res.json({success: false, message: "Not authenticated"})
        }
        
        let user = await User.findById(userId);
        
        // If user doesn't exist in database, create them (fallback for webhook issues)
        if(!user) {
            try {
                // Fetch user data from Clerk
                const clerkUser = await clerkClient.users.getUser(userId);
                
                // Create user in database
                user = await User.create({
                    _id: clerkUser.id,
                    email: clerkUser.emailAddresses[0].emailAddress,
                    username: ((clerkUser.firstName || "") + " " + (clerkUser.lastName || "")).trim() || "User",
                    image: clerkUser.imageUrl || "",
                });
                
                console.log("✓ User auto-created in database:", user._id);
            } catch (createError) {
                console.error("Failed to auto-create user:", createError.message);
                return res.json({success: false, message: "User not found in database. Please try logging in again."})
            }
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        return res.json({success: false, message: "Authentication failed"})
    }
}