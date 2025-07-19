# Live Polling System - Replit.md

## Overview

This is a full-stack live polling application that enables teachers to create real-time polls and students to participate and view results. The system uses WebSockets for real-time communication between teachers and students, providing an interactive classroom experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript running on Vite for fast development
- **UI Library**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Query (@tanstack/react-query) for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: Custom WebSocket hook for bidirectional communication

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Real-time**: WebSocket server using 'ws' library
- **Data Storage**: In-memory storage with interface for future database integration
- **API Structure**: RESTful endpoints with WebSocket overlay for real-time features

### Build System
- **Development**: Vite dev server with HMR (Hot Module Replacement)
- **Production**: Vite build + esbuild for server bundling
- **TypeScript**: Strict mode with path aliases for clean imports

## Key Components

### Real-time Communication
- WebSocket connection at `/ws` endpoint
- Automatic reconnection with exponential backoff
- Role-based message handling (teacher vs student)
- Live session tracking and poll state synchronization

### User Interface Components
- **Role Selection**: Initial screen for choosing teacher or student role
- **Teacher Interface**: Poll creation form with multiple choice options, duration settings, and correct answer selection
- **Student Interface**: Name entry, waiting room, poll participation, and results viewing
- **Live Results**: Real-time vote counting with visual progress bars and correct answer highlighting

### Data Models
- **Users**: Username/password authentication (prepared but not fully implemented)
- **Polls**: Questions with multiple choice options, duration, and active state
- **Responses**: Student submissions linked to polls
- **Sessions**: Active student connections for tracking participation

## Data Flow

### Poll Creation Flow
1. Teacher creates poll with question, options, duration, and correct answer
2. Poll data sent via WebSocket to all connected clients
3. Students receive poll notification and can participate
4. Real-time vote counting and result broadcasting

### Student Participation Flow
1. Student enters name and joins session
2. Receives active poll notifications via WebSocket
3. Submits vote which is immediately broadcast to all clients
4. Views live results with correct answer reveal

### Real-time Updates
- WebSocket messages for poll start/end events
- Live vote counting without page refreshes
- Session management for tracking active participants
- Automatic reconnection handling for network issues
- Real-time chat messaging between teachers and students

### Testing Instructions
To test the complete system:
1. Start as Teacher role and use "Quick Sample" button to create a poll
2. Open new browser tab/window and select Student role
3. Enter student name and participate in the poll
4. Test the chat functionality for communication
5. View live results with correct answer highlighting

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18 with hooks, React Query for server state
- **UI Components**: Radix UI primitives for accessibility and behavior
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Build Tools**: Vite with TypeScript support and Replit integration plugins

### Database Integration (Prepared)
- **Drizzle ORM**: Type-safe SQL query builder configured for PostgreSQL
- **Database Provider**: Neon serverless PostgreSQL (via @neondatabase/serverless)
- **Migration System**: Drizzle Kit for schema management

### Development Tools
- **Type Safety**: Zod for runtime validation with Drizzle integration
- **Date Handling**: date-fns for time-based operations
- **Utilities**: clsx and tailwind-merge for conditional styling

## Deployment Strategy

### Development Environment
- Vite dev server with Express.js backend
- WebSocket server running on same port as HTTP server
- Hot module replacement for frontend development
- TypeScript compilation with strict mode

### Production Build
- Frontend: Vite build outputting to `dist/public`
- Backend: esbuild bundle outputting to `dist/index.js`
- Static file serving from Express for SPA routing
- WebSocket server integrated with HTTP server

### Database Strategy
- Currently using in-memory storage for development
- Drizzle ORM and PostgreSQL configuration ready for production
- Schema migrations prepared in `migrations/` directory
- Environment variable configuration for database URL

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with shared types between client/server
2. **WebSocket Integration**: Real-time features essential for live polling experience
3. **Type Safety**: End-to-end TypeScript with shared schema validation
4. **Component Architecture**: Reusable UI components with consistent design system
5. **Storage Abstraction**: Interface-based storage allowing easy database migration
6. **Role-based UI**: Dynamic interface switching based on user role (teacher/student)

The system is designed for easy deployment to Replit with database integration ready for production scaling.
