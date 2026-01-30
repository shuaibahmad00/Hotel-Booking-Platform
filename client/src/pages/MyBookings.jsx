import { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MyBookings = () => {

    const {axios, getToken, user} = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUserBookings = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const {data} = await axios.get('/api/bookings/user', {headers: {Authorization: `Bearer ${token}`}})
            if(data.success) {
                setBookings(data.bookings || [])
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user) {
            fetchUserBookings();
        } else {
            setLoading(false);
        }
    }, [user])

  if (loading) {
    return (
      <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 flex justify-center items-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
      <Title title='My Bookings' subtitle='Easily manage your past, current, and upcoming hotel reservation in one place. Plan you trips seamlessly with just one clicks.' align='left' />
      
      <div className='max-w-6xl mt-8 w-full text-gray-800'>
        {bookings.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-2xl text-gray-600 mb-4'>No bookings yet</p>
            <p className='text-gray-500 mb-6'>Start exploring and book your perfect stay!</p>
            <button 
              onClick={() => window.location.href = '/rooms'}
              className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-all'
            >
              Browse Rooms
            </button>
          </div>
        ) : (
          <>
            <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
                <div className='w-1/3'>Hotels</div>
                <div className='w-1/3'>Date & Timings</div>
                <div className='w-1/3'>Payments</div>
            </div>

            {bookings.map((booking)=>(
            <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>
                {/* Hotel Details */}
                <div className='flex flex-col md:flex-row '>
                    <img src={booking.room.images[0]} alt="hotel-img" className='min-md:w-44 rounded shadow object-cover ' />
                    <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4 '>
                        <p className='font-playfair text-2xl '> {booking.hotel.name}
                        <span className='font-inter text-sm'> ({booking.room.roomType})</span>
                        </p>
                        <div className='flex items-center gap-1 text-sm text-gray-500'>
                            <img src={assets.locationIcon} alt="location-icon" />
                            <span>{booking.hotel.address}</span>
                        </div>

                        <div className='flex items-center gap-1 text-sm text-gray-500'>
                            <img src={assets.guestsIcon} alt="guests-icon" />
                            <span>Guests: {booking.guests}</span>
                        </div>
                        <p className='text-base '>Total: ₹{booking.totalPrice}</p>
                    </div>
                </div>
                {/* Date & Timings */}
                <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                    <div>
                        <p>Check-In:</p>
                        <p className='text-gray-500 text-sm'>{new Date(booking.checkInDate).toDateString()}</p>
                    </div>
                    <div>
                        <p>Check-Out:</p>
                        <p className='text-gray-500 text-sm'>{new Date(booking.checkOutDate).toDateString()}</p>
                    </div>
                </div>
                {/* payment status  */}
                <div className='flex flex-col items-start justify-center pt-3'>
                    <div className='flex items-center gap-2'>
                        <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}>
                        </div>
                        <p className={`text-sm ${booking.isPaid ? "text-green-500" : "text-red-500"}`}>{booking.isPaid ? "Paid" : "Unpaid"}</p>
                    </div>
                    {!booking.isPaid && (
                        <button className='px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer '>Pay Now</button>
                    )}
                </div>
            </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default MyBookings
