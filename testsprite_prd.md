# FreelanceHub - Product Requirements Document

## Project Overview
FreelanceHub is a full-stack freelancing platform that connects freelancers with clients for project-based work.

## Application Type
- **Frontend**: React + Vite web application
- **Backend**: Node.js + Express REST API
- **Database**: MongoDB

## Application URLs
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## Core Features to Test

### 1. Authentication & Authorization
- User registration (Freelancer and Client roles)
- User login with JWT authentication
- Google OAuth login
- Profile management
- Role-based access control
- Session management

### 2. Job Management (Client Features)
- Post new job listings with:
  - Title, description
  - Budget and payment terms
  - Required skills
  - Project timeline
- Edit existing job posts
- Delete job posts
- View all posted jobs
- View job details
- Search and filter jobs

### 3. Proposal System (Freelancer Features)
- Browse available jobs
- Submit proposals with:
  - Custom pricing/bid
  - Proposed timeline
  - Cover letter
- View submitted proposals
- Track proposal status (pending, accepted, rejected)

### 4. Contract Management
- View active contracts
- Track milestones
- Submit deliverables
- Monitor contract progress
- Complete contracts
- Cancel contracts

### 5. Real-time Messaging
- Send messages between clients and freelancers
- View conversation history
- Real-time message delivery (Socket.io)
- Mark messages as read
- View all conversations

### 6. Reviews & Ratings
- Submit reviews after contract completion
- 5-star rating system
- View user reviews
- Display average ratings

### 7. Notifications
- Real-time notifications for:
  - New proposals
  - Proposal acceptance/rejection
  - New messages
  - Contract updates
  - Payment updates
- Mark notifications as read
- Mark all notifications as read

### 8. Dashboard
- Personalized dashboard for clients showing:
  - Posted jobs
  - Active contracts
  - Pending proposals
- Personalized dashboard for freelancers showing:
  - Available jobs
  - Submitted proposals
  - Active contracts

## User Flows to Test

### Client User Flow
1. Register as a client
2. Login to account
3. Post a new job
4. View received proposals
5. Accept a proposal (creates contract)
6. Communicate with freelancer via messaging
7. Review deliverables
8. Complete contract
9. Leave review for freelancer

### Freelancer User Flow
1. Register as a freelancer
2. Login to account
3. Browse available jobs
4. Filter/search jobs by skills or budget
5. Submit proposal on a job
6. Receive acceptance notification
7. Work on contract
8. Submit deliverables
9. Receive payment confirmation
10. Leave review for client

## API Endpoints to Test

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- PUT /api/auth/profile
- GET /api/auth/google
- GET /api/auth/google/callback

### Jobs
- GET /api/jobs (with query filters)
- GET /api/jobs/:id
- POST /api/jobs
- PUT /api/jobs/:id
- DELETE /api/jobs/:id

### Proposals
- POST /api/proposals
- GET /api/proposals/job/:jobId
- GET /api/proposals/my-proposals
- PUT /api/proposals/:id/accept
- PUT /api/proposals/:id/reject

### Contracts
- GET /api/contracts
- GET /api/contracts/:id
- POST /api/contracts/:id/milestones
- POST /api/contracts/:id/deliverables
- PUT /api/contracts/:id/complete
- PUT /api/contracts/:id/cancel

### Messages
- POST /api/messages
- GET /api/messages/conversations
- GET /api/messages/:userId
- PUT /api/messages/:userId/read

### Reviews
- POST /api/reviews
- GET /api/reviews/user/:userId

### Notifications
- GET /api/notifications
- PUT /api/notifications/:id/read
- PUT /api/notifications/read-all

## Test Scenarios

### Critical Paths
1. **Complete Job Posting Flow**: Client posts job → Freelancer submits proposal → Client accepts → Contract created
2. **Authentication Flow**: Register → Login → Access protected resources
3. **Messaging Flow**: Send message → Receive message → Mark as read
4. **Contract Completion Flow**: Active contract → Submit deliverable → Complete contract → Leave review

### Edge Cases
1. Unauthorized access attempts
2. Invalid input validation
3. Duplicate submissions
4. Concurrent operations
5. Network failures and retries
6. Empty states (no jobs, no proposals, etc.)

### Security Tests
1. JWT token validation
2. Role-based access control
3. Protected route access
4. Input sanitization
5. CORS configuration

### Performance Tests
1. Load multiple jobs
2. Handle multiple concurrent users
3. Real-time message delivery latency
4. Database query optimization

## Expected Behaviors

### Success Cases
- Successful registration returns user data and JWT token
- Successful login redirects to appropriate dashboard
- Job posting creates new job in database
- Proposal submission notifies client
- Contract creation links job, client, and freelancer
- Messages deliver in real-time
- Reviews update user ratings

### Error Handling
- Invalid credentials show error message
- Unauthorized access returns 401
- Missing required fields return validation errors
- Duplicate email registration prevented
- Non-existent resources return 404

## Test Data Requirements

### Test Users
- **Client Account**:
  - Email: testclient@example.com
  - Password: TestClient123!
  - Role: client

- **Freelancer Account**:
  - Email: testfreelancer@example.com
  - Password: TestFreelancer123!
  - Role: freelancer

### Test Jobs
- Web development project ($500-$1000)
- Mobile app design ($1000-$2000)
- Content writing ($100-$500)

### Test Skills
- JavaScript, React, Node.js
- UI/UX Design, Figma
- Content Writing, SEO

## Technical Requirements

### Frontend Testing
- Component rendering
- Form validation
- Navigation and routing
- State management
- API integration
- Real-time updates
- Responsive design

### Backend Testing
- API endpoint functionality
- Request validation
- Authentication middleware
- Database operations
- Error handling
- Socket.io connections

## Success Criteria
- All critical user flows complete successfully
- API endpoints return correct status codes and data
- Authentication and authorization work correctly
- Real-time features function properly
- Error handling provides meaningful feedback
- No security vulnerabilities detected
- Performance meets acceptable standards
