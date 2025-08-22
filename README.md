# Express TypeScript

This is a comprehensive Express backend project written in TypeScript with authentication, database integration, and modular architecture. It provides CRUD operations for users and articles with proper error handling, validation, and middleware support.

## Requirements

- Node.js (v18 or newer recommended)
- npm (v9 or newer recommended)
- PostgreSQL database

## Dependencies

- express
- body-parser
- dotenv
- prisma
- yup (validation)
- jsonwebtoken
- crypto (password hashing)
- cloudinary (image upload and management)
- multer (file upload middleware)
- mkdirp (directory creation)

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
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── lib/
│   │   ├── constant/
│   │   │   └── http-response.ts
│   │   ├── middleware/
│   │   │   ├── auth-handler.ts
│   │   │   ├── error-handler.ts
│   │   │   ├── request-logger.ts
│   │   │   ├── uploader.ts
│   │   │   ├── runner.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── create-handler.ts
│   │   │   ├── create-router.ts
│   │   │   ├── custom-error.ts
│   │   │   ├── response-handler.ts
│   │   │   ├── json-handler.ts
│   │   │   ├── jwt.ts
│   │   │   ├── pass-crypt.ts
│   │   │   └── index.ts
│   │   ├── cloudinary.ts
│   │   └── prisma.ts
│   ├── routers/
│   │   ├── article/
│   │   │   ├── article.handler.ts
│   │   │   ├── article.service.ts
│   │   │   ├── article.validation.ts
│   │   │   └── index.article.route.ts
│   │   ├── auth/
│   │   │   ├── auth.handler.ts
│   │   │   ├── auth.validation.ts
│   │   │   └── index.auth.route.ts
│   │   └── user/
│   │       ├── user.handler.ts
│   │       ├── user.validation.ts
│   │       └── index.user.route.ts
│   ├── app.ts
│   ├── env.ts
│   └── server.ts
├── package.json
├── tsconfig.json
└── .env
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

### Authentication Endpoints

| Method | Endpoint             | Description                  | Auth Required |
| ------ | -------------------- | ---------------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user          | No            |
| POST   | `/api/auth/login`    | Login user and get JWT token | No            |

**Register Example:**

```json
POST /api/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Login Example:**

```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### User Endpoints

| Method | Endpoint                        | Description               | Auth Required |
| ------ | ------------------------------- | ------------------------- | ------------- |
| GET    | `/api/users`                    | Get all active users      | Admin         |
| GET    | `/api/users/:uid`               | Get user by UID           | User          |
| PATCH  | `/api/users/:uid`               | Update user by UID        | Admin         |
| DELETE | `/api/users/:uid`               | Soft delete user by UID   | Admin         |
| PATCH  | `/api/users/:uid/profile/image` | Update user profile image | User          |

**Update User Profile Image Example:**

```bash
# Using curl to upload an image file
curl -X PATCH \
  http://localhost:3000/api/users/user-uuid-here/profile/image \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/your/image.jpg"
```

**Response:**

```json
{
  "success": true,
  "message": "Updated successfully",
  "data": {
    "image": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/images/abc123.jpg"
  }
}
```

### Article Endpoints

| Method | Endpoint            | Description                | Auth Required |
| ------ | ------------------- | -------------------------- | ------------- |
| GET    | `/api/articles`     | Get all published articles | User          |
| GET    | `/api/articles/:id` | Get article by ID          | User          |
| POST   | `/api/articles`     | Create new article         | Admin         |
| DELETE | `/api/articles/:id` | Soft delete article        | Admin         |

**Create Article Example:**

```json
POST /api/articles
Authorization: Bearer <jwt_token>
{
  "title": "My Article Title",
  "content": "Article content here...",
  "authorId": "user-uuid-here"
}
```

### Response Format

All API responses follow a consistent format:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* response data */
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message",
  "details": "Detailed error information"
}
```

## Custom Utilities Documentation

### Create Handler Utility

The `createHandler` utility provides a standardized way to create Express route handlers with automatic error handling and access to common utilities. It wraps your handler function with try-catch logic and provides utility objects as parameters.

**Location:** `src/lib/utils/create-handler.ts`

**Usage Example:**

```typescript
import { createHandler } from "@/lib/utils";
import { CreateArticleSchema } from "./article.validation";

