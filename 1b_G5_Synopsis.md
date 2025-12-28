# A Minor Project Synopsis Submitted to

![](images/e100ecd9a3a30d3cc82b79eacee321c47999f8aa0422397802096af09940108d.jpg)

# Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal Towards Partial Fulfillment for the Award of

# Bachelor of Technology (Computer Science and Engineering)

Under the Supervision of

Prof. Sushma Khatri

Submitted By

Arpan Patel(0827CS231048)

Bhavnamishra(0827CS231061)

Aayushi Rathore(0827CS223D01)

Arpita Hirani(0827CS231051)

![](images/04bed79033159d604a70aee937059f74cb573c9d5837e3bb1a0354a96ba405b3.jpg)

Department of Computer Science and Engineering  
Acropolis Institute of Technology & Research, Indore

July-Dec 2024

# Table of Contents

Introduction of the Project 2

Objective 2

Scope. 2

Study of Existing System 2

Existing System/Application 1: Fiverr. 2

Existing System/Application 2: Upwork 3

Existing System/Application 3: Freelancer.com. 3

Existing System/Application 4: Toptal. 4

Existing System/Application 5: Guru 4

Project Description 5

Planning of the Project work. 5

Features. 6

System architecture 6

1. Client Layer (Frontend) 6

2. Application Layer (Backend API) 7

3.Data Layer (Database) 7

4. Supporting Components 8

High-Level Flow (How It Works) 8

User Interface (UI). 8

1. Login / Registration Page 9

2. Dashboard 9

3. Project Management Pages 9

4. Messaging Interface 10

5. Profile Page 10

6. Unique Feature Interface (Example: Team Bidding) 10

7. Review & Rating Page 10

UI Flow (High Level) 11

Technology Stack. 11

Frontend (Client-Side) 11

Backend (Server-Side). 11

Database (Data Layer) 11

Authentication & Security 11

Additional Tools / Libraries. 11

Development & Deployment. 12

Testing Plan. 12

Expected Outcome 12

Resources and Limitations 12

Conclusion 12

References. 13

# Introduction of the Project

The project "Freelancing Platform" is about building an online space where clients and freelancers can easily find and work with each other. Clients will be able to post their project requirements, while freelancers can showcase their skills and apply for suitable work. The idea is to solve common problems in freelancing such as delayed payments, lack of trust, and poor communication. To tackle these issues, the platform will include features like secure payments, a rating/review system, and real-time messaging. In short, it's about making freelancing simpler, safer, and more reliable for everyone involved.

# Objective

The main goal of the Freelancing Platform is to create a digital marketplace where freelancers and clients can connect without unnecessary hurdles. We want to make the hiring and project management process smooth by including features like easy sign-up, project posting, bidding/applying for tasks, and safe payments. Another important objective is to build trust by adding a feedback and rating system, so users feel confident about who they are working with. Overall, the platform aims to open more work opportunities, encourage skill-based hiring, and provide a reliable place for remote collaboration.

# Scope

The Freelancing Platform will mainly focus on two groups—clients looking for talent and freelancers offering their services. The platform will allow users to create profiles, post or apply for projects, communicate through messages, and complete payments securely. It will be designed to handle multiple users and projects at the same time, ensuring smooth performance. For now, the project will cover the basic and most useful features. Advanced features like AI-based job suggestions, dispute resolution, or a mobile app are not part of the current scope but can be added later as upgrades.

# Study of Existing System

# Existing System/Application 1: Fiverr

1. **Problems Addressed:** Fiverr was designed to make freelancing simple by removing the complicated bidding process. Instead of clients posting projects, freelancers list their services as "gigs," making it easy for buyers to directly purchase services like graphic design, writing, or video editing.  
2. Advantages: The platform is beginner-friendly and allows freelancers to quickly showcase their skills without waiting for clients to invite them. The predefined service packages make it fast and convenient for clients to hire freelancers without negotiations. Fiverr also offers payment protection through an escrow system.  
3. Disadvantages: Fiverr charges high commission fees (up to  $20\%$ ), which reduces freelancers' earnings. Since the platform mainly promotes low-cost gigs, the quality of work can sometimes be inconsistent. Long-term or large-scale project management is not well supported.  
4. Gaps Identified: Lack of advanced collaboration tools and weak support for complex, ongoing projects.  
5. Reference link: https://www.fiverr.com

# Existing System/Application 2: Upwork

