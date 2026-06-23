Exam Session Planner 🎓📅Web Full Stack Applications Design ProjectMaster's / Bachelor's Degree in Computer Science and EngineeringUniversity of Brescia - Department of Information Engineering👥 AuthorsMatteo Lublanis (ID: 736418)Singh Sahiljit (ID: 740552)📌 Table of ContentsApplication DescriptionTechnologies UsedER (Entity-Relationship) ModelUser Hierarchy and CRUD MatrixArchitecture and Code StructureBackend (NestJS)Frontend (React + TypeScript)Hypertext Model and Navigation📝 Application DescriptionExam Session Planner is a full-stack web application designed to facilitate the management, organization, and publication of university exam dates.The application is structured to meet the needs of two main academic actors:Registrar's Office (Administration): Manages core system data, including degree programs, subjects, professors, and defines the temporal windows for exam sessions.Professor: Directly manages their own exam dates by inserting, modifying, or deleting them within the active timeframes defined by the registrar's office.The application ensures data consistency and integrity, preventing overlaps or the creation of exam dates outside of valid session periods.🛠️ Technologies UsedThe project is built following modern web development standards, adopting a strongly-typed approach on both sides of the stack.BackendNestJS: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.TypeScript: Core programming language to ensure robust and maintainable code through static typing.TypeORM / Prisma: For object-relational mapping and secure, efficient interactions with the SQL database.Class-Validator & Class-Transformer: Used for rigorous incoming payload validation via DTOs (Data Transfer Objects).NestJS Swagger: Automatic generation of interactive API documentation (OpenAPI).JWT (JSON Web Token): Secure, stateless authentication implementation for route protection.FrontendReact: A JavaScript library for building dynamic user interfaces based on reactive components.TypeScript: Integration of static typing on the client-side to minimize runtime errors.Axios: Centralized HTTP client featuring custom interceptors to handle and attach the authentication token (Bearer Token).CSS Modules: For scoped, modular styling that prevents global style conflicts between components.React Context / Custom Hooks: Clean and centralized global state management (e.g., user session and authentication).📊 ER (Entity-Relationship) ModelThe database is designed with relational constraints to faithfully map academic rules:User / Professor: A Professor (Docente) is a specialization of the generic User (Utente) entity (managed via a 1:1 relationship or inheritance).Subject: A subject (Materia) is linked to one or more Degree Program (Corso di laurea) entities via a junction table MateriaCorso. Each subject is taught by a single professor.Exam Date: An exam appeal (Appello) belongs uniquely to a Subject, is created and scheduled by the responsible Professor, and is assigned to a specific Session.Session: Defines temporal boundaries (start and end dates for the entire exam session, as well as the active window during which professors are allowed to schedule or modify exams).👥 User Hierarchy and CRUD MatrixUser Hierarchy          [ User ]
          /      \
  [ Registered ]  [ Unregistered ]
     /        \
[ Professor ]  [ Registrar ]
CRUD Permissions MatrixEntityProfessorRegistrarUnregisteredDegreeProgramR (Read)RW (Read/Write)-SubjectRRW-ExamDateR(W) (Only own)R-SessionRRW-ProfessorR(W) (Only own profile)RW-Registrar-R-📂 Architecture and Code StructureThe project adopts a Monorepo / Clean Architecture approach, allowing data interface sharing to minimize code duplication between client and server.Backend (NestJS)The backend is divided into highly cohesive vertical modules (academic, auth, security, users).DTOs (Data Transfer Objects): Define the structure of data in transit and validate its content.Controllers & Guards: Controllers expose the REST API endpoints, while the RolesGuard protects them, ensuring Role-Based Access Control (RBAC).libs/
  database/          # Database configuration, connection, and migrations
  server/
    academic/        # Academic modules (exam dates, degree programs, professors, subjects, sessions)
    auth/            # Authentication management, login flows, and JWT issuance
    security/        # Password hashing and general security utilities
    users/           # System user management and profiles
  shared/
    api-types/       # TypeScript interfaces shared between Frontend and Backend
The internal structure of each submodule (e.g., appello / exam-date) follows the standard NestJS architectural pattern:appello/
├── dto/
│   ├── create-appello.dto.ts
│   └── update-appello.dto.ts
├── interfaces/
├── appello.controller.ts
├── appello.entity.ts
├── appello.module.ts
├── appello.repository.ts
├── appello.service.ts
└── index.ts
Frontend (React + TypeScript)The frontend is structured as a Single Page Application (SPA) organized by "features", isolating main logical capabilities into dedicated modules rather than a purely technical file-type organization.ui/src/
├── app/                 # Global application configuration and routing setup
├── assets/              # Static files (images, logos, icons)
├── components/          # Reusable global UI components (Modal, Input, Button, etc.)
├── features/            # Feature-sliced vertical modules
│   ├── appelli/         # Exam dates management
│   │   ├── appelli.api.ts
│   │   ├── AppelliPage.tsx
│   │   ├── AppelloForm.tsx
│   │   └── modals/ (CreateAppelloModal, UpdateAppelloModal, DeleteAppelloModal)
│   ├── auth/            # Login forms and authentication state management
│   ├── corsi-laurea/    # Degree programs visualization and management
│   ├── docenti/         # Professors directory and management
│   ├── materie/         # Academic subjects visualization and management
│   └── sessioni/        # Exam session windows management
└── layouts/             # Structural page wrappers (AdminLayout.tsx, DocenteLayout.tsx)
🗺️ Hypertext Model and NavigationUpon login, users are redirected to their respective layout based on the role stored in their decrypted JWT payload, preventing unauthorized access to administrative areas.[Home Page / Login]
        │
        ├── If Role = Registrar ────> [Administration Area (AdminLayout)]
        │                               ├── Manage Exam Dates (/admin/appelli)
        │                               ├── Manage Professors (/admin/docenti)
        │                               ├── Manage Sessions (/admin/sessioni)
        │                               ├── Manage Subjects (/admin/materie)
        │                               └── Manage Degree Programs (/admin/corsi-di-laurea)
        │
        └── If Role = Professor ────> [Professor Area (DocenteLayout)]
                                        ├── My Scheduled Exams (/docente/appelli)
                                        │     └── [Create / Edit / Delete Exam Date]
                                        └── Active Sessions (/docente/sessioni)