export const createArticle = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
    // Input validation
    await CreateArticleSchema.validate(req.body, { abortEarly: false });

    // Business logic
    const newArticle = await ArticleService.create(req.body);

    // Response
    res
      .status(HttpRes.status.CREATED)
      .json(ResponseHandler.success(HttpRes.message.CREATED, newArticle));
  },
);
```

**Benefits:**

- Automatic error handling with try-catch
- Access to utility objects (CustomError, ResponseHandler, HttpRes)
- Consistent error propagation to global error handler
- Cleaner, more readable handler code

### Custom Response Handler

Use the `ResponseHandler` class to standardize API responses. It ensures all responses have a consistent structure for both success and error cases.

**Location:** `src/lib/utils/response-handler.ts`

**Success Example:**

```typescript
import { ResponseHandler } from "@/lib/utils";
import { HttpRes } from "@/lib/constant/http-response";

// In a controller:
res.status(HttpRes.status.OK).json(
  ResponseHandler.success(HttpRes.message.OK, {
    id: 1,
    title: "Sample Article",
  }),
);
```

**Error Example:**

```typescript
import { ResponseHandler } from "@/lib/utils";
import { HttpRes } from "@/lib/constant/http-response";

// In an error handler:
res
  .status(HttpRes.status.BAD_REQUEST)
  .json(
    ResponseHandler.error(
      HttpRes.message.BAD_REQUEST,
      HttpRes.details.BAD_REQUEST,
    ),
  );
```

### Create Router Utility

The `createRouter` utility provides a simple wrapper around Express Router for consistent router creation.

**Location:** `src/lib/utils/create-router.ts`

**Usage Example:**

```typescript
import { createRouter } from "@/lib/utils";
import { authUser, authAdmin } from "@/lib/middleware";
import ArticleController from "./article.handler";

const articleRouter = createRouter();

articleRouter.get("/articles", authUser, ArticleController.getArticles);
articleRouter.post("/articles", authAdmin, ArticleController.createArticle);

export default articleRouter;
```

### Custom Error Utility

The `CustomError` class provides a standardized way to create and throw custom errors with status codes and details.

**Location:** `src/lib/utils/custom-error.ts`

**Usage Example:**

```typescript
import { CustomError } from "@/lib/utils";
import { HttpRes } from "@/lib/constant/http-response";

// Throw a custom error
if (!user) {
  throw new CustomError(
    HttpRes.status.NOT_FOUND,
    HttpRes.message.NOT_FOUND,
    "User not found",
  );
}

// In a try-catch block
try {
  // Some operation
} catch (error) {
  next(error); // Pass to global error handler
}
```

### JWT Utilities

JWT utilities provide token generation and verification functionality.

**Location:** `src/lib/utils/jwt.ts`

**Usage Example:**

```typescript
import { generateToken, verifyToken } from "@/lib/utils";

// Generate a token
const token = generateToken({ uid: user.uid, role: user.role });

// Verify a token
try {
  const payload = verifyToken(token);
  console.log(payload); // { uid: "...", role: "..." }
} catch (error) {
  // Invalid token
}
```

### Password Cryptography Utilities

Password utilities provide secure password hashing and verification.

**Location:** `src/lib/utils/pass-crypt.ts`

**Usage Example:**

```typescript
import { generateSalt, hashPassword, verifyPassword } from "@/lib/utils";

// Hash a password
const salt = generateSalt();
const hashedPassword = await hashPassword("userPassword", salt);

// Verify a password
const isValid = await verifyPassword("userPassword", salt, hashedPassword);
console.log(isValid); // true or false
```

## Middleware Documentation

### Authentication Middleware

The authentication middleware provides JWT-based authentication and authorization for protected routes.

**Location:** `src/lib/middleware/auth-handler.ts`

**Available Middleware:**

- `authUser`: Requires valid JWT token (any authenticated user)
- `authAdmin`: Requires valid JWT token with admin role

**Usage Example:**

```typescript
import { authUser, authAdmin } from "@/lib/middleware";
import { createRouter } from "@/lib/utils";

const router = createRouter();

// Protected route - any authenticated user
router.get("/profile", authUser, getUserProfile);

// Admin-only route
router.delete("/users/:id", authAdmin, deleteUser);
```

**Custom Request Type:**

The middleware adds a `user` property to the request object:

```typescript
import { CustomRequest } from "@/lib/middleware";

// In your handler (when using auth middleware)
const handler = (req: Request, res: Response) => {
  const user = (req as CustomRequest).user; // { uid: string, role: string }
};
```

### Error Handler Middleware

Global error handling middleware that catches and formats all errors consistently.

**Location:** `src/lib/middleware/error-handler.ts`

**Features:**

- Handles `CustomError` instances
- Handles Yup validation errors
- Formats responses using `ResponseHandler`
- Logs errors for debugging

**Usage Example:**

```typescript
import { errorMiddleware } from "@/lib/middleware";
import express from "express";

