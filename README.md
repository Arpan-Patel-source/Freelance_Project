# FreelanceHub - Freelancing Platform

A full-stack freelancing platform built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### Core Features
- **Dual User Roles**: Freelancers and Clients with role-based access
- **Authentication**: JWT-based secure authentication system
- **Job Management**: Post, browse, search, and filter jobs
- **Proposal System**: Freelancers can submit proposals with custom pricing
- **Contract Management**: Track active contracts, milestones, and deliverables
- **Real-time Messaging**: Chat between clients and freelancers using Socket.io
- **Reviews & Ratings**: 5-star rating system with detailed reviews
- **Payment Tracking**: Monitor payments and transaction history
- **Notifications**: Real-time notifications for important events
- **Dashboard**: Personalized dashboards for both user types

### Technical Features
- Modern, responsive UI with TailwindCSS and shadcn/ui
- Real-time updates with Socket.io
- RESTful API architecture
- MongoDB for data persistence
- State management with Zustand
- Protected routes and authorization
- Input validation and error handling

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icons

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd "g:/Minor Project/Implementation"
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Configure Backend Environment**
- Copy `.env.example` to `.env`
- Update the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/freelance-platform
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

4. **Frontend Setup**
```bash
cd ../frontend
npm install
```

5. **Configure Frontend Environment**
- Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. **Start MongoDB** (if running locally)
```bash
mongod
```

2. **Start Backend Server**
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

3. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:5173

## Project Structure

```
freelance-platform/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & error middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── server.js        # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   │   └── ui/      # shadcn/ui components
│   │   ├── lib/         # Utilities & API config
│   │   ├── pages/       # Page components
│   │   ├── store/       # Zustand stores
│   │   ├── App.jsx      # Main app component
│   │   ├── main.jsx     # Entry point
│   │   └── index.css    # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Client only)
- `PUT /api/jobs/:id` - Update job (Client only)
- `DELETE /api/jobs/:id` - Delete job (Client only)

### Proposals
- `POST /api/proposals` - Submit proposal (Freelancer only)
- `GET /api/proposals/job/:jobId` - Get job proposals (Client only)
- `GET /api/proposals/my-proposals` - Get freelancer's proposals
- `PUT /api/proposals/:id/accept` - Accept proposal (Client only)
- `PUT /api/proposals/:id/reject` - Reject proposal (Client only)

### Contracts
- `GET /api/contracts` - Get user's contracts
- `GET /api/contracts/:id` - Get single contract
- `POST /api/contracts/:id/milestones` - Add milestone
- `POST /api/contracts/:id/deliverables` - Submit deliverable
- `PUT /api/contracts/:id/complete` - Complete contract
- `PUT /api/contracts/:id/cancel` - Cancel contract

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/:userId` - Get conversation with user
- `PUT /api/messages/:userId/read` - Mark messages as read

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/user/:userId` - Get user reviews

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## Usage Guide

### For Clients
1. Register as a Client
2. Post a job with details, budget, and requirements
3. Review proposals from freelancers
4. Accept a proposal to create a contract
5. Communicate via messaging
6. Review deliverables and complete the contract
7. Leave a review for the freelancer

### For Freelancers
1. Register as a Freelancer
2. Browse available jobs
3. Submit proposals with your bid and timeline
4. Once accepted, work on the project
5. Submit deliverables through the contract
6. Receive payment upon completion
7. Leave a review for the client

## Development

### Adding New Features
1. Create necessary models in `backend/models/`
2. Add controllers in `backend/controllers/`
3. Define routes in `backend/routes/`
4. Create frontend pages in `frontend/src/pages/`
5. Add API calls in stores or components

### Code Style
- Use ES6+ features
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Add comments for complex logic

## Deployment

### Backend Deployment (e.g., Heroku, Railway)
1. Set environment variables
2. Ensure MongoDB connection string is correct
3. Deploy using platform-specific commands

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build the frontend: `npm run build`
2. Set VITE_API_URL to production backend URL
3. Deploy the `dist` folder

## Security Considerations
- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected routes on both frontend and backend
- Input validation and sanitization
- CORS configuration
- Environment variables for sensitive data

## Future Enhancements
- Payment gateway integration (Stripe/PayPal)
- File upload for attachments
- Advanced search with Elasticsearch
- Email notifications
- Video calls integration
- Mobile app (React Native)
- Admin panel
- Dispute resolution system
- Skill tests and certifications

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
MIT License

## Support
For issues and questions, please open an issue on GitHub.

---
