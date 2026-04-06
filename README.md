# 🌿 Academic Eco Policy Evaluation Platform

A full-stack MERN application for tracking and evaluating campus environmental sustainability.

---

## 📁 Project Structure

```
green-campus/
├── server/                   # Node.js + Express Backend
│   ├── models/
│   │   ├── User.js           # Admin user model
│   │   └── Environment.js    # Environmental data model (with auto score calculation)
│   ├── routes/
│   │   ├── auth.js           # POST /api/auth/login, GET /api/auth/me
│   │   ├── environment.js    # CRUD + filter for env data
│   │   ├── dashboard.js      # Aggregated stats for charts
│   │   └── reports.js        # PDF & CSV download
│   ├── middleware/
│   │   └── auth.js           # JWT protect middleware
│   ├── seed.js               # Seed admin + sample data
│   ├── index.js              # Express server entry
│   └── package.json
│
├── client/                   # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js  # Auth state management
│   │   ├── components/
│   │   │   └── Layout.js       # Navbar + Outlet
│   │   ├── pages/
│   │   │   ├── Login.js        # Admin login
│   │   │   ├── Dashboard.js    # Charts & stats
│   │   │   ├── AddData.js      # Block-wise data entry form
│   │   │   └── Reports.js      # Filter + download + delete table
│   │   ├── App.js              # Router setup
│   │   ├── App.css             # Green campus theme
│   │   └── index.js
│   └── package.json
│
├── package.json              # Root scripts
└── README.md
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v16+
- MongoDB running locally (`mongodb://localhost:27017`)

### 1. Install Dependencies
```bash
npm run install-all
```
Or manually:
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment
```bash
cd server
cp .env.example .env
# Edit .env if needed (MongoDB URI, JWT secret, etc.)
```

### 3. Seed Database (Admin + Sample Data)
```bash
npm run seed
```
This creates:
- **Admin**: `admin@greencampus.edu` / `admin123`
- 30 sample environmental records (5 blocks × 6 months)

### 4. Run Development Servers
```bash
# From root directory (runs both server + client)
npm install  # install concurrently
npm run dev

# Or separately:
npm run server   # Backend on http://localhost:5000
npm run client   # Frontend on http://localhost:3000
```

---

## 🔑 Login Credentials
| Field | Value |
|-------|-------|
| Email | admin@greencampus.edu |
| Password | admin123 |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login → returns JWT |
| GET  | `/api/auth/me` | Get current user (protected) |

### Environmental Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/environment/add` | Add new block data record |
| GET    | `/api/environment` | Get all records |
| GET    | `/api/environment/filter?block=&year=` | Filter records |
| DELETE | `/api/environment/:id` | Delete a record |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Aggregated stats for all charts |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/download?format=csv&block=&year=` | Download CSV |
| GET | `/api/reports/download?format=pdf&block=&year=` | Download PDF |

---

## 🏢 College Blocks
- Academic Block
- Laboratory Block
- Administrative Block
- Hostel Block
- Library Block

## 📊 Sustainability Score Formula
```
Score = (EnergyScore × 35%) + (WaterScore × 30%) + (WasteScore × 35%) + TreeBonus(max 1)
```
- **7–10**: Excellent 🟢
- **5–6.9**: Good 🟡
- **Below 5**: Needs Improvement 🔴

## 🌫️ Carbon Emission Formula
```
CO₂ (kg) = (Energy kWh × 0.92) + (Total Waste kg × 0.5)
```
Based on India electricity grid emission factor.

---

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React, React Bootstrap, Chart.js |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Reports | PDFKit, CSV |
| State | React Context API |
