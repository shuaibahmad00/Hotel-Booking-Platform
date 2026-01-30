import Hotel from "../models/Hotel.js";
import {v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";

//API to create a new room for a hotel
export const createRoom = async (req, res) => {
    try {
        const {roomType, pricePerNight, amenities, hotelId} = req.body;
        
        // If hotelId is provided, use it; otherwise use the first hotel
        let hotel;
        if(hotelId) {
            hotel = await Hotel.findOne({_id: hotelId, owner: req.user._id})
        } else {
            hotel = await Hotel.findOne({owner: req.user._id}).sort({createdAt: 1})
        }

        if(!hotel) return res.json({success: false, message: "No Hotel Found. Please register your hotel first."});

        //upload images to cloudinary
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        })

        //wait for all uploads to complete
        const images = await Promise.all(uploadImages)
        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,
        })
        res.json({success: true, message: "Room Created Successfully"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//API to get all rooms

export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({isAvailable: true}).populate({
            path: 'hotel',
            populate:{
                path: 'owner',
                select: 'image',
            }
        }).sort({createdAt: -1});
        res.json({success: true, rooms})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//API to get all rooms for a specific hotel or all hotels owned by user
export const getOwnerRooms = async (req, res) => {
    try {
        // Get all hotels owned by the user
        const hotels = await Hotel.find({owner: req.user._id})
        
        if (!hotels || hotels.length === 0) {
            return res.json({success: false, message: "No Hotel Found. Please register your hotel first."})
        }
        
        // Get hotel IDs
        const hotelIds = hotels.map(h => h._id.toString())
        
        // Get all rooms from all hotels
        const rooms = await Room.find({hotel: {$in: hotelIds}}).populate("hotel").sort({createdAt: -1});
        res.json({success: true, rooms});
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//API to get single room details
export const getRoomDetails = async (req, res) => {
    try {
        const {id} = req.params;
        const room = await Room.findById(id).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'username image'
            }
        });
        
        if (!room) {
            return res.json({success: false, message: "Room not found"})
        }
        
        res.json({success: true, room});
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//API to toggle availability of a room hotel 
export const toggleRoomAvailability = async (req, res) => {
    try {
        const {roomId} = req.body;
        const roomData = await Room.findById(roomId)
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();

        res.json({success: true, message: "Room Availability Updated"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}