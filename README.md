# 🚀 TeamTask Pro - Smart Team Task Manager

![TeamTask Pro](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![React](https://img.shields.io/badge/react-18.3.1-61DAFB)
![MongoDB](https://img.shields.io/badge/mongodb-atlas-brightgreen)
![License](https://img.shields.io/badge/license-MIT-orange)

A modern, full-stack team task management application with role-based access control, real-time task tracking, and an intuitive glass-morphism UI.

## ✨ Features

### 🔐 Authentication & Authorization
- **Secure JWT Authentication** - Login/Signup with encrypted passwords
- **Role-Based Access** - Admin and Member roles with different permissions
- **Protected Routes** - Middleware-secured API endpoints
- **Session Management** - Automatic token handling and expiration

### 📊 Dashboard
- **Real-time Statistics** - Total tasks, progress tracking, completion rates
- **Visual Analytics** - Progress bars, status distribution, overdue alerts
- **Quick Overview** - Recent tasks, project summaries at a glance
- **Personalized Greeting** - Time-based welcome messages

### 📁 Project Management
- **Create & Manage Projects** - Full CRUD operations for projects
- **Team Collaboration** - Add members by email, assign roles
- **Status Tracking** - Active, Completed, On-Hold project states
- **Member Management** - Admin can add/remove team members

### ✅ Task Management
- **Task Creation** - Title, description, priority, due dates
- **Assignment System** - Assign tasks to team members
- **Status Workflow** - To Do → In Progress → Completed
- **Priority Levels** - Low, Medium, High with visual indicators
- **Overdue Detection** - Automatic overdue task highlighting
- **Filter & Search** - Filter by status, priority, search by text

### 🎨 Modern UI/UX
- **Glass Morphism Design** - Frosted glass effects with blur
- **Dark Mode Support** - Automatic dark/light theme
- **Responsive Layout** - Works on mobile, tablet, desktop
- **Smooth Animations** - Micro-interactions and transitions
- **Loading States** - Beautiful loading spinners and skeletons
- **Empty States** - Helpful placeholders for new users
- **Toast Notifications** - Success/error feedback messages

## 🏗️ Architecture

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (React)                      │
│                    Port: 5173 (Vite)                     │
├─────────────────────────────────────────────────────────┤
│  Components → Pages → Context → Hooks → Utils           │
│  Glass UI ← Tailwind CSS v4 ← Custom Design System      │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/Axios
                      │ JWT Token in Headers
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    SERVER (Express)                      │
│                     Port: 5000                           │
├─────────────────────────────────────────────────────────┤
│  Routes → Controllers → Models → MongoDB                │
│  Middleware: Auth, Validation, Error Handling            │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              DATABASE (MongoDB Atlas)                    │
│         Collections: Users, Projects, Tasks              │
└─────────────────────────────────────────────────────────┘
\`\`\`

## 📦 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Library |
| Tailwind CSS | 4.0.0 | Styling Framework |
| React Router | 6.26.0 | Client-side Routing |
| Axios | 1.7.2 | HTTP Client |
| date-fns | 3.6.0 | Date Formatting |
| react-hot-toast | 2.4.1 | Notifications |
| Vite | 5.4.0 | Build Tool |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime Environment |
| Express | 4.18.2 | Web Framework |
| MongoDB | Atlas | Database |
| Mongoose | 7.6.3 | ODM Library |
| bcryptjs | 2.4.3 | Password Hashing |
| jsonwebtoken | 9.0.2 | JWT Authentication |
| express-validator | 7.0.1 | Input Validation |

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager
\`\`\`

### 2. Setup Backend
\`\`\`bash
cd server
npm install
\`\`\`

Create \`.env\` file in server directory:
\`\`\`env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/team-task-manager
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
\`\`\`

Start the backend:
\`\`\`bash
npm run dev
\`\`\`

### 3. Setup Frontend
\`\`\`bash
cd ../client
npm install
\`\`\`

Create \`.env\` file in client directory:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=TeamTask Pro
\`\`\`

Start the frontend:
\`\`\`bash
npm run dev
\`\`\`

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000

## 📁 Project Structure

\`\`\`
team-task-manager/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable Components
│   │   │   ├── Navbar.jsx           # Navigation with user menu
│   │   │   ├── PrivateRoute.jsx     # Auth route protection
│   │   │   ├── LoadingSpinner.jsx   # Loading animations
│   │   │   └── EmptyState.jsx       # Empty state placeholders
│   │   ├── pages/                   # Page Components
│   │   │   ├── Login.jsx            # User login
│   │   │   ├── Signup.jsx           # User registration
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── Projects.jsx         # Project listing
│   │   │   ├── ProjectDetails.jsx   # Project details & tasks
│   │   │   ├── Tasks.jsx            # All tasks view
│   │   │   └── NotFound.jsx         # 404 page
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication state
│   │   ├── config/
│   │   │   └── constants.js         # App configuration
│   │   ├── utils/
│   │   │   └── axios.js             # HTTP client setup
│   │   ├── App.jsx                  # Root component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── .env                         # Environment variables
│   └── package.json
│
├── server/                          # Express Backend
│   ├── config/
│   │   └── db.js                    # Database connection
│   ├── controllers/
│   │   ├── authController.js        # Auth logic
│   │   ├── projectController.js     # Project CRUD
│   │   └── taskController.js        # Task CRUD
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   └── errorHandler.js          # Error handling
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Project.js               # Project schema
│   │   └── Task.js                  # Task schema
│   ├── routes/
│   │   ├── auth.js                  # Auth endpoints
│   │   ├── projects.js              # Project endpoints
│   │   └── tasks.js                 # Task endpoints
│   ├── .env                         # Environment variables
│   ├── index.js                     # Server entry point
│   └── package.json
│
└── README.md                        # Documentation
\`\`\`

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Projects
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/projects` | Get user's projects | Private |
| POST | `/api/projects` | Create project | Private |
| GET | `/api/projects/:id` | Get project details | Private |
| PATCH | `/api/projects/:id` | Update project | Admin |
| POST | `/api/projects/:id/members` | Add member | Admin |

### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | Get user's tasks | Private |
| POST | `/api/tasks` | Create task | Private |
| PATCH | `/api/tasks/:id` | Update task | Private |
| DELETE | `/api/tasks/:id` | Delete task | Admin |
| GET | `/api/tasks/project/:id` | Get project tasks | Private |
| GET | `/api/tasks/stats/dashboard` | Dashboard stats | Private |

## 🎯 User Roles & Permissions

### Admin
- ✅ Create/Delete projects
- ✅ Add/Remove team members
- ✅ Create/Assign tasks
- ✅ Delete any task
- ✅ View all project data
- ✅ Update project settings

### Member
- ✅ View assigned projects
- ✅ View project tasks
- ✅ Update task status (own tasks)
- ✅ Create tasks in projects
- ❌ Cannot delete projects
- ❌ Cannot add/remove members

## 🎨 Design System

### Colors
- **Primary**: Indigo (#6366f1) - Main brand color
- **Success**: Emerald (#22c55e) - Completed status
- **Warning**: Amber (#f59e0b) - In progress
- **Danger**: Rose (#ef4444) - Overdue/High priority
- **Info**: Blue (#3b82f6) - Informational

### Components
- **Glass Cards** - Frosted glass effect with backdrop blur
- **Gradient Buttons** - Smooth color transitions
- **Status Badges** - Color-coded status indicators
- **Progress Bars** - Visual completion tracking
- **Avatar Circles** - Gradient user initials

## 🚢 Deployment

### Deploy to Railway

1. **Push to GitHub**
\`\`\`bash
git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

2. **Connect Railway**
   - Go to [Railway](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose your repository

3. **Configure Environment Variables**
   - Add all variables from `.env` file
   - Set `NODE_ENV=production`

4. **Update Frontend .env.production**
\`\`\`env
VITE_API_URL=https://your-app.railway.app/api
\`\`\`

5. **Deploy Frontend (Vercel/Netlify)**
   - Build: `npm run build`
   - Output: `dist`
   - Add environment variable: `VITE_API_URL`

## 🧪 Testing

### Test Users
\`\`\`
Admin: admin@demo.com / 123456
Member: member@demo.com / 123456
\`\`\`

### API Testing with cURL

**Login:**
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@demo.com","password":"123456"}'
\`\`\`

**Create Project:**
\`\`\`bash
curl -X POST http://localhost:5000/api/projects \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"name":"My Project","description":"A test project"}'
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🐛 Bug Reports

Found a bug? Please create an issue with:
- Bug description
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- React.js Community
- Tailwind CSS Team
- MongoDB Documentation
- Express.js Contributors

---

⭐ **Star this repo if you found it helpful!** ⭐

Made with ❤️ and lots of ☕
