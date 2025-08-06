# Express TypeScript Backend

This is a simple Express backend project written in TypeScript. It provides basic CRUD operations for users and reads initial data from a JSON file.

## Requirements

- Node.js (v18 or newer recommended)
- npm (v9 or newer recommended)

## Dependencies

- express
- body-parser
- dotenv

## Dev Dependencies

- typescript
- ts-node
- nodemon
- eslint
- prettier
- @types/express
- @types/node

## Project Structure

```
backend/
├── json/
│   └── data.json
├── src/
│   └── server.ts
├── package.json
├── tsconfig.json
```

## Setup Instructions

1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd backend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the root directory (optional).
   - Example:
     ```env
     PORT=2000
     ```

4. **Build the project**
   ```sh
   npm run build
   ```

## Running the Project

- **Development mode (with auto-reload):**
  ```sh
  npm run dev
  ```

- **Production mode:**
  ```sh
  npm run build
  npm start
  ```

## Linting

To check code style and errors:
```sh
npm run lint
```

## API Endpoints

- `GET /` — Welcome message
- `GET /users` — Get all users (reads from `json/data.json`)
- `GET /users/:id` — Get user by ID
- `POST /users` — Create a new user
- `PATCH /users/:id` — Update a user
- `DELETE /users/:id` — Delete a user

## Notes
- The server uses in-memory storage for new users and reads initial data from `json/data.json`.
- Logging middleware is enabled for all requests.
- You can customize the port using the `PORT` environment variable.

---

Author: purwadhika
License: ISC
