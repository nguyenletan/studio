# ItemDrop - Fantasy Game Item Marketplace

This is a Next.js starter project for a fantasy game item marketplace, built with Firebase Studio. It uses Next.js, React, ShadCN UI components, Tailwind CSS, Prisma for database interaction with PostgreSQL, and Genkit for AI features.

## Getting Started

Follow these steps to get your local development environment set up and running.

### 1. Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   Access to a PostgreSQL database

### 2. Clone the Repository

If you haven't already, clone this repository to your local machine.

### 3. Set Up Environment Variables

You'll need to configure your database connection.

1.  Create a `.env` file in the root of the project by copying the example:
    ```bash
    cp .env.example .env
    ```
    If `.env.example` doesn't exist, simply create a new file named `.env`.

2.  Add your PostgreSQL database connection string to the `.env` file. It should look something like this:
    ```env
    DATABASE_URL="prisma+postgres://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT/YOUR_DATABASE?api_key=YOUR_PRISMA_ACCELERATE_API_KEY"
    ```
    Replace `YOUR_USER`, `YOUR_PASSWORD`, `YOUR_HOST`, `YOUR_PORT`, `YOUR_DATABASE`, and `YOUR_PRISMA_ACCELERATE_API_KEY` with your actual PostgreSQL and Prisma Accelerate details.

    The admin panel also has default credentials which can be overridden via environment variables:
    ```env
    ADMIN_USERNAME=your_admin_username
    ADMIN_PASSWORD=your_admin_password
    ```
    If these are not set, it will default to `admin` and `password123`.

### 4. Install Dependencies

Install the project dependencies using npm or yarn:

```bash
npm install
```
or
```bash
yarn install
```

### 5. Set Up the Database

Prisma is used to manage the database schema and data.

1.  **Run Migrations**: This command will create the necessary tables in your database based on the `prisma/schema.prisma` file.
    ```bash
    npx prisma migrate dev --name init_items
    ```
    When prompted, give your migration a name (e.g., `init_items`).

2.  **Seed the Database**: This command will populate your database with initial item data, as defined in `prisma/seed.ts`.
    ```bash
    npx prisma db seed
    ```

### 6. Run the Development Servers

This project requires two development servers to run concurrently: one for the Next.js application and one for Genkit (for AI functionalities).

1.  **Start the Next.js Development Server**:
    Open a terminal window and run:
    ```bash
    npm run dev
    ```
    This will typically start the Next.js app on `http://localhost:9002`.

2.  **Start the Genkit Development Server**:
    Open a *new* terminal window and run:
    ```bash
    npm run genkit:dev
    ```
    This will start the Genkit development server, usually on `http://localhost:3400`. You can monitor Genkit flows and traces here.

### 7. Access the Application

*   **Public Site**: Open your browser and navigate to `http://localhost:9002`.
*   **Admin Panel**: Navigate to `http://localhost:9002/admin`.
    *   Default login:
        *   Username: `admin`
        *   Password: `password123`
        (Unless you've set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in your `.env` file).
*   **Genkit UI**: Access the Genkit development UI at `http://localhost:3400` (or the port shown in the Genkit server output).

## Available Scripts

*   `npm run dev`: Starts the Next.js development server with Turbopack.
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server with watch mode.
*   `npm run build`: Builds the Next.js application for production.
*   `npm run start`: Starts the Next.js production server.
*   `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
*   `npm run typecheck`: Runs TypeScript type checking.
*   `npx prisma migrate dev`: Applies database migrations.
*   `npx prisma db seed`: Seeds the database.
*   `npx prisma studio`: Opens Prisma Studio to view and manage your database.

## Project Structure

*   `src/app/`: Main application code (App Router).
    *   `src/app/admin/`: Admin panel routes and components.
    *   `src/app/item/[id]/`: Item detail page.
    *   `src/app/api/`: API routes (if any).
*   `src/ai/`: Genkit related code.
    *   `src/ai/flows/`: Genkit flows for AI functionalities.
*   `src/components/`: Shared React components.
    *   `src/components/admin/`: Components specific to the admin panel.
    *   `src/components/shared/`: Components used across both public and admin sections.
    *   `src/components/ui/`: ShadCN UI components.
*   `src/hooks/`: Custom React hooks.
*   `src/lib/`: Core application logic, utilities, and data access.
    *   `src/lib/actions.ts`: Server Actions for form submissions and mutations.
    *   `src/lib/auth.ts`: Authentication logic for the admin panel.
    *   `src/lib/data.ts`: Data fetching and manipulation logic (using Prisma).
    *   `src/lib/prisma.ts`: Prisma Client initialization.
*   `prisma/`: Prisma schema, migrations, and seed script.
*   `public/`: Static assets.

## Technology Stack

*   **Framework**: Next.js (App Router)
*   **UI**: React, ShadCN UI, Tailwind CSS
*   **Database ORM**: Prisma
*   **Database**: PostgreSQL (configurable)
*   **AI Integration**: Genkit (via Google AI / Gemini)
*   **Styling**: Tailwind CSS, CSS Variables
*   **Language**: TypeScript

Happy coding!