1. **Problems Addressed:** Upwork focuses on connecting clients and freelancers for both short-term and long-term projects. It provides a structured job posting and bidding system that works well for professional engagements.  
2. Advantages: A large user base gives clients many options and freelancers multiple opportunities. Features like time tracking, milestone-based payments, and dispute resolution make the platform secure and reliable. It supports both fixed-price and hourly contracts, offering flexibility.  
3. Disadvantages: The platform is highly competitive, and beginners often find it difficult to win projects. The proposal system can be time-consuming, and Upwork's service charges are significant, reducing freelancer income.  
4. Gaps Identified: While Upwork is strong for larger projects, it lacks simplicity for small, quick gigs. Beginners face difficulty establishing themselves.  
5. Reference link: https://www.upwork.com

# Existing System/Application 3: Freelancer.com

1. **Problems Addressed:** Freelancer.com provides a global platform for clients to post projects across multiple categories. It also allows clients to run contests, where freelancers compete with their work submissions.  
2. Advantages: Wide range of job categories, flexibility in project types, and milestone-based payments help maintain some level of security. Contest-based hiring gives clients more creative options and freelancers a way to showcase their talent directly.  
3. Disadvantages: Projects often receive too many bids, leading to underpricing and poor quality standards. Clients may find it overwhelming to filter and select the right freelancer from so many options. The platform also charges multiple fees (for bidding, membership, and transactions), which can be discouraging.  
4. Gaps Identified: Weak quality control system for freelancers, making it harder for clients to ensure reliability.  
5. Reference link: https://www.freelancer.com

# Existing System/Application 4: Toptal

1. **Problems addressed:** Toptal aims to solve the problem of trust and quality by allowing only the top  $3\%$  of freelancers after strict screening tests. It is designed for premium clients who need highly skilled developers, designers, or finance experts.  
2. Advantages: Ensures high-quality work by connecting clients with carefully vetted professionals. Clients benefit from reliable, long-term project results. The strict screening builds trust and reduces risks of poor-quality work.  
3. Disadvantages: The platform is very expensive, making it suitable only for high-budget clients. Average freelancers cannot join easily due to the tough selection process, and clients looking for affordable services may find it inaccessible.  
4. Gaps Identified: Not beginner-friendly, limited to a niche market, and lacks diversity in opportunities for new freelancers.  
5. Reference link: https://www.toptal.com

# Existing System/Application 5: Guru

1. **Problems Addressed:** Guru provides freelancing opportunities across multiple domains like IT, design, writing, and administration. It allows flexible agreements between clients and freelancers.

2. Advantages: It features a "Workroom" that supports collaboration and communication, making project discussions easier. The SafePay system ensures secure transactions. Guru also allows multiple payment methods, which adds convenience.  
3. Disadvantages: Compared to competitors, Guru has a smaller client base, limiting opportunities for freelancers. Its interface feels outdated and less interactive. The platform also does not attract as many large-scale projects.  
4. Gaps Identified: Lack of modern features like AI-based project recommendations, real-time analytics, and mobile-optimized experience.  
5. Reference link: https://www.guru.com

# Project Description

The provided project description breaks down into the following key components:

1. **Project Concept:** The core idea is to create a platform that bridges the gap between freelancers and short-term job opportunities in India. It aims to function similarly to platforms like Upwork, providing a central hub for gig work.  
2. Requirements: These are the specific features and functionalities the platform must have. They include:

1. A Freelance Job Marketplace for posting and finding jobs.  
2. Freelancer Profile and Portfolio Management with a rating and review system.  
3. Extensive Search & Analytics, including AI-driven insights and recommendation systems.  
4. An Escrow Account Creation feature with secure payment gateways to manage transactions.

3. Expected Outcome: The desired result is a platform that empowers freelancers by providing them with more job opportunities and efficient project management tools, ultimately increasing their income and job satisfaction.

# Project Posting & Freelancer Selection

1. User Interaction: An employer visits the website and can either register/log in or browse existing freelancer profiles as a guest.

2. Data Retrieval: The system fetches freelancer profiles, portfolios, and past project data from the database to display on the marketplace and search pages.  
3. **Project Creation:** When an employer decides to hire, they create a new project post. The system captures project details, including the title, description, required skills, and budget.  
4. Freelancer Matching: The system uses its extensive search and AI-powered recommendation engine to match the project's requirements with suitable freelancer profiles. It presents a list of candidates to the employer.  
5. Hiring Process: The employer selects a freelancer, and the system facilitates communication and a formal agreement. An escrow account is created to hold the agreed-upon payment.  
6. Confirmation & Job Fulfillment: Upon agreement, the system sends a project confirmation notification to both the employer and the selected freelancer. The freelancer can now begin work on the project, and the employer can monitor its progress.