const app = express();

// Add routes here...

// Error handler should be the last middleware
app.use(errorMiddleware);
```

### Request Logger Middleware

Logs incoming requests for debugging and monitoring purposes.

**Location:** `src/lib/middleware/request-logger.ts`

**Usage Example:**

```typescript
import { requestLogger } from "@/lib/middleware";
import express from "express";

const app = express();

// Add request logging
app.use(requestLogger);

// Add other middleware and routes...
```

### File Upload Middleware

The file upload middleware provides functionality for uploading files to local disk or cloud storage (Cloudinary). It uses Multer for handling multipart/form-data and provides two main upload strategies.

**Location:** `src/lib/middleware/uploader.ts`

**Available Upload Functions:**

- `uploadToLocalDisk(fieldName, relativePath)`: Uploads files to local disk storage
- `uploadToCloudinary(fieldName)`: Uploads files to Cloudinary cloud storage

**Usage Example - Local Disk Upload:**

```typescript
import { uploadToLocalDisk } from "@/lib/middleware";
import { createRouter } from "@/lib/utils";

const router = createRouter();

// Upload to local disk
router.post("/upload", async (req, res) => {
  const upload = uploadToLocalDisk("image", "../../../uploads");
  await upload(req, res);

  // File is now available at req.file
  const file = req.file as DiskFile;
  console.log(file.path); // Path to uploaded file
});
```

**Usage Example - Cloudinary Upload:**

```typescript
import {
  uploadToCloudinary,
  type CustomRequestWithCloudinary,
} from "@/lib/middleware";
import { createHandler } from "@/lib/utils";

export const uploadProfileImage = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
    // Upload to Cloudinary
    const upload = uploadToCloudinary("image");
    await upload(req, res);

    // Access Cloudinary response
    const cloudinaryData = (req as CustomRequestWithCloudinary).cloudinary;
    console.log(cloudinaryData.secure_url); // Public URL of uploaded image
    console.log(cloudinaryData.public_id); // Cloudinary public ID

    res.status(HttpRes.status.OK).json(
      ResponseHandler.success(HttpRes.message.UPDATED, {
        imageUrl: cloudinaryData.secure_url,
      }),
    );
  },
);
```

**File Types and Interfaces:**

```typescript
// Base file interface
type File = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
};

// Disk storage file (includes path information)
type DiskFile = File & {
  destination: string;
  filename: string;
  path: string;
};

// Memory storage file (includes buffer)
type MemoryFile = File & {
  buffer: Buffer;
};

// Request with file attached
type CustomRequestWithFile<T extends MemoryFile | DiskFile> = Request & {
  file: T;
};

// Request with Cloudinary response
type CustomRequestWithCloudinary = Request & {
  cloudinary: UploadApiResponse;
};
```

**Features:**

- **Local Disk Storage**: Automatically creates destination directories, generates unique filenames with timestamps
- **Cloudinary Integration**: Converts files to base64 and uploads to Cloudinary with automatic folder organization
- **Error Handling**: Throws CustomError when file upload fails or no file is provided
- **Type Safety**: Provides TypeScript interfaces for different file types and request objects
- **Middleware Runner**: Uses `runMiddleware` utility to promisify Multer middleware

### Cloudinary Configuration

The Cloudinary service provides cloud-based image and video management. The configuration is centralized in a single file that sets up the Cloudinary SDK with environment variables.

**Location:** `src/lib/cloudinary.ts`

**Configuration Example:**

```typescript
import cloudinary from "cloudinary";
import env from "@/env";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUD_API_KEY,
  api_secret: env.CLOUD_API_SECRET,
});

export default cloudinary.v2;
```

**Usage in Upload Middleware:**

The Cloudinary configuration is automatically used by the upload middleware. Files are uploaded to the "images" folder by default with the following settings:

- **Folder**: `images/`
- **Resource Type**: `image`
- **Format**: Maintains original format or converts as needed
- **Public ID**: Auto-generated unique identifier

**Usage in Handlers:**

```typescript
import cloudinary from "@/lib/cloudinary";

// Delete an image from Cloudinary
await cloudinary.uploader.destroy(publicId);

// Upload with custom options
const result = await cloudinary.uploader.upload(dataURI, {
  folder: "profile-images",
  resource_type: "image",
  transformation: [{ width: 300, height: 300, crop: "fill" }],
});
```

### Custom JSON Handler

Use the `JSONHandler` utility to read and write JSON files asynchronously. This is useful for working with data files in your project.

**Location:** `src/lib/utils/json-handler.ts`

**Read Example:**

```typescript
import { JSONHandler } from "@/lib/utils";

