# How to Share & Run the LifeLink Project

This guide provides instructions on how to package this project to send to professors, evaluators, teammates, or clients, and how anyone can run it on their computer in minutes.

---

## 📦 How to Package & Send This Project to Others

### Step 1: Clean Temporary Build Artifacts (Keeps File Size Under 15MB)
Before zipping, delete the heavy auto-generated dependency folders (whoever receives the project can reinstall them in 1 command):

1. Inside `frontend/`, delete the `node_modules` and `.angular` folders (if present).
2. Inside `backend/`, delete the `target` folder (if present).

> 💡 **Quick PowerShell Command to clean before zipping:**
> ```powershell
> Remove-Item -Path "frontend/node_modules", "frontend/.angular", "backend/target" -Recurse -Force -ErrorAction SilentlyContinue
> ```

### Step 2: Zip the Entire Project
- Select all contents (`backend`, `frontend`, `data`, `docs`, `README.md`, `.bat` files) and compress them into `lifelink-project.zip`.
- Send via Google Drive, Email, OneDrive, or GitHub.

---

## 🚀 How to Run the Project (For Anyone Receiving This Project)

### Prerequisites Required:
1. **Java JDK 17 or higher** installed (`java -version`).
2. **Node.js 18.x or higher** installed (`node -v`).

---

### Option A: The 1-Click Fast Launcher (Windows)
1. Double-click [**`start-all.bat`**](../start-all.bat).
2. It will open two console windows:
   - **Window 1**: Starts Spring Boot Backend on port `8080`.
   - **Window 2**: Starts Angular Frontend on port `4200`.
3. Open your browser and navigate to:
   - [**http://localhost:4200**](http://localhost:4200)

---

### Option B: Manual Terminal Execution (Any OS: Windows / macOS / Linux)

#### 1. Start Backend:
```bash
cd backend
./mvnw spring-boot:run
```
*(On Windows cmd: `mvnw.cmd spring-boot:run`)*

#### 2. Start Frontend:
Open a second terminal window:
```bash
cd frontend
npm install    # (Only needed the very first time)
npm start
```

---

## 🌐 Application URLs

| Portal | URL | Purpose |
| :--- | :--- | :--- |
| 🏠 **Home Page** | [**http://localhost:4200**](http://localhost:4200) | Landing page & portal selector |
| 🏥 **Hospital Portal** | [**http://localhost:4200/hospital/login**](http://localhost:4200/hospital/login) | Hospital login, stock search & emergency dispatch |
| 🩸 **Blood Bank Dashboard** | [**http://localhost:4200/blood-bank/login**](http://localhost:4200/blood-bank/login) | Stock management & emergency requirement fulfillment |
| 👤 **Donor Portal** | [**http://localhost:4200/donor/login**](http://localhost:4200/donor/login) | Donor eligibility & certificate registry |
| 🛡️ **Admin Authority** | [**http://localhost:4200/admin/login**](http://localhost:4200/admin/login) | Medical license verification (`admin` / `Admin@123`) |
| 🗄️ **H2 Database Console** | [**http://localhost:8080/h2-console**](http://localhost:8080/h2-console) | JDBC URL: `jdbc:h2:file:../data/lifelinkdb` (User: `sa`, Pass: empty) |