# Planning of the Project work

Our project will follow an agile, iterative approach to development, which allows for flexibility and continuous improvement. We will break down the project into several manageable sprints, with each sprint focusing on a specific set of features. This approach ensures that we can quickly adapt to feedback and deliver a functional product incrementally. The implementation will be divided into the following key phases:

1. Requirement Analysis & Design: Defining the core functionalities, creating wireframes, and designing the database schema.  
2. Front-end Development: Building the user interface, implementing the shopping cart, and ensuring a responsive design.  
3. Back-end Development: Developing the server-side logic, API endpoints, and database interactions.  
4. Integration & Testing: Connecting the front-end and back-end components, followed by rigorous testing (unit, integration, and user acceptance testing) to identify and fix bugs.

5. Deployment & Maintenance: Deploying the platform to a production environment and setting up monitoring and maintenance procedures.

![](images/a7c0755161d281dbc1dca811c659f30a7a44b90731e8790f2ec65930253fdc47.jpg)

# Features

# User Authentication & Profiles

1. Basic signup/login (email/OTP or just username-password)  
2. Separate roles: Freelancer / Client  
3. Profile with name, skills, and a short bio

# Project Posting & Bidding

1. Clients can post projects with title, description, and budget  
2. Freelancers can submit bids/proposals

# Search & Filter

1. Simple search bar to find freelancers or projects by keyword  
2. One or two filters (e.g., budget range, skill tags)

# Communication System

1. Basic in-app messaging between freelancer and client (even simple text chat is enough)

# Review & Rating System

1. After completion, client can rate freelancer  
2. Ratings appear on freelancer profiles

# System architecture

# 1. Client Layer (Frontend)

1. Technology: React.js  
2. Responsibility: Provides the user interface for freelancers and clients. Users can sign up, log in, post projects, bid on projects, send/receive messages, and view dashboards.  
3. Key Components:

3.1. Authentication forms  
3.2. Project posting/bidding forms  
3.3. Messaging interface  
3.4. Profile & rating display  
3.5. Dashboard (My Projects / My Bids)

# 2. Application Layer (Backend API)

1. Technology: Node.js with Express.js  
2. Responsibility: Acts as the middleware between frontend and database. It handles business logic, API endpoints, and communication between client and server.  
3. Key Modules:

3.1. Authentication Module: User registration, login, and JWT-based session management.  
3.2. Project Management Module: Create, update, and manage projects and bids.  
3.3. Messaging Module: Stores and retrieves chat messages between clients and freelancers.

3.4. Review & Rating Module: Collects and displays feedback after project completion.  
3.5. Unique Feature Module: (e.g., Team Bidding with Revenue Split) – creates team entities, defines revenue splits, and links them with projects.

# 3. Data Layer (Database)

1. Technology: MongoDB (NoSQL database)  
2. Responsibility: Stores persistent data in collections.  
3. Key Collections:

3.1. Users: Profile info, roles, authentication data.  
3.2. **Projects:** Project details, status, associated client/freelancers.  
3.3. Bids: Proposals submitted by freelancers.  
3.4. Messages: Chat history.  
3.5. Reviews: Ratings and comments.  
3.6. Teams (for unique feature): Team members and revenue split contracts.

# 4. Supporting Components

1. Authentication & Security: JSON Web Tokens (JWT) for secure session handling, bencrypt for password hashing.  
2. File Storage (Optional): For profile pictures or project-related files (can use local storage during demo).  
3. Notification System: In-app notifications and email triggers using Node mailer.

# High-Level Flow (How It Works)

1. A client logs in and posts a project.  
2. Freelancers browse/search and submit bids (individually or as a team).  
3. The backend API validates bids and stores them in MongoDB.

4. The client hires a freelancer (or a team). Revenue split rules are recorded.  
5. Communication happens via in-app chat.  
6. Upon completion, the client closes the project and submits a rating.

# User Interface (UI)

The system will have a desktop-first web interface built using React.js, designed to be clean, intuitive, and role-based (Freelancer vs Client).