const data = await JSONHandler.read("../../json/data.json");
console.log(data);
```

**Write Example:**

```typescript
import { JSONHandler } from "@/lib/utils";

await JSONHandler.write("../../json/data.json", { users: [] });
```

## Architecture Overview

### Layered Architecture

The project follows a layered architecture pattern:

1. **Routes Layer** (`src/routers/`): Defines API endpoints and applies middleware
2. **Handler Layer** (`src/routers/*/handler.ts`): Processes requests and responses
3. **Service Layer** (`src/routers/*/service.ts`): Contains business logic
4. **Validation Layer** (`src/routers/*/validation.ts`): Input validation schemas
5. **Database Layer** (`src/lib/prisma.ts`): Database access and queries

### Key Design Patterns

- **Handler Factory Pattern**: Using `createHandler` for consistent error handling
- **Middleware Pattern**: Modular authentication and error handling
- **Repository Pattern**: Database operations abstracted through Prisma
- **Validation Pattern**: Centralized input validation using Yup schemas

### Example Implementation Flow

```typescript
// 1. Route Definition
router.post("/articles", authAdmin, ArticleController.createArticle);

// 2. Handler with createHandler wrapper
export const createArticle = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
    // 3. Validation
    await CreateArticleSchema.validate(req.body);

    // 4. Service call
    const article = await ArticleService.create(req.body);

    // 5. Response
    res
      .status(HttpRes.status.CREATED)
      .json(ResponseHandler.success(HttpRes.message.CREATED, article));
  },
);
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key"

# Email Configuration (for notifications and password reset)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-gmail-app-password"

# Cloudinary Configuration (for image upload and management)
CLOUD_NAME="your-cloudinary-cloud-name"
CLOUD_API_KEY="your-cloudinary-api-key"
CLOUD_API_SECRET="your-cloudinary-api-secret"
```

### Environment Variables Description

| Variable             | Description                               | Required                  | Example                                    |
| -------------------- | ----------------------------------------- | ------------------------- | ------------------------------------------ |
| `PORT`               | Server port number                        | No (default: 2000)        | `3000`                                     |
| `NODE_ENV`           | Environment mode                          | No (default: development) | `production`                               |
| `DATABASE_URL`       | PostgreSQL connection string              | Yes                       | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET`         | Secret key for JWT token signing          | Yes                       | `your-super-secret-key-here`               |
| `GMAIL_USER`         | Gmail address for sending emails          | Yes                       | `your-app@gmail.com`                       |
| `GMAIL_APP_PASSWORD` | Gmail app password (not regular password) | Yes                       | `abcd efgh ijkl mnop`                      |
| `CLOUD_NAME`         | Cloudinary cloud name                     | Yes                       | `your-cloud-name`                          |
| `CLOUD_API_KEY`      | Cloudinary API key                        | Yes                       | `123456789012345`                          |
| `CLOUD_API_SECRET`   | Cloudinary API secret                     | Yes                       | `your-api-secret-here`                     |

### Setting up Gmail App Password

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings → Security → 2-Step Verification
3. Generate an "App Password" for this application
4. Use the generated 16-character password as `GMAIL_APP_PASSWORD`

### Setting up Cloudinary

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard to find your credentials:
   - **Cloud Name**: Found in the dashboard URL and account details
   - **API Key**: Found in the "Account Details" section
   - **API Secret**: Found in the "Account Details" section (click "Reveal")
3. Add these credentials to your `.env` file

## Database Setup

1. **Install Prisma CLI:**

   ```sh
   npm install -g prisma
   ```

2. **Generate Prisma Client:**

   ```sh
   npx prisma generate
   ```

3. **Run Database Migrations:**

   ```sh
   npx prisma migrate dev
   ```

4. **Seed Database (Optional):**
   ```sh
   npx prisma db seed
   ```

## Notes

- The server uses PostgreSQL database with Prisma ORM
- JWT-based authentication with role-based authorization
- Comprehensive error handling and logging
- Input validation using Yup schemas
- Modular architecture with separation of concerns
- TypeScript for type safety and better development experience
- File upload support with both local disk and Cloudinary cloud storage
- Email integration using Gmail SMTP for notifications
- Image management with automatic cleanup and optimization via Cloudinary

---

**Author:** alee0510 |
**License:** ISC
