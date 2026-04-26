🌐 Live Demo

👉 https://interview-task-teal-two.vercel.app/login

🔑 Demo Credentials
admin@example.com || password123
john@example.com  || 12345678
jane@example.com  || 12345678
mike@example.com  || 12345678


🔐 Authorization Logic (Simple Explanation)

This application uses JWT (JSON Web Token) for authentication and authorization.

1. Login Flow
User enters email & password
Backend verifies credentials using bcrypt (hashed password comparison)
If valid, server generates a JWT token
Token is sent to the frontend
2. Token Storage
Token is stored on the client side (usually in localStorage)
It is attached to every API request in headers:
Authorization: Bearer <token>
3. Protected Routes (Backend)
Middleware checks:
Token exists
Token is valid (verified using secret key)
If valid → request proceeds
If invalid/expired → access denied
4. Role/Access Control (Basic)
Only authenticated users can:
Manage leads
Create/update tasks
View dashboard
Task-specific rule:
Only the assigned user can update that task
5. Frontend Protection
Routes are protected using React Router
If no token → redirect to login page
