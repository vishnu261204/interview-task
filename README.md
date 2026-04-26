# Mini CRM Application

A complete production-ready Customer Relationship Management (CRM) system built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🚀 Features

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Login/Register functionality

### Lead Management
- Create, read, update, and delete leads
- Soft delete functionality
- Pagination, search, and filtering
- Lead status tracking (New, Contacted, Lost)

### Company Management
- Company CRUD operations
- View associated leads per company
- Company details with lead lists

### Task Management
- Create tasks linked to leads
- Assign tasks to users
- Due date tracking
- Task status updates (Pending/Completed)
- Only assigned users can update tasks

### Dashboard
- Real-time statistics
- Total leads, qualified leads
- Tasks due today, completed tasks
- Recent leads and status distribution

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React 18 with Hooks
- React Router DOM for routing
- Material-UI (MUI) for components
- Axios for API calls
- React Hot Toast for notifications
- TanStack Query for data fetching

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/interview-task.git
cd interview-task
