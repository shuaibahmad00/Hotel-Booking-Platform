import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

//Function to check availability of room
const checkAvailability = async ({checkInDate, checkOutDate, room}) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: {$lte: checkOutDate},
            checkOutDate: {$gte: checkInDate},
        });

        const isAvailable = bookings.length === 0;
        return isAvailable;        

    } catch (error) {
        console.error(error.message);
    }
}

//API to check Availability of Room
//POST /api/booking/check-availability
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const {room, checkInDate, checkOutDate} = req.body;
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
        res.json({success: true, isAvailable})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//API to create a new booking
// POST /api/bookings/book

export const createBooking = async (req, res) => {
    try {
        const {room, checkInDate, checkOutDate, guests} = req.body;
        
        if (!req.user) {
            return res.json({success: false, message: "User not authenticated"})
        }
        
        const user = req.user._id;
        //Before boooking Check Availability
        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room,
        });

        if(!isAvailable) {
            return res.json({success: false, message: "Room is not available"})
        }

        //Get total price from room

        const roomData = await Room.findById(room).populate("hotel")
        
        if (!roomData) {
            return res.json({success: false, message: "Room not found"})
        }
        
        let totalPrice = roomData.pricePerNight;
        //calc total price based on night
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))

        totalPrice *= nights;
        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })

        // Send confirmation email
        try {
            const mailOptions = {
                from : process.env.SENDER_EMAIL,
                to: req.user.email,
                subject: 'Hotel Booking Confirmation',
                html : `
                    <h2>Your Booking Details</h2>
                    <p>Dear ${req.user.username},</p>
                    <p>Thank you for your booking! Here are your details:</p>
                    <ul>
                        <li><strong>Booking ID:</strong> ${booking._id}</li>
                        <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                        <li><strong>Room Type:</strong> ${roomData.roomType}</li>
                        <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                        <li><strong>Check-In:</strong> ${new Date(booking.checkInDate).toDateString()}</li>
                        <li><strong>Check-Out:</strong> ${new Date(booking.checkOutDate).toDateString()}</li>
                        <li><strong>Guests:</strong> ${booking.guests}</li>
                        <li><strong>Total Amount:</strong> ${process.env.CURRENCY || '₹'}${booking.totalPrice} /night</li>
                    </ul>
                    <p>We look forward to welcoming you!</p>
                    <p>If you need to make any changes, feel free to contact us.</p>
                `
            }

            await transporter.sendMail(mailOptions);
            console.log('Booking confirmation email sent to:', req.user.email);
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError.message);
            // Don't fail the booking if email fails
        }

        res.json({success: true, message: "Booking created successfully."});

    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Failed to create booking."});
    }
}

//API to get all bookings for a user
//GET /api/booking/user

export const getUserBookings = async (req, res) => {
    try {
        if (!req.user) {
            return res.json({success: false, message: "User not authenticated"})
        }
        
        const user = req.user._id;
        const bookings = await Booking.find({user}).populate("room hotel").sort({createdAt: -1})

        res.json({success: true, bookings})
    } catch (error) {
        res.json({success: false, message: "failed to fetch booking"})
    }
}

export const getHotelBookings = async (req, res) => {
    try {
        // Get all hotels owned by the user
        const hotels = await Hotel.find({owner: req.user._id})
        if(!hotels || hotels.length === 0) {
            return res.json({success: false, message: "No hotel found. Please register your hotel first."});
        }

        // Get hotel IDs
        const hotelIds = hotels.map(h => h._id)

        // Get bookings from all hotels
        const bookings = await Booking.find({hotel: {$in: hotelIds}}).populate("room hotel user").sort({createdAt: -1})

        //Total Booking
        const totalBookings = bookings.length;
        //Total Revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)

        res.json({success: true, dashboardData: {totalBookings, totalRevenue, bookings}})
    } catch (error) {
        res.json({success: false, message: "Failed to fetch bookings."})
    }
}