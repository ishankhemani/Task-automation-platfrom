# Coding Standards
# CODING STANDARDS

Version: 1.0

Project:
Task Automation & Job Processing Platform

---

# Purpose

This document defines the coding standards, architecture principles, naming conventions, performance guidelines, and engineering best practices for the Task Automation & Job Processing Platform.

Every developer and AI assistant contributing to this project must follow these standards consistently.

---

# General Principles

The codebase must follow:

- SOLID Principles
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- Separation of Concerns
- Clean Architecture
- Feature-Based Architecture
- Composition over Inheritance
- Single Responsibility Principle

The code should always prioritize readability, maintainability, scalability, and testability.

---

# Project Architecture

Frontend Architecture:

Feature-based modular architecture.

Each feature contains:

- Components
- Hooks
- API
- Types
- Services
- State
- Utilities

Backend Architecture:

Routes

↓

Controllers

↓

Services

↓

Repositories

↓

Database (Prisma)

Business logic must never exist inside controllers or routes.

---

# React Standards

Use:

- Functional Components
- React Hooks
- Custom Hooks
- React Router
- Lazy Loading
- Error Boundaries

Avoid:

- Class Components
- Prop Drilling
- Deeply Nested Components
- Unnecessary Re-renders

---

# Component Design

Components should follow:

- Single Responsibility
- Small & Reusable
- Typed Props
- No Business Logic in UI Components
- Memoization where appropriate

Maximum recommended file size:

300 lines

---

# Folder Structure

Each feature follows:

feature/

components/

hooks/

services/

api/

types/

utils/

store/

Keep related files together.

---

# Naming Conventions

Components:

PascalCase

Example:

TaskCard.tsx

Hooks:

camelCase starting with use

Example:

useTasks.ts

Utilities:

camelCase

Example:

formatDate.ts

Types:

PascalCase

Example:

TaskResponse.ts

Constants:

UPPER_SNAKE_CASE

Example:

MAX_RETRY_COUNT

---

# TypeScript Rules

Never use:

any

Prefer:

unknown

or proper interfaces.

Always define:

- Interfaces
- Enums
- Types

Strict mode must remain enabled.

---

# API Layer

All API calls must go through a centralized API client.

Never call Axios directly inside components.

Structure:

Component

↓

Hook

↓

API Service

↓

Axios Client

↓

Backend

---

# State Management

Use Redux Toolkit for:

- Authentication
- User Preferences
- Global UI State

Use TanStack Query for:

- Server Data
- API Caching
- Background Refetching

Do not duplicate server state inside Redux.

---

# Forms

Use:

React Hook Form

+

Zod Validation

Validation should exist on both client and server.

---

# Error Handling

Every async function must implement proper error handling.

Never swallow errors silently.

Frontend:

Display user-friendly messages.

Backend:

Return structured error responses.

---

# Logging

Backend logging:

Winston

Levels:

- Error
- Warn
- Info
- Debug

Frontend:

Use console only during development.

Remove unnecessary logs before production.

---

# Performance

Optimize:

- Lazy Loading
- Memoization
- Code Splitting
- Virtual Lists
- Image Optimization
- Debounced Search

Avoid unnecessary renders.

---

# Security

Never expose:

- Secrets
- Tokens
- Passwords
- Environment Variables

Always validate:

- Inputs
- Authorization
- Authentication

---

# Accessibility

Every interactive component must support:

- Keyboard Navigation
- Focus States
- ARIA Labels
- Proper Contrast
- Screen Readers

---

# Styling Standards

Use:

Tailwind CSS

+

shadcn/ui

Avoid inline styles.

Maintain consistent spacing.

Support:

- Light Mode
- Dark Mode

---

# Git Standards

Commit Messages:

feat:

fix:

refactor:

docs:

style:

test:

chore:

Example:

feat(auth): implement JWT authentication

---

# Documentation

Every major feature should include:

- Purpose
- API Usage
- Important Notes

Complex functions should include meaningful comments where necessary.

---

# Testing Standards

Test:

- Services
- Hooks
- API
- Utilities

Critical user flows should have integration and end-to-end tests.

---

# Code Review Checklist

Before merging:

- Builds successfully
- TypeScript passes
- ESLint passes
- Responsive UI verified
- Accessibility checked
- No unused imports
- No console logs
- Error handling implemented
- Loading states included
- Empty states included

---

# Definition of Done

A feature is complete only if:

- Requirements implemented
- Responsive
- Accessible
- Tested
- Documented
- Production-ready
- Follows project architecture
- Follows UI guidelines
- Follows coding standards

---

# Final Rule

Quality is more important than speed.

Every implementation should be production-ready, maintainable, scalable, secure, and consistent with the architecture defined in PROJECT_SPEC.md and UI_GUIDELINES.md.