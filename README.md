# 🩸 LifeLink DMS — Blood Distribution Management System

LifeLink DMS is a full-stack healthcare coordination platform designed to synchronize real-time blood inventory, facilitate emergency blood dispatch between hospitals and accredited blood banks, and connect registered voluntary blood donors with live critical needs.

---

## 🛠️ Technology Stack

- **Frontend**: Angular 17 (Standalone Components, Reactive Forms, RxJS)
- **Backend**: Spring Boot 3.5.4 (REST API, Spring Security, JWT, Spring Data JPA)
- **Database**: H2 Persistent Embedded Database (`AUTO_SERVER=TRUE`)
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)
- **Build System**: Maven (with included Maven Wrapper `mvnw` / `mvnw.cmd`)
- **Frontend Package Manager**: npm & Angular CLI

---

## 🏛️ Project Directory Structure

```
tcsproject/
├── backend/                       # Spring Boot REST API Service (Port 8080)
│   ├── src/main/java/com/bbms/... # Controllers, Services, Repositories, Entities, Security
│   ├── src/main/resources/        # application.properties (H2, JPA, Server, JWT)
│   ├── .mvn/wrapper/              # Maven Wrapper configuration (portable Maven 3.9.x)
│   ├── pom.xml                    # Maven Dependencies & Build Configuration (Java 17)
│   └── mvnw / mvnw.cmd            # Maven Wrapper executable scripts
│
├── frontend/                      # Unified Angular 17 Standalone SPA (Port 4200)
│   ├── src/app/                   # Multi-Role Routing, Guards, Components & Services
│   ├── src/environments/          # Environment configuration (apiUrl: http://localhost:8080/api)
│   ├── angular.json               # Angular CLI Configuration
│   ├── tsconfig.json              # TypeScript Configuration
│   └── package.json               # Frontend Dependencies
│
├── data/                          # Persistent Database Storage
│   └── lifelinkdb.mv.db           # Persistent H2 Database File
│
├── docs/                          # Guides & Technical Documentation
│   └── HOW_TO_SHARE_AND_RUN.md    # Packaging, Sharing & Running Guide
│
├── install-dependencies.bat       # 1-Click Dependency Installer (npm install + maven compile)
├── start-all.bat                  # 1-Click Launcher (Starts both Backend & Frontend)
├── start-backend.bat              # 1-Click Launcher (Backend only on Port 8080)
├── start-frontend.bat             # 1-Click Launcher (Frontend only on Port 4200)
├── .gitignore                     # Git Exclusion Rules
└── README.md                      # Complete Project Documentation
```

---

## 💻 A. Prerequisites & System Requirements

To run this project on another computer (e.g. your company laptop), ensure the following prerequisites are installed:

| Tool / Runtime | Required Version | Verification Command | Notes |
| :--- | :--- | :--- | :--- |
| **Java JDK** | **17 LTS** (or 21 LTS) | `java -version` | Ensure `JAVA_HOME` is configured in system PATH |
| **Node.js** | **18.13.0+** or **20.x LTS** | `node -v` | Recommended: Node.js 18 LTS or 20 LTS |
| **npm** | **9.x+** or **10.x+** | `npm -v` | Included automatically with Node.js |
| **Maven** | Not required globally | `mvn -v` *(optional)* | The project includes `mvnw` / `mvnw.cmd` wrapper |
| **Web Browser** | Any modern browser | — | Google Chrome, Microsoft Edge, Firefox |

---

## ⚙️ B. Backend Setup & Startup

The backend is completely self-contained and uses the included Maven Wrapper.

### 1. Compile & Download Dependencies:
```bash
cd backend
./mvnw clean compile
```
*(On Windows Command Prompt / PowerShell: `cd backend` then `.\mvnw.cmd clean compile`)*

### 2. Run Spring Boot Backend:
```bash
cd backend
./mvnw spring-boot:run
```
*(On Windows Command Prompt / PowerShell: `cd backend` then `.\mvnw.cmd spring-boot:run`)*

The backend will start and listen on port **`8080`**.

---

## 🎨 C. Frontend Setup & Startup

### 1. Install Node Dependencies:
```bash
cd frontend
npm install
```

### 2. Run Angular Development Server:
```bash
cd frontend
npm start
```
*(or `npx ng serve`)*

The frontend will compile and start on **`http://localhost:4200`**.

---

## 🚀 1-Click Quick Launchers (Windows)

