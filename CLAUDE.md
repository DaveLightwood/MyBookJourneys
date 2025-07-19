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