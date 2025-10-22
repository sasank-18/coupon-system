# Samurai-Assignment Turborepo

This Turborepo project is a monorepo for multiple apps and packages maintained by your team.

## Overview

This repository contains the following applications and packages:

### Apps
- `admin-portal`: Admin panel application (Next.js / React)
- `user-portal`: User-facing portal application (Next.js / React)
- `backend`: Backend server (Node.js / Express / Prisma)

### Packages
- `@repo/ui`: Shared React component library
- `@repo/eslint-config`: ESLint configurations
- `@repo/typescript-config`: Shared TypeScript configurations

### Utilities
- TypeScript for type checking
- ESLint for linting
- Prettier for formatting
- Turbo for orchestrating builds and tasks across the monorepo

---

## Setup

1. Clone the repository:

```bash
git clone <repo-url>
cd Samurai-assignment
cd Samurai-assignment/apps/backend
npx prisma generate
cd ../..
pnpm install
pnpm run build
```
```bash
Develop all apps
pnpm run dev
```
```bash
run build file in root folder
pnpm run start 
```