For convenience on Windows machines:
- **`install-dependencies.bat`**: Automatically runs `npm install` and `./mvnw clean compile`.
- **`start-all.bat`**: Automatically opens two windows and starts both backend (`8080`) and frontend (`4200`).
- **`start-backend.bat`**: Starts the backend on port `8080`.
- **`start-frontend.bat`**: Starts the frontend on port `4200`.

---

## 🌐 D. Application URLs

| Portal / Resource | URL | Description |
| :--- | :--- | :--- |
| 🏠 **Landing Page** | [http://localhost:4200](http://localhost:4200) | Universal portal selector & landing page |
| 🏥 **Hospital Portal** | [http://localhost:4200/hospital/login](http://localhost:4200/hospital/login) | Hospital login, inventory & emergency dispatch |
| 🩸 **Blood Bank Portal** | [http://localhost:4200/blood-bank/login](http://localhost:4200/blood-bank/login) | Stock management & emergency request fulfillment |
| 👤 **Donor Portal** | [http://localhost:4200/donor/login](http://localhost:4200/donor/login) | Voluntary donor dashboard & certificate registry |
| 🛡️ **Admin Portal** | [http://localhost:4200/admin/login](http://localhost:4200/admin/login) | Healthcare accreditation & facility license auditing |
| 🗄️ **H2 Database Console** | [http://localhost:8080/h2-console](http://localhost:8080/h2-console) | Database browser (`jdbc:h2:file:../data/lifelinkdb`) |
| 📖 **Swagger / OpenAPI** | [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) | Interactive REST API Documentation |

---

## 🗄️ E. Database Configuration (H2)

- **Database Engine**: Embedded H2 Database in file persistence mode.
- **Persistence Location**: `data/lifelinkdb.mv.db` relative to project root.
- **Configuration in `application.properties`**:
  ```properties
  spring.datasource.url=jdbc:h2:file:../data/lifelinkdb;AUTO_SERVER=TRUE
  spring.datasource.driver-class-name=org.h2.Driver
  spring.datasource.username=sa
  spring.datasource.password=
  spring.jpa.hibernate.ddl-auto=update
  ```
- **H2 Console Access**:
  - **Saved Settings**: Generic H2 (Embedded)
  - **Driver Class**: `org.h2.Driver`
  - **JDBC URL**: `jdbc:h2:file:../data/lifelinkdb`
  - **User Name**: `sa`
  - **Password**: *(leave blank)*
- **Data Persistence**: Database records persist between application restarts. If the database file is deleted or transferred to a fresh machine, Spring Data JPA will automatically re-create the tables on startup.

---

## 👥 F. User Roles & Authentication

The application enforces strict Role-Based Access Control (RBAC) powered by Spring Security and JWT tokens:

1. **Health Authority Admin**:
   - Audits, reviews, and approves hospital and blood bank operating licenses and accreditation.
   - Access URL: `/admin/login`.
2. **Hospital Facility**:
   - Manages internal emergency blood stocks, searches nearby accredited blood banks with distance calculations, and dispatches urgent blood requirement requests.
   - Access URL: `/hospital/login` and `/hospital/register`.
3. **Blood Bank / Transfusion Center**:
   - Manages blood unit reserves with real-time stock adjusters, approves and reserves hospital emergency dispatches, broadcasts shortage alerts, and verifies voluntary donor certificates.
   - Access URL: `/blood-bank/login` and `/blood-bank/register`.
4. **Voluntary Blood Donor**:
   - Completes 3-step eligible registration (18–65 age validation, Hb criteria, affiliated blood bank selection), receives emergency shortage notifications, accepts donation drives, and uploads/views official donation certificates.
   - Access URL: `/donor/login` and `/donor/register`.

---

## ⚙️ G. Portability & Configuration Notes

1. **Zero Hardcoded Machine Paths**: All paths in backend, frontend, batch scripts, and database URLs use relative paths (`../data/lifelinkdb`, `%~dp0`, etc.).
2. **Localhost Communication**: The frontend is pre-configured to communicate with the backend at `http://localhost:8080/api` via `frontend/src/environments/environment.ts`.
3. **CORS Configuration**: The Spring Boot backend accepts requests from the Angular development origin (`http://localhost:4200`).
4. **Packaging for Transfer (ZIP)**:
   Before compressing the project folder into a `.zip` file for transfer:
   - Exclude `frontend/node_modules/`
   - Exclude `frontend/dist/`
   - Exclude `frontend/.angular/`
   - Exclude `backend/target/`
   - The recipient will simply run `npm install` and `./mvnw clean compile` (or `install-dependencies.bat`) to generate all necessary build files on their computer.
