# TaskFlow API

A scalable REST API with JWT Authentication, Role-Based Access Control, and a React.js frontend. Built with Spring Boot 3, MySQL, and React + Vite.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Backend    | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Auth       | JWT (jjwt 0.12), BCrypt password hashing        |
| Database   | MySQL 8 + Flyway migrations                     |
| Docs       | Springdoc OpenAPI 3 (Swagger UI)                |
| Frontend   | React 18, Vite, React Router v6, Axios          |

---

## Project Structure

```
taskflow/
├── backend/
│   ├── src/main/java/com/taskflow/
│   │   ├── config/         # SecurityConfig, OpenApiConfig
│   │   ├── controller/     # AuthController, TaskController, AdminController
│   │   ├── dto/            # Request/Response DTOs
│   │   ├── entity/         # User, Role, Task (JPA entities)
│   │   ├── exception/      # GlobalExceptionHandler, custom exceptions
│   │   ├── repository/     # Spring Data JPA repositories
│   │   ├── security/       # JwtService, JwtAuthFilter, UserPrincipal
│   │   └── service/        # AuthService, TaskService
│   └── src/main/resources/
│       ├── application.properties
│       └── db/migration/V1__initial_schema.sql
└── frontend/
    └── src/
        ├── api/            # Axios client + API functions
        ├── components/     # UI components, TaskForm, Layout
        ├── context/        # AuthContext (global auth state)
        └── pages/          # LoginPage, RegisterPage, DashboardPage, TasksPage, AdminPage
```

---

## Setup & Running

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Node.js 18+

### 1. Database

```sql
CREATE DATABASE taskflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Flyway will automatically run migrations and seed roles + an admin user on first startup.

### 2. Backend

```bash
cd backend

# Edit src/main/resources/application.properties:
# spring.datasource.username=root
# spring.datasource.password=your_password

mvn spring-boot:run
```

Backend starts on **http://localhost:8080/api**

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts on **http://localhost:5173**

---

## API Endpoints

### Authentication (public)

| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | `/api/v1/auth/register` | Register new user  |
| POST   | `/api/v1/auth/login`    | Login, get JWT     |

**Register request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Secret@123",
  "fullName": "John Doe"
}
```

**Login request:**
```json
{
  "username": "john_doe",
  "password": "Secret@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGci...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "roles": ["ROLE_USER"]
    }
  }
}
```

### Tasks (JWT required)

| Method | Endpoint             | Description                                |
|--------|----------------------|--------------------------------------------|
| POST   | `/api/v1/tasks`      | Create task                                |
| GET    | `/api/v1/tasks`      | Get my tasks (paginated, filterable)       |
| GET    | `/api/v1/tasks/{id}` | Get single task                            |
| PATCH  | `/api/v1/tasks/{id}` | Update task (partial)                      |
| DELETE | `/api/v1/tasks/{id}` | Delete task                                |

**Query parameters for GET /tasks:**
- `page` (default: 0), `size` (default: 10)
- `sortBy` (createdAt | updatedAt | dueDate | priority)
- `direction` (asc | desc)
- `status` (TODO | IN_PROGRESS | DONE)
- `search` (title keyword)

### Admin (ROLE_ADMIN required)

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | `/api/v1/admin/tasks` | Get all users' tasks |

---

## Default Admin Credentials

```
Username: admin
Password: Admin@123
```

---

## API Documentation

With the backend running, visit:
- **Swagger UI:** http://localhost:8080/api/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8080/api/v3/api-docs

---

## Security Practices

- Passwords hashed with **BCrypt (cost 12)**
- **JWT** signed with HS256, configurable expiry (default 24h)
- **Stateless sessions** — no server-side session storage
- **Input validation** via Jakarta Bean Validation on all DTOs
- **CORS** configured to allow only specified origins
- **Role-based access** enforced at both security filter and method level (`@PreAuthorize`)
- Ownership checks prevent users accessing other users' tasks

---

## Scalability Notes

### Horizontal Scaling
- Stateless JWT auth means any instance can validate tokens — no sticky sessions needed
- Add a load balancer (e.g. AWS ALB, Nginx) in front of multiple Spring Boot instances

### Caching (optional enhancement)
- Add Redis for caching task list queries:
  ```java
  @Cacheable("tasks")
  public PageResponse<TaskResponse> getMyTasks(...) { ... }
  ```

### Microservices (future)
The modular structure (auth, tasks, admin) maps cleanly to separate services:
- **auth-service** — registration, login, JWT issuance
- **task-service** — CRUD, consumes JWT for identity
- **gateway** — Spring Cloud Gateway for routing + rate limiting

### Database
- Add indexes on `user_id`, `status` (already in migration)
- Read replicas for heavy read workloads via Spring's `@Transactional(readOnly=true)`
- Connection pooling via HikariCP (Spring Boot default)


