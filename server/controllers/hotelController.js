import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// Get all hotels for the logged-in owner
export const getOwnerHotels = async (req, res) => {
    try {
        if (!req.user) {
            return res.json({success: false, message: "User not authenticated"})
        }
        
        const hotels = await Hotel.find({owner: req.user._id}).sort({createdAt: -1});
        res.json({success: true, hotels})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const registerHotel = async (req, res) => {
    try {
        const {name, address, contact, city} = req.body;
        
        if (!req.user) {
            return res.json({success: false, message: "User not authenticated"})
        }
        
        const owner = req.user._id

        // Check if hotel with same name already exists for this owner
        const existingHotel = await Hotel.findOne({owner, name})
        if(existingHotel) {
            return res.json({success: false, message : "You already have a hotel with this name"})
        }

        await Hotel.create({name, address, contact, city, owner});
        
        // Update user role to hotelOwner if not already
        if(req.user.role !== "hotelOwner") {
            await User.findByIdAndUpdate(owner, {role: "hotelOwner"});
        }
        
        res.json({success: true, message: "Hotel Successfully Registered"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}