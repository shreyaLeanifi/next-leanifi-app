# Leanifi eMAR System

A comprehensive Electronic Medication Administration Record (eMAR) system for tracking semaglutide weight loss management. Built with Next.js, TypeScript, MongoDB, and Tailwind CSS.

## Features

### Admin & Clinician Interface
- **Dashboard**: Overview of active patients, missed doses, and system alerts
- **Patient Management**: Create, view, edit, and manage patient profiles
- **Dose Logging**: Record medication administration with detailed tracking
- **Audit Trail**: Complete activity logging for compliance
- **Reporting**: Export patient data and treatment reports

### Patient Portal
- **Self-Service Dashboard**: View treatment progress and next dose information
- **Dose Logging**: Self-report medication administration
- **Missed Dose Reporting**: Report missed doses with reason tracking
- **Settings**: Change password and view account information
- **Resources**: Access injection guides and support information

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT tokens with role-based access control
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS with custom Leanifi brand colors
- **Forms**: React Hook Form with Zod validation

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leanifi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://sully_db_user:9NwIWAGTUxpeO2GZ@leanify.bbaudrh.mongodb.net/?retryWrites=true&w=majority&appName=leanify
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## User Roles & Authentication

### Admin Users
- Full system access
- Create and manage patient profiles
- View all patient data and reports
- Manage user accounts

### Clinician Users
- Log doses for patients
- Record side effects and observations
- View patient progress
- Access patient history

### Patient Users
- Self-log medication doses
- Report missed doses
- View treatment progress
- Access educational resources

## Database Schema

### Users Collection
- `leanifiId`: Unique identifier for login
- `password`: Hashed password
- `role`: admin, clinician, or patient
- `name`, `age`, `gender`, `weight`: Patient demographics
- `treatmentStartDate`: When treatment began
- `allergies`: Known allergies/contraindications

### Doses Collection
- `patientId`: Reference to patient
- `date`, `time`: Administration details
- `dosage`: Semaglutide dosage (0.25mg - 2.4mg)
- `injectionSite`: Body location of injection
- `status`: administered, missed, or refused
- `sideEffects`: Array of reported side effects
- `isPatientLogged`: Whether logged by patient or clinician

### Audit Logs Collection
- Complete activity tracking
- User actions and changes
- Timestamp and IP address logging

## Brand Guidelines

### Colors
- **Primary**: #44BC95 (Teal)
- **Secondary**: #014446 (Dark Teal)

### Typography
- **Font**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Logo
- Heart icon with arrow
- Primary color for icon
- Secondary color for text

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change password

### Admin
- `POST /api/admin/patients` - Create patient
- `GET /api/admin/patients` - List patients
- `GET /api/admin/patients/[id]` - Get patient details

### Patient
- `POST /api/patient/doses` - Log dose
- `POST /api/patient/missed-dose` - Report missed dose
- `GET /api/patient/history` - Get dose history

## Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Input validation with Zod
- CSRF protection
- Secure cookie handling

## Mobile Responsiveness

The application is built with a mobile-first approach:
- Responsive design for all screen sizes
- Touch-friendly interface elements
- Optimized for mobile dose logging
- Accessible navigation

## Development

### Project Structure
```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── admin/          # Admin pages
│   ├── patient/        # Patient pages
│   └── login/          # Authentication pages
├── lib/                # Utility functions
├── models/             # MongoDB schemas
└── middleware.ts       # Authentication middleware
```

### Key Features Implemented
- ✅ User authentication with Leanifi ID
- ✅ Role-based access control
- ✅ Patient profile management
- ✅ Dose logging and tracking
- ✅ Missed dose reporting
- ✅ Mobile-responsive design
- ✅ Brand-compliant styling
- ✅ Form validation
- ✅ Error handling

## Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- AWS
- Google Cloud Platform

Ensure to set up environment variables in your deployment platform.

## Support

For technical support or questions about the eMAR system, please contact the development team.

---

**Leanifi eMAR System** - Secure, user-friendly medication tracking for weight loss management.