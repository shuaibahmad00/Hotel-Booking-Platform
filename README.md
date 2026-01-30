# Hotel Booking Platform

A full-stack hotel booking application with customer and hotel owner interfaces.
Live on: https://quickk-stayy.vercel.app/

## Features

- 🏨 Browse and search hotels by city
- 🛏️ View room details with amenities and pricing
- 📅 Book rooms with date selection
- 👤 User authentication via Clerk
- 🏢 Hotel owner dashboard
- 📊 Booking management and analytics
- 📧 Email confirmations
- 💳 Payment tracking

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS v4
- React Router DOM v7
- Clerk React (Authentication)
- Axios
- React Hot Toast

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- Clerk Express (Authentication)
- Cloudinary (Image uploads)
- Nodemailer (Email notifications)

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Clerk account
- Cloudinary account

### Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd hotel-booking
```

2. Install dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

3. Configure environment variables

**Server (.env):**
```env
MONGODB_URI=your_mongodb_uri
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SENDER_EMAIL=your_email
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
CURRENCY=₹
```

**Client (.env):**
```env
VITE_BACKEND_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CURRENCY=₹
```

4. Run the application

**Backend:**
```bash
cd server
npm run server
```

**Frontend:**
```bash
cd client
npm run dev
```

5. Open http://localhost:5173 in your browser

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed Vercel deployment instructions.

### Quick Deploy

**Backend:**
```bash
cd server
vercel --prod
```

**Frontend:**
```bash
cd client
vercel --prod
```

## Project Structure

```
hotel-booking/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── assets/        # Images, icons, SVGs
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route pages
│   │   ├── context/       # React Context
│   │   └── App.jsx
│   └── vercel.json
├── server/                # Backend Express application
│   ├── configs/          # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── server.js         # Entry point
│   └── vercel.json
└── README.md
```

## API Endpoints

### User Routes
- `GET /api/user` - Get user data
- `POST /api/user/store-recent-search` - Store recent searches

### Hotel Routes
- `POST /api/hotels` - Register hotel
- `GET /api/hotels/owner` - Get owner's hotels

### Room Routes
- `GET /api/rooms` - Get all available rooms
- `GET /api/rooms/:id` - Get room details
- `GET /api/rooms/owner` - Get owner's rooms
- `POST /api/rooms` - Create room
- `POST /api/rooms/toggle-availability` - Toggle room availability

### Booking Routes
- `POST /api/bookings/check-availability` - Check room availability
- `POST /api/bookings/book` - Create booking
- `GET /api/bookings/user` - Get user bookings
- `GET /api/bookings/hotel` - Get hotel bookings (owner)

### Webhook Routes
- `POST /api/clerk` - Clerk webhook endpoint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
