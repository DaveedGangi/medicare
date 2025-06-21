

#installation setup
cd meds-buddy-check-main
cd backend 
split the terminal for use backend and frontend
in terminal enter npm install 
node index.js 

for frontend 
select another terminal 
cd meds-buddy-check-main 
npm install 
npm run dev 



# MediCare Companion 🩺💊

A full-stack medication tracking system designed to help patients stay consistent with their prescriptions and allow caretakers to monitor and support their medication adherence.





## 👤 Roles

- **Patient**: Can log medication taken daily.
- **Caretaker**: Can monitor patient adherence, send reminders, and view overall progress.

---

## 🔧 Tech Stack

### Frontend:
- React with TypeScript
- Tailwind CSS for UI
- ShadCN / Lucide Icons
- Axios
- React Query
- Date-fns

### Backend:
- Node.js + Express
- SQLite (or any SQL database)
- JWT-based Authentication

---

## 🔐 Authentication

- JWT token stored in `localStorage`
- Middleware validates user role and permissions
- Role-based routes:
  - `patient` → can mark medication as taken
  - `caretaker` → can fetch list of patients and their medication adherence

---

## 📦 Features

### ✅ For Patients:
- View and mark daily medications as taken
- Upload proof image (optional)
- See streaks and adherence

### 👁️ For Caretakers:
- Dashboard overview of patient medication progress
- Filter and monitor patients (via role in user table)
- Send reminders or configure notifications
- Visual calendar of medication adherence

---

## 🔗 API Endpoints

### Authentication
POST /api/signup
POST /api/login

shell
Copy
Edit

### Medications
GET /api/medications // Patient view
PATCH /api/medications/:id/taken // Mark medication as taken

shell
Copy
Edit

### Caretaker
GET /api/patients // List all users with role: "patient"

yaml
Copy
Edit

---

## ⚙️ Setup Instructions

### Backend

```bash
cd backend
npm install
npm run dev
Frontend
bash
Copy
Edit
cd frontend
npm install
npm run dev
📁 Folder Structure
bash
Copy
Edit
/frontend
  └── components/
  └── pages/
  └── caretaker/
  └── patient/
  └── auth/
  
/backend
  └── routes/
      ├── auth.js
      ├── medication.js
      └── caretaker.js
  └── middleware/
  └── db.js
📝 Notes
Caretaker dashboard fetches all users with role patient.

Only one login session is maintained; user must logout to return to sign in.

No third-party auth providers like Clerk or Firebase were used.

✨ Future Improvements
Assign specific patients to caretakers

Reminders via email/SMS

Weekly and monthly reports

Multi-language support


🧑‍💻 Author
Daveed Gangi











# MediCare App - 4-6 Hour Assessment

## Live Demo (UI only): https://meds-buddy-check.lovable.app/

## Current State of the codebase

This is a React medication management app with dual user roles (patients/caretakers). Currently features:

- Role-based dashboard system for each user account with runtime switching (for simplcity)

- UI for medication tracking with calendar visualization

- Mock data for streaks, adherence rates, and medication logs

- Photo upload interface for medication proof

- Notification settings UI (non-functional)

- All data is stored in local state (no persistence)


## Core Implementation Tasks

### Phase 1 (Required - 4 hours):
- Supabase authentication setup
- Basic CRUD for adding medications
- Basic CRUD for marking medication taken for the day
- Connect one dashboard to real data

### Phase 2 (Optional - 2 hours):
- Caretaker-patient real time updates
- Basic adherence tracking

### Phase 3 (Bonus):
- File uploads

**Provided:**
- UI components and styles

## Required Features:
1. User login/signup with Supabase Auth
2. Add medications (name, dosage, frequency)
3. View medication list
4. Mark medication as taken today
5. Simple adherence percentage display

## Technical Requirements:
- Use provided React + TypeScript template
- Integrate Supabase for auth and database
- Use React Query for data fetching
- Implement error handling
- Clean, readable code

## Other Requirements:
- Use Git with meaningful commits
- Implement proper form validation
- Handle loading and error states consistently
- Write at least 2-3 meaningful tests using vitest
- Include a README with setup instructions

## Technical Challenges:

**Include:**
- Optimistic updates using react query
- Proper TypeScript generics usage

## Deployment Bonus:
Deploy to Vercel/Netlify

## We will evaluate:
- Code organization and architecture decisions
- Error handling and edge cases
- TypeScript usage (proper typing, no `any`)
- Component composition and reusability
- State management approach
- Performance considerations (unnecessary re-renders)
- Security awareness (input sanitization)
