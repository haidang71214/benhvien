Clinic Management System

A web-based application for managing clinics, built with ReactJS, Node.js (Express), and MongoDB. The system helps clinics streamline operations such as patient management, appointment scheduling, and staff coordination.

🚀 Features

👨‍⚕️ Patient Management – Add, edit, view, and manage patient records.

📅 Appointment Scheduling – Book, update, and cancel patient appointments.

🏥 Doctor & Staff Management – Manage doctors, specialties, and clinic staff.

💊 Medical Records – Track treatments, prescriptions, and patient history.

📊 Dashboard – Overview of clinic activities with useful statistics.

🔐 Authentication & Authorization – Secure login with role-based access (Admin, Doctor, Staff).

🛠️ Tech Stack

Frontend: ReactJS, Axios, TailwindCSS (hoặc CSS/Bootstrap nếu bạn dùng)

Backend: Node.js, Express.js

Database: MongoDB (Mongoose ODM)

Authentication: JWT (JSON Web Token)

Other Tools: Git, Postman, VS Code

📂 Project Structure
benhvien/
│── backend/        # Express + MongoDB server
│   ├── models/     # Database models
│   ├── routes/     # API routes
│   ├── controllers/# Business logic
│   └── server.js   # App entry point
│
│── frontend/       # ReactJS app
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Main pages (Patients, Appointments, etc.)
│   │   ├── services/    # API calls with Axios
│   │   └── App.js
│
└── README.md

⚡ Installation & Setup
1️⃣ Clone repository
git clone https://github.com/haidang71214/benhvien.git
cd benhvien

2️⃣ Setup backend
cd backend
npm install
npm start

3️⃣ Setup frontend
cd frontend
npm install
npm start


The app should now be running on:

Frontend: http://localhost:3000

Backend: http://localhost:8080
