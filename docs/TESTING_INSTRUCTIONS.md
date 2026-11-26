# Testing Instructions

Since the development environment doesn't have Docker, MySQL, or Maven installed, the application needs to be tested on a machine with these tools.

## To Run and Capture Screenshots:

### 1. Prerequisites
- Docker and Docker Compose installed
- Or: MySQL 8, Java 17, Maven, Node.js 18

### 2. Run with Docker (Recommended)
```bash
git clone https://github.com/Nzrix/clinic-queue-system
cd clinic-queue-system
git checkout cursor/clinic-queue-system-455f
cp .env.example .env
docker-compose up --build
```

### 3. Access the Application
- Frontend: http://localhost
- Login: username `demo`, password `demo123`

### 4. Test All Features

#### Patient Management
1. Navigate to "ผู้ป่วย" (Patients)
2. Click "+ เพิ่มผู้ป่วย" to add a new patient
3. Test search functionality
4. Edit a patient
5. Test pagination if more than 10 patients
6. **Screenshot**: `docs/screenshots/patients.png`

#### Appointment Management
7. Navigate to "นัดหมาย" (Appointments)
8. Select today's date
9. Click "+ เพิ่มนัดหมาย" to book an appointment
10. Try to book another appointment at the same time (should show error)
11. Mark an appointment as completed
12. Cancel an appointment
13. **Screenshot**: `docs/screenshots/appointments.png`

#### Queue Management
14. Navigate to "คิวรอ" (Queue)
15. Click "+ เพิ่มคิว" to add a walk-in patient
16. Click "เรียกคิวถัดไป" to call next
17. Change queue status to "กำลังให้บริการ" then "เสร็จสิ้น"
18. Try the "ข้าม" (Skip) function
19. **Screenshot**: `docs/screenshots/queue.png`

#### Dashboard
20. Navigate to "แดชบอร์ด" (Dashboard)
21. Verify statistics are displayed
22. Check the 7-day history table
23. **Screenshot**: `docs/screenshots/dashboard.png`

#### Public Queue Display
24. Open http://localhost/queue-display in a new tab/window
25. Verify it shows current queue without login
26. Leave it open and call a queue from the staff interface
27. Verify the display updates within 5 seconds
28. **Screenshot**: `docs/screenshots/queue-display.png`

### 5. Update README
After capturing screenshots:
1. Place all screenshots in `docs/screenshots/`
2. The README already references them - they will display automatically

## CI Status
✅ All GitHub Actions tests passing
✅ Backend build and tests successful
✅ Frontend build and tests successful

## Known Limitations
- No real-time WebSocket (uses polling/auto-refresh)
- No SMS/email notifications
- Single clinic/location only
- Basic reporting (no PDF/Excel export)
- No role-based access control (all staff have same permissions)
