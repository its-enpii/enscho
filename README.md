# Enscho - School Management System

**Enscho** is a comprehensive web-based school management system designed to streamline administrative tasks, enhance communication between stakeholders, and provide a modern digital presence for educational institutions.

## Overview

This project serves as a complete solution for school management, featuring a public-facing website, a robust admin panel for staff, and dedicated portals for students and alumni. It leverages modern web technologies to ensure performance, scalability, and a superior user experience.

## Features

- **Public Website:** A responsive and dynamic landing page showcasing school information, news, and events.
- **Admin Dashboard:** A powerful control panel for administrators to manage students, staff, academic records, and site content.
- **Student Dashboard:** A personalized space for students to view grades, schedules, and announcements.
- **Alumni Portal:** A dedicated section for alumni to stay connected and view relevant updates.
- **PDF Reporting:** Automated generation of academic reports and documents using `@react-pdf/renderer`.
- **Media Management:** Efficient handling of uploads and media assets.

## Technology Stack

This project is built using the following technologies:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication:** Custom implementation (using `bcryptjs` for security)
- **UI Components:** [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **Form Handling:** `react-hook-form` with `zod` validation

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- A database instance (PostgreSQL recommended)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd enscho
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and configure your environment variables (refer to `.env.example` if available, or set up your database URL).

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/enscho?schema=public"
    ```

4.  **Database Setup:**
    Run the Prisma migrations to set up your database schema.

    ```bash
    npx prisma migrate dev
    # or for rapid prototyping
    npx prisma db push
    ```

5.  **Seed Database (Optional):**
    If the project includes a seed script, you can populate the database with initial data.
    ```bash
    npx prisma db seed
    ```

### Running the Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Contains the application routes and page logic (App Router).
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions, database clients (Prisma), and shared constants.
- `src/actions`: Server actions for handling data mutations.
- `src/admin`: Admin panel specific components and logic.

## Deployment

To deploy the application to a production environment:

1.  **Build the application:**

    ```bash
    npm run build
    ```

    This command compiles the TypeScript code and optimizes the application for production.

2.  **Start the production server:**
    ```bash
    npm run start
    ```

### Hosting Options

- **Vercel:** The recommended platform for Next.js apps. Zero-configuration deployment.
- **VPS/Docker:** You can containerize the application using Docker or run it on a VPS using a process manager like PM2. Ensure your `DATABASE_URL` is correctly pointed to your production database.