# 1. Login / Registration Page

1. Fields for email/username, password, role selection (Client/Freelancer).  
2. Simple navigation to "Forgot Password."  
3. Minimal design with form validation.

# 2. Dashboard

1. Client Dashboard:

1.1. "Post New Project" button.  
1.2. List of "My Projects" with status (Open, In Progress, Completed).  
1.3. Notifications for new bids/messages.

2. Freelancer Dashboard:

2.1. "Browse Projects" search bar + filters.  
2.2. List of bids submitted and their status.  
2.3. Earnings overview (basic).

# 3. Project Management Pages

1. Post Project (Client):

1.1. Form with project title, description, budget, timeline.  
1.2. Optional tags for skills.

2. Browse Projects (Freelancer):

2.1. Search and filter panel (by budget, skill).  
2.2. Project cards with "Bid Now" button.

3. Submit Bid Form (Freelancer):

3.1. Proposed budget, timeline, and short proposal message.

# 4. Messaging Interface

1. Simple chat window between freelancer and client.  
2. Supports text messages and file upload (basic).  
3. Notifications for unread messages.

# 5. Profile Page

1. Displays user's name, skills, bio, and ratings.  
2. Option to edit/update profile details.  
3. For freelancers: Portfolio section (optional).

# 6. Unique Feature Interface (Example: Team Bidding)

1. Create Team Page: Freelancer can create a team by inviting other users, assigning revenue split percentages.  
2. Team Proposal Form: When bidding on a project, freelancers can select a team and the system will auto-attach revenue split details.  
3. Client View: Client sees proposals from individual freelancers and teams, with details of members and splits.

# 7. Review & Rating Page

1. After completion, the client is prompted to rate the freelancer/team.  
2. Star-rating system (1-5) + short feedback text.  
3. Reviews appear on freelancer's profiles.

# UI Flow (High Level)

1. User logs in  $\rightarrow$  Dashboard.  
2. Client posts project  $\rightarrow$  Freelancers browse and bid.  
3. Client reviews bids  $\rightarrow$  Hires freelancer/team.  
4. Chat for coordination  $\rightarrow$  Work done  
5. Client closes project  $\rightarrow$  Leaves rating.

# Technology Stack

# Frontend (Client-Side)

1. React.js - Component-based UI framework  
2. HTML5, CSS3, JavaScript (ES6+) - Structure, styling, and interactivity  
3. Bootstrap / Tailwind CSS - For responsive and modern UI design

# Backend (Server-Side)

1. Node.js - Server runtime environment  
2. Express.js – Backend framework for routing and APIs

# Database (Data Layer)

1. MongoDB - NoSQL database for storing users, projects, bids, messages, and ratings

# Authentication & Security

1. JWT (JSON Web Tokens) - Secure authentication  
2. bcrypt.js - Password hashing

# Additional Tools / Libraries

1. MongoDB - ODM for MongoDB  
2. Socket.io (optional) - Real-time messaging (for chat system)  
3. Nodemailer - For email notifications (optional, can be kept simple)

# Development & Deployment

1. Git & GitHub - Version control  
2. VS Code - IDE for development  
3. Postman - API testing

# Testing Plan

To ensure the functionality, reliability, and security of the Freelancing Platform, a structured testing approach will be followed. Testing will be carried out at multiple stages to identify and fix errors before deployment.

1. Unit Testing: Each module (e.g., login, project posting, bidding, payment) will be tested individually to confirm that it works as expected.  
2. Integration Testing: Once modules are combined, the data flow between them will be checked (e.g., client posts a project  $\rightarrow$  freelancer applies  $\rightarrow$  client hires  $\rightarrow$  payment processed).  
3. System Testing: The entire platform will be tested as a whole to ensure all functionalities perform correctly across browsers and devices.  
4. User Acceptance Testing (UAT): A group of users (clients & freelancers) will test the system in real-world scenarios to check usability, reliability, and overall satisfaction.  
5. Security Testing: Focus on safe transactions, authentication, and data protection to ensure there are no vulnerabilities.

# Test Cases: -

TC-01:User Registration

Scenario: Verify user can register with valid details

Expected Output: User account created successfully & redirected to login

Actual Output: User account created successfully & redirected to login

Status: Pass

TC-02:User Login (Valid Credentials)

Expected Output: User redirected to Dashboard

Actual Output: User redirected to Dashboard

Status: Pass

