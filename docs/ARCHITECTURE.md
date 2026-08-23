# Veenero Foundation Architecture

This document describes the foundational architecture of the Veenero project, established in Phase 1. It outlines the structure and separation of concerns across the frontend and backend.

## 1. Project Architecture
The project follows a decoupled client-server architecture:
- **Frontend**: React + TypeScript + Vite (Tailwind CSS for styling).
- **Backend**: Express + TypeScript + Node.js.
- **Database**: MongoDB (Atlas) accessed via Mongoose.
- **Authentication**: JWT cookie-based session management with RBAC (Role-Based Access Control).

## 2. Frontend Structure (`frontend/`)
The frontend structure strictly separates UI (presentation) from Data (content/config).

### 2.1 File Extension Rules
- **`.ts`**: Used for content, data definitions, configuration, constants, types, and API logic.
- **`.tsx`**: Used strictly for UI, layout, presentation, and React rendering.

### 2.2 Key Directories
- `src/app/`: Application-level configurations, router setup, and global providers.
- `src/config/`: Central configurations (Site metadata, API URLs, Route definitions).
- `src/content/`: Static content configurations.
- `src/types/`: Centralized TypeScript interface and type definitions.
- `src/components/`: Reusable UI components.
- `src/pages/`: Page-level components.
- `src/services/`: API interaction logic.
- `src/admin/`: Admin CMS dashboard.

## 3. Backend Structure (`backend/`)
The backend follows a layered architecture to keep routing, business logic, and database operations decoupled.

### 3.1 Layering
- **Routes (`src/routes/`)**: Map HTTP requests to controllers and apply middleware.
- **Controllers (`src/controllers/`)**: Handle HTTP request extraction and response formatting.
- **Services (`src/services/`)**: Central business logic and database interactions.
- **Models (`src/models/`)**: Mongoose schema definitions.

### 3.2 APIs
APIs are logically grouped into public (`/api/*`) and admin (`/api/admin/*`) namespaces.

## 4. Static vs Dynamic Content
- **Static Content**: Sourced from `src/content/*.ts` and rendered in React components. Serves as fallback or for pages not yet managed by the CMS.
- **Dynamic Content**: Sourced from the MongoDB CMS via API. Overrides static content wherever present.

## 5. Security & Authentication
- Admin functionality is protected via JWT stored in HTTP-Only cookies.
- Role-Based Access Control (RBAC) ensures only authorized roles (SUPER_ADMIN, ADMIN, EDITOR, VIEWER) can mutate CMS data.

## 6. Migration Strategy (Phase 2+)
- Future phases will incrementally migrate hardcoded text in `.tsx` files to the `.ts` content layer.
- Ensure all existing CMS functionalities remain untouched while components are adapted to accept typed content structures as props.
