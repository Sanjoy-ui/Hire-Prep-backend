# HirePrep AI Server

A robust Node.js/Express backend server for InterviewIQ - an AI-powered interview preparation and assessment platform.

## Overview

HirePrep AI Server provides comprehensive API endpoints for user authentication, interview management, payment processing, and email notifications. Built with security best practices, rate limiting, and MongoDB integration.

## Features

- **User Authentication** - Secure JWT-based authentication with email verification
- **Interview Management** - Create, manage, and track interview sessions
- **Payment Processing** - Razorpay integration for seamless payment handling
- **Email Notifications** - Nodemailer integration for transactional emails
- **Security** - Helmet.js protection, CORS, rate limiting, and input validation
- **Database** - MongoDB with Mongoose ODM for data persistence
- **File Handling** - Multer for file uploads with PDF support

## Screenshots

### API Architecture
```
Client Request
     ↓
Middleware (CORS, Helmet, Rate Limiting, Auth)
     ↓
Route Handler
     ↓
Controller
     ↓
Service Layer
     ↓
MongoDB Model
     ↓
Database
```

### API Response Example

**Authentication Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Interview Response:**
```json
{
  "success": true,
  "interviews": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "JavaScript Technical Interview",
      "status": "completed",
      "score": 85,
      "createdAt": "2024-04-14T10:30:00Z"
    }
  ]
}
```

### API Documentation

The server provides RESTful endpoints with comprehensive error handling. All responses follow a consistent JSON format with status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `429` - Too Many Requests (Rate Limited)
- `500` - Internal Server Error

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.2
- **Database**: MongoDB with Mongoose 9.2
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet.js, CORS, Rate Limiting
- **Email**: Nodemailer
- **Payments**: Razorpay
- **File Processing**: Multer, PDF.js
- **HTTP Client**: Axios
- **Dev Tool**: Nodemon (hot reload)

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn
- Environment variables configured (see `.env.example`)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your configuration:
   ```env
   PORT=6000
   MONGODB_URI=mongodb://your-connection-string
   JWT_SECRET=your-jwt-secret
   RAZORPAY_KEY_ID=your-razorpay-key
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   CORS_ORIGIN=http://localhost:5173
   ```

## Getting Started

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will run on `http://localhost:6000` (or the port specified in `.env`)

### Production

```bash
node index.js
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /refresh-token` - Refresh JWT token
- `POST /logout` - User logout

### User (`/api/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `DELETE /account` - Delete user account

### Interview (`/api/interview`)
- `GET /` - List user interviews
- `POST /` - Create new interview
- `GET /:id` - Get interview details
- `PUT /:id` - Update interview
- `DELETE /:id` - Delete interview

### Payment (`/api/payment`)
- `POST /create-order` - Create Razorpay order
- `POST /verify-payment` - Verify payment
- `GET /orders` - Get payment history

### Email (`/api/v1/mail`)
- `POST /send` - Send email notification
- `POST /verify-email` - Send email verification

## Project Structure

```
server/
├── config/           # Configuration files (DB connection, etc.)
├── controllers/      # Business logic and request handlers
├── models/          # MongoDB schemas and models
├── routes/          # API route definitions
├── services/        # Utility and service functions
├── middlewares/     # Custom middleware (auth, validation, etc.)
├── public/          # Static files
├── .env             # Environment variables
├── index.js         # Application entry point
└── package.json     # Dependencies and scripts
```

## Security Features

- **Helmet.js**: Secure HTTP headers
- **CORS**: Cross-Origin Resource Sharing configured
- **Rate Limiting**: 
  - General: 100 requests per 15 minutes
  - Auth endpoints: 10 requests per 15 minutes
- **JWT**: Secure token-based authentication
- **Cookie Parser**: Secure cookie handling
- **Input Validation**: Data validation on all endpoints

## Error Handling

The server includes:
- Global error handler for unhandled exceptions
- 404 handler for undefined routes
- Proper HTTP status codes and error messages
- Logging of critical errors

## Database

MongoDB is used for data persistence. Ensure your MongoDB instance is running and the connection string is configured in `.env`.

**Collections**:
- Users
- Interviews
- Payments
- Sessions

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 6000 | Server port |
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Secret key for JWT tokens |
| `RAZORPAY_KEY_ID` | Yes | - | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | Yes | - | Razorpay API secret |
| `CORS_ORIGIN` | No | http://localhost:5173 | Frontend origin URL |
| `SMTP_HOST` | Yes | - | Email SMTP server |
| `SMTP_USER` | Yes | - | Email account username |
| `SMTP_PASS` | Yes | - | Email account password |

## Performance & Best Practices

- ✅ ES Modules for modern JavaScript
- ✅ Error boundary with global error handler
- ✅ Rate limiting for API protection
- ✅ Security headers with Helmet
- ✅ Environment variable management
- ✅ Stateless JWT authentication

## Troubleshooting

**Server won't start**
- Check MongoDB connection string
- Ensure port is not in use: `lsof -i :6000`
- Verify all environment variables are set

**Database connection errors**
- Confirm MongoDB is running
- Check MONGODB_URI in `.env`
- Verify network connectivity to MongoDB instance

**CORS errors**
- Update `CORS_ORIGIN` in `.env` to match your frontend URL
- Check credentials flag is set correctly

## License

ISC

## Author

Sanjoy Deb

## Support

For issues or questions, please open an issue in the repository.
