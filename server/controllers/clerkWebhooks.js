import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        // Check if webhook secret is configured
        if (!process.env.CLERK_WEBHOOK_SECRET) {
            console.error("CLERK_WEBHOOK_SECRET is not configured");
            return res.status(500).json({success: false, message: "Webhook secret not configured"})
        }

        //create a svix instance with clerk webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        
        //Getting headers
        const headers = {
            "svix-id" : req.headers["svix-id"],
            "svix-timestamp" : req.headers["svix-timestamp"],
            "svix-signature" : req.headers["svix-signature"],
        };

        // Get the raw body as string
        const payload = req.body.toString();

        //Verifying headers
        let evt;
        try {
            evt = whook.verify(payload, headers);
        } catch (err) {
            console.error("Webhook verification failed:", err.message);
            return res.status(400).json({success: false, message: "Webhook verification failed"})
        }

        //Getting data from verified event
        const {data, type} = evt;

        console.log("Webhook event received:", type);

        //Switch case for different events
        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    username: ((data.first_name || "") + " " + (data.last_name || "")).trim() || "User",
                    image: data.image_url || "",
                }
                await User.create(userData);
                console.log("✓ User created in database:", userData._id);
                break;
            }
            case "user.updated": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    username: ((data.first_name || "") + " " + (data.last_name || "")).trim() || "User",
                    image: data.image_url || "",
                }
                await User.findByIdAndUpdate(data.id, userData);
                console.log("✓ User updated in database:", userData._id);
                break;
            }
            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                console.log("✓ User deleted from database:", data.id);
                break;
            }
                    
            default:
                console.log("Unhandled webhook event:", type);
                break;
        }
        res.status(200).json({success: true, message: "Webhook Received"})

    } catch (error) {
        console.error("Webhook error:", error.message);
        res.status(500).json({success: false, message: error.message})
    }
}

export default clerkWebhooks;