TC-03:User Login (Invalid Credentials)

Expected Output: Error message "Invalid Credentials" displayed

Actual Output: Error message “Invalid Credentials” displayed

Status: Pass

TC-04: Job Posting by Client

Expected Output: Job listed in project board

Actual Output: Job listed in project board

Status: Pass

TC-05: Freelancer Bidding on Job

Expected Output: Proposal submitted successfully

Actual Output: Proposal submitted successfully

Status: Pass

TC-06: Payment Processing

Expected Output: Payment processed & transaction recorded

Actual Output: Payment failed on first attempt, success on retry

Status:  $\triangle$  Partial

TC-07: Messaging System

Expected Output: Messages delivered instantly

Actual Output: Messages delivered but with 2-3 sec delay

Status:  $\triangle$  Partial

TC-08: Profile Management

Expected Output: Profile updated successfully

Actual Output: Profile updated successfully

Status: Pass

TC-09: Admin Dashboard (User Management)

Expected Output: Selected user blocked/deleted successfully

Actual Output: Selected user blocked/deleted successfully

Status: Pass

# Expected Outcome

The proposed freelancing platform is expected to deliver a secure, scalable, and user-friendly system that bridges the gap between clients and freelancers. Unlike existing platforms, it will introduce innovative features such as AI-driven project matching and blockchain-based smart contracts for transparent, trust-free payments. Users will experience a seamless onboarding process, efficient collaboration tools, and real-time communication channels to improve project outcomes. For clients, the platform will ensure access to verified freelancers with skill-based recommendations, while freelancers will benefit from fair, reliable payments and enhanced visibility of their work. Overall, the system aims to set a benchmark in freelancing marketplaces by providing trust, transparency, efficiency, and inclusivity, potentially leading to research recognition, patents, and real-world adoption.

# Resources and Limitations

The project requires both hardware and software resources for effective implementation. Hardware resources include a standard development machine with at least 8GB RAM and stable internet connectivity. Software resources involve MERN stack technologies: MongoDB for database, Express.js and Node.js for backend, React.js for frontend, and version control via GitHub. Additional tools like VS Code, Postman, and Figma will support development and UI/UX design. The project is limited to a desktop-only platform with restricted real-time features compared to existing large-scale freelancing websites. Scalability, heavy traffic handling, and enterprise-level security will not be fully achievable within the scope of this academic project.

# Conclusion

The proposed freelancing platform aims to provide a streamlined, user-friendly environment that effectively connects clients and freelancers, addressing the common challenges of trust, communication, and project management found in existing platforms. By integrating essential features such as project posting, bidding, messaging, and review systems, alongside a unique feature like team bidding with revenue split or a research/IP licensing marketplace, the system not only facilitates efficient collaboration but also introduces innovation suitable for academic recognition. Built on the MERN stack, the platform demonstrates modern web development practices, emphasizing scalability, modularity, and maintainability within the scope of a minor project. While certain enterprise-level functionalities like large-scale traffic handling and advanced security are beyond this implementation, the platform successfully provides a functional prototype that showcases key concepts. Overall, this project highlights practical problem-solving, technical proficiency, and a foundation for potential real-world adaptation or further research.

# References

# Websites:

[1] https://en.wikipedia.org/wiki/Freelancer  
[2] https://www.upwork.com/resources/highest-paying-freelance-jobs  
[3] https://www.businessnewsdaily.com/5242-freelancer-tips.html  
[4] https://www.freelancer.com/?gclid=Cj0KCQiArsefBhCbARIsAP98hXRJW9rzr09DGW 8c-Mni-VC977_D1iYuMI6PiJ177qchx1jtLvy99dEaAgFNEALw_wcB&ft_prog=ABL&f t_prog_id=541270752439  
[5] https://www.investopedia.com/terms/f/freelancer.asp  
[6] https://www.doi.org/10.56726/IRJMETS68457

# Research paper:

[7] Borchert, K., & Ramesh, R. (2020). Overcoming Geographic Boundaries in Freelance Platforms. Journal of Global Information Management, 28(3), 35-52. DOI: 10.4018/JGIM.20200701.oa04.  
[8] Alvarez De La Vega, V., Hong, G., & Pavlou, P. (2021). Enhancing Freelancing Platforms with AI-Driven Skill Matching. Journal of Artificial Intelligence Research, 45(1), 389-412. DOI: 10.1613/jair.4400.
