# Noise-Canceling Mat Quote Calculator

## Overview

This is a quotation tool for noise-canceling floor mat installations, targeted at the Korean market (specifically for Lotte Hi-Mart Ansan Seonbu branch). The application calculates pricing based on apartment type, size range, and installation area coverage. It's a utility-focused single-page application built with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful endpoints under `/api` prefix
- **Development**: Hot module replacement via Vite middleware
- **Production**: Static file serving from `dist/public`

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/ui/  # shadcn/ui components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and query client
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   └── static.ts     # Static file serving
├── shared/           # Shared types and schemas
│   └── schema.ts     # Zod schemas and TypeScript types
```

### Data Flow
- Quote calculations are performed server-side via POST to `/api/quote`
- Client sends apartment type, size range, and installation area
- Server returns calculated sheets, base price, and total price
- No persistent storage required - all calculations are stateless

### Design System
- Korean-optimized typography using Noto Sans KR
- Material Design-inspired clean interface
- Single-column centered layout (max-w-3xl)
- Light/dark mode support via CSS variables

## External Dependencies

### Database
- **Drizzle ORM** configured with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts`
- **Migrations**: `./migrations` directory
- Currently the app doesn't require database operations (stateless calculator)

### Third-Party Services
- **Google Fonts**: Noto Sans KR font family
- **Replit Plugins**: Dev banner, cartographer, and runtime error overlay for development

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `zod`: Schema validation for API requests
- `drizzle-orm` / `drizzle-zod`: Database ORM (prepared but not actively used)
- `connect-pg-simple`: PostgreSQL session store (available if needed)
- Full shadcn/ui component set via Radix UI primitives