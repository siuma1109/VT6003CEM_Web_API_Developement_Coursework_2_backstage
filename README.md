# Backstage Web API Development

This is a TypeScript-based RESTful API project built with Express.js and PostgreSQL. The project follows a structured architecture with clear separation of concerns.

## Project Structure

```
.
├── code/                    # Main application code
│   ├── src/                # Source code
│   │   ├── configs/        # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── migrations/     # Database migrations
│   │   ├── models/         # Database models
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API routes
│   │   ├── seeders/        # Database seeders
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── uploads/            # File upload directory
│   └── package.json        # Project dependencies and scripts
├── docker-compose.yaml     # Docker configuration
└── .gitignore             # Git ignore file
```

## Prerequisites

- Node.js (Latest LTS version)
- Docker and Docker Compose
- PostgreSQL (if running locally)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Environment Setup:
   - Copy `.env.example` to `.env` in the code directory
   - Configure the following environment variables:
     ```
     DB_USERNAME=your_db_username
     DB_PASSWORD=your_db_password
     DB_NAME=your_db_name
     DB_HOST=your_db_host
     DB_PORT=your_db_port
     ```
   - For development, you can use these default values:
     ```
     DB_USERNAME=postgres
     DB_PASSWORD=postgres
     DB_NAME=backstage
     DB_HOST=localhost
     DB_PORT=5432
     ```

3. Using Docker (Recommended):
   ```bash
   docker-compose up -d
   ```
   This will:
   - Start a PostgreSQL database
   - Build and run the Node.js application
   - Set up the database with migrations
   - Start the development server

4. Manual Setup:
   ```bash
   cd code
   npm install
   npm run build
   npm run migrate
   npm run dev
   ```

## Database Setup

### Migrations
The project includes several migrations that create the following tables:
- Users (with avatar support)
- Roles
- User Roles
- User Tokens
- Hotels
- User Favorites
- Chat Rooms and Messages
- Sign-up Codes

To manage the database:

```bash
# Run all migrations
npm run migrate

# Undo the last migration
npm run migrate:undo

# Undo all migrations
npm run migrate:undo:all
```

### Seeding
To populate the database with initial data:

```bash
# Run all seeders
npm run seed

# Undo the last seed
npm run seed:undo

# Undo all seeds
npm run seed:undo:all
```

## Available Scripts

- `npm start` - Run the production server
- `npm run dev` - Run the development server with hot-reload
- `npm run build` - Build the TypeScript code
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo the last migration
- `npm run migrate:undo:all` - Undo all migrations
- `npm run seed` - Seed the database with initial data
- `npm run seed:undo` - Undo the last seed
- `npm run seed:undo:all` - Undo all seeds

## Environment Variables

The application uses the following environment variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 8081)
- `DB_USERNAME` - PostgreSQL username
- `DB_PASSWORD` - PostgreSQL password
- `DB_NAME` - PostgreSQL database name
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port

## API Documentation

The API documentation is available through Swagger UI when the application is running. Access it at:

```
http://localhost:8081/api-docs
```

## Technologies Used

- TypeScript
- Express.js
- PostgreSQL
- Sequelize ORM
- Docker
- Passport.js (Authentication)
- Multer (File uploads)
- Swagger UI (API documentation)
- Faker.js (for seeding data)

## Development

The project uses TypeScript for type safety and better development experience. The codebase follows a modular architecture with:

- Controllers for handling HTTP requests
- Services for business logic
- Repositories for data access
- Models for database schema
- Routes for API endpoints

## License

ISC 