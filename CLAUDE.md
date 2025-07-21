# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyBookJourneys is a full-stack book management application with an ASP.NET Core Web API backend and React frontend. The application allows users to track and manage their book collections with features like book CRUD operations, search functionality, image uploads via Azure Blob Storage, and comprehensive book metadata management.

## Architecture

### Backend (.NET 8)
- **API**: ASP.NET Core Web API with RESTful endpoints at `/api/v1.0/books`
- **Database**: Entity Framework Core with SQL Server
- **Storage**: Azure Blob Storage for book cover images
- **Pattern**: Repository pattern with dependency injection
- **Location**: `MyBookJourneys/MyBookJourneys.Server/`

### Frontend (React + Vite)
- **Framework**: React 19 with Vite build tool
- **Location**: `MyBookJourneys/mybookjourneys.client/`
- **Dev Server**: Runs on https://localhost:5173
- **Build Tool**: Vite with ESLint configuration

### Key Components

**Data Layer:**
- `ApplicationDbContext` (MyBookJourneys.Server/Data/Contexts/) - EF Core context with automatic timestamp handling
- `Book` model (MyBookJourneys.Server/Data/Models/) - Core entity with validation attributes
- Repository pattern implementation in `MyBookJourneys.Server/Data/Repositories/`

**API Layer:**
- `BooksController` (MyBookJourneys.Server/Controllers/) - Comprehensive REST API with search, filtering, and image upload endpoints
- Built-in Swagger documentation at `/swagger` in development

**Services:**
- `BlobStorageService` - Azure Blob Storage integration for book cover images

## Development Commands

### Backend (.NET)
```bash
# Navigate to server directory
cd MyBookJourneys/MyBookJourneys.Server

# Run the application (includes frontend proxy)
dotnet run

# Build the solution
dotnet build

# Run with specific profile
dotnet run --launch-profile https

# Entity Framework migrations
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

### Frontend (React)
```bash
# Navigate to client directory
cd MyBookJourneys/mybookjourneys.client

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

### Full Application
The backend is configured to proxy the frontend during development. Running `dotnet run` in the Server directory will start both the API and serve the React application.

## Configuration

- **Database**: Connection string in `appsettings.json` (SQL Server)
- **Azure Storage**: Connection string and container name in `appsettings.json`
- **API Base URL**: `https://localhost:7196` (HTTPS) or `http://localhost:5271` (HTTP)
- **Frontend Dev Server**: `https://localhost:5173`

## API Endpoints

All endpoints are prefixed with `/api/v1.0/books` and include:
- CRUD operations (`GET`, `POST`, `PUT`, `DELETE`)
- Search functionality (`/search`, `/author/{author}`, `/genre/{genre}`, `/isbn/{isbn}`)
- Filtering (`/recent`, `/top-rated`)
- Image management (`/{id}/image`)
- Statistics (`/count`)

Swagger documentation available at `/swagger` in development mode.

## React Project Structure (Bulletproof React Pattern)

When refactoring or extending the React frontend, follow this scalable project structure:

### Main Source Folder Structure
```
src/
├── app/              # Application layer configuration
│   ├── routes/       # Route definitions and configurations
│   ├── app.tsx       # App component with providers
│   ├── provider.tsx  # All context providers
│   └── router.tsx    # Router configuration
├── assets/           # Images, fonts, and other static files
├── components/       # Shared/reusable components
├── config/           # Global configuration, env variables, etc.
├── features/         # Feature-based modules
├── hooks/            # Shared hooks
├── lib/              # Pre-configured 3rd party libraries
├── stores/           # Global state stores
├── testing/          # Test utilities and mock data
├── types/            # Shared TypeScript type definitions
└── utils/            # Shared utility functions
```

### Feature-Based Module Structure
Each feature should be self-contained with its own structure:

```
src/features/[feature-name]/
├── api/              # API request declarations and hooks
├── assets/           # Feature-specific assets
├── components/       # Feature-specific components
├── hooks/            # Feature-specific hooks
├── stores/           # Feature-specific state management
├── types/            # Feature-specific types
└── utils/            # Feature-specific utilities
```

### Key Architectural Principles

1. **Modular Features**: Organize most code within the `features` folder
2. **Unidirectional Dependencies**: Enforce flow: `shared → features → app`
3. **No Cross-Feature Imports**: Features should not import from each other
4. **Direct Imports**: Avoid barrel files (index.js) for better tree-shaking
5. **Feature Independence**: Each feature should be self-contained and removable


### React Frameworks
- Routing: React Router
- Application State: React Redux for state management
- Server Cashe State: Redux RTK for server state management
- Form State: Formik

### Example Feature Structure for Books
```
src/features/books/
├── api/
│   └── get-books.ts
├── components/
│   ├── book-list.tsx
│   ├── book-card.tsx
│   └── book-form.tsx
├── hooks/
│   └── use-books.ts
├── stores/
│   └── books-store.ts
└── types/
    └── index.ts
```

### Implementation Notes
- Not all folders are required for every feature
- Compose features at the application level (in `app/routes`)
- Use ESLint rules to enforce architectural constraints
- Consider using tools like `eslint-plugin-boundaries` to prevent cross-feature imports

## Authentication Configuration (Microsoft Entra External ID)

The application uses Microsoft Entra External ID for authentication. Both frontend and backend are configured to work together seamlessly.

### Frontend Configuration
Update `/MyBookJourneys/mybookjourneys.client/.env` with your External ID values:
```
VITE_AZURE_CLIENT_ID=your-application-client-id
VITE_AZURE_TENANT_ID=your-tenant-id-guid  
VITE_AZURE_TENANT_SUBDOMAIN=your-tenant-subdomain
VITE_API_BASE_URL=https://localhost:7196
```

### Backend Configuration
Update `/MyBookJourneys/MyBookJourneys.Server/appsettings.Development.json`:
```json
"EntraExternalId": {
    "Instance": "https://your-tenant-subdomain.ciamlogin.com/",
    "TenantId": "your-tenant-id",
    "ClientId": "your-client-id",
    "Domain": "your-tenant-subdomain.onmicrosoft.com",
    "Scopes": "access_as_user",
    "CallbackPath": "/signin-oidc"
}
```

### Required Azure Configuration
1. **App Registration**: Create an app registration in your External ID tenant
2. **Redirect URIs**: Add `https://localhost:5173` for the React app
3. **API Permissions**: Expose an API with scope `access_as_user`
4. **Authentication**: Enable implicit flow for ID tokens (for SPA)
5. **Token Configuration**: Add optional claims if needed (email, name)

### Authentication Flow
- Frontend uses MSAL React to authenticate users via popup or redirect
- Backend validates JWT tokens from External ID using Microsoft.Identity.Web
- Protected endpoints require `[Authorize]` attribute
- User info available via `ClaimsPrincipalExtensions` helper methods
- CORS is configured to allow the React frontend to call the API

### Key Integration Points
1. **Token Acquisition**: Frontend uses `useAuthApi` hook to get access tokens
2. **API Calls**: Include bearer token in Authorization header
3. **Protected Routes**: Use `AuthWrapper` component to protect React routes
4. **User Context**: Access user info via MSAL's account object

### Testing Authentication
1. Ensure both frontend and backend are running
2. Click login button in React app
3. Complete External ID sign-in flow
4. Token should be automatically included in API requests
5. Check Swagger UI with bearer token for testing protected endpoints