# 🌿 Academic Eco Policy Evaluation Platform

A full-stack **MERN Stack** web application for tracking, evaluating, and improving campus environmental sustainability.

---

## 📘 Project Overview

The **Academic Eco Policy Evaluation Platform** is designed for educational institutions to digitally monitor and evaluate their eco-friendly policies. It helps manage and analyze:

- Energy usage
- Water consumption
- Waste management
- Plantation activities
- Carbon footprint
- Sustainability performance scores

The platform provides **interactive dashboards**, **reports**, and **automated scoring** to support environmentally responsible campus management.

---

## ✨ Features

- 🔐 Secure Admin Login
- 🏢 Block-wise Environmental Data Entry
- ⚡ Energy Usage Monitoring
- 💧 Water Consumption Tracking
- ♻️ Waste Management Recording
- 🌱 Plantation / Tree Tracking
- 🌫️ Automatic Carbon Footprint Calculation
- 📊 Eco Sustainability Score Evaluation
- 📈 Interactive Dashboards & Charts
- 📄 PDF and CSV Report Generation
- 🗂️ Centralized Sustainability Reporting

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, HTML5, CSS3, Bootstrap, Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT (JSON Web Token), bcryptjs |
| Reports | PDFKit, CSV |
| State Management | React Context API |

---

## 📁 Project Structure

```bash
academic-eco-policy-evaluation-platform/
│
├── server/                   # Node.js + Express Backend
│   ├── models/
│   │   ├── User.js           # Admin user model
│   │   └── Environment.js    # Environmental data model
│   ├── routes/
│   │   ├── auth.js           # Login and auth routes
│   │   ├── environment.js    # CRUD for environmental data
│   │   ├── dashboard.js      # Dashboard statistics
│   │   └── reports.js        # PDF and CSV downloads
│   ├── middleware/
│   │   └── auth.js           # JWT protection middleware
│   ├── seed.js               # Seed admin and sample data
│   ├── index.js              # Express server entry
│   └── package.json
│
├── client/                   # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── components/
│   │   │   └── Layout.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AddData.js
│   │   │   └── Reports.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── package.json              # Root scripts
├── .gitignore
└── README.md
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v16+
- MongoDB installed and running locally

Default MongoDB URL:
```bash
mongodb://localhost:27017
```

---

### 1️⃣ Install Dependencies

From the root folder:

```bash
npm run install-all
```

Or manually:

```bash
cd server
npm install

cd ../client
npm install
```

---

### 2️⃣ Configure Environment

Inside the `server` folder:

```bash
cp .env.example .env
```

Then edit the `.env` file if needed:

```env
MONGO_URI=mongodb://localhost:27017/greencampus
JWT_SECRET=your_secret_key
PORT=5000
```

---

### 3️⃣ Seed Database (Admin + Sample Data)

```bash
cd server
npm run seed
```

This creates:

- **Admin Login**
  - Email: `admin@greencampus.edu`
  - Password: `admin123`

- **Sample Data**
  - 30 environmental records
  - 5 campus blocks × 6 months

---

### 4️⃣ Run Development Servers

From the root directory:

```bash
npm install
npm run dev
```

Or run separately:

```bash
npm run server
npm run client
```

---

## 🔑 Login Credentials

| Field | Value |
|-------|-------|
| Email | admin@greencampus.edu |
| Password | admin123 |

---

## 📡 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login and JWT generation |
| GET  | `/api/auth/me` | Get current logged-in user |

---

### 🌿 Environmental Data Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/environment/add` | Add new environmental record |
| GET    | `/api/environment` | Get all records |
| GET    | `/api/environment/filter?block=&year=` | Filter records |
| DELETE | `/api/environment/:id` | Delete a record |

---

### 📊 Dashboard Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get dashboard statistics and chart data |

---

### 📄 Reports Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/download?format=csv&block=&year=` | Download CSV report |
| GET | `/api/reports/download?format=pdf&block=&year=` | Download PDF report |

---

## 🏢 College Blocks

The platform supports block-wise monitoring for:

- Academic Block
- Laboratory Block
- Administrative Block
- Hostel Block
- Library Block

---

## 📊 Sustainability Score Formula

```text
Score = (EnergyScore × 35%) + (WaterScore × 30%) + (WasteScore × 35%) + TreeBonus(max 1)
```

### Score Interpretation

- **7 – 10** → Excellent 🟢
- **5 – 6.9** → Good 🟡
- **Below 5** → Needs Improvement 🔴

---

## 🌫️ Carbon Emission Formula

```text
CO₂ (kg) = (Energy kWh × 0.92) + (Total Waste kg × 0.5)
```

This is based on the **India electricity grid emission factor**.

---

## 🎯 Purpose of the Project

This platform helps colleges and institutions to:

- Digitally manage environmental sustainability data
- Evaluate eco-performance in a structured way
- Generate reports for academic, administrative, or accreditation purposes
- Support decision-making for greener campus initiatives

---

## 👨‍💻 Developed Using MERN Stack

- **MongoDB** – Database
- **Express.js** – Backend Framework
- **React.js** – Frontend UI
- **Node.js** – Server Environment

---

## 📌 Future Enhancements

- Staff/User role management
- Real-time alerts for high carbon footprint
- Department-wise sustainability ranking
- AI-based eco-policy recommendations
- Cloud deployment support

---

## 📃 License

This project is developed for **academic and educational purposes**.

---