import exprress, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";
import dotenv from "dotenv";

// config dotenv
dotenv.config();

// setup express
const PORT = process.env.PORT || 2000;
const app: Application = exprress();

// setup middleware: body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup middleware: LOGGING
app.use((req: Request, res: Response, next: () => void) => {
  console.log(`${req.method}: ${req.url}`);
  next(); // Call next to continue to the next middleware or route handler
});

// setup middleware: CORS (Cross-Origin Resource Sharing)

// define root routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Express server!",
  });
});

// import user router
import userRouter from "./routers/user";

// use user router
app.use("/api", userRouter);

// // CRUD OPERATIONS
// const users: Array<{ id: string; name: string }> = [];

// // GET: all users
// // URL: /users?name=John -> /users?name=John or /users?page=1&limit=10
// // Query: none -> /users
// // Method: GET
// // Description: Retrieve all users
// app.get("/users", async (req: Request, res: Response) => {
//   // TODO: implement filtering by name
//   // READ JSON file from (json/data.json)
//   const RAW_DATA = await fs.readFile("json/data.json", "utf-8");
//   const DATA = JSON.parse(RAW_DATA);

//   res.status(200).json({
//     success: true,
//     message: "Users retrieved successfully",
//     data: DATA.users, // Use DATA.users if it exists, otherwise use the in-memory users array
//   });
// });

// // GET: single user
// // URL: /users/:id -> /users/1
// // URL Params: id (string)
// // Query: none -> /users/1?name=John
// // Method: GET
// // Description: Retrieve a user by ID
// app.get("/users/:id", (req: Request, res: Response) => {
//   const userId = req.params.id;
//   const user = users.find((user) => user.id === userId);

//   // Check if user exists
//   if (!user) {
//     return res.status(404).json({
//       success: false,
//       message: "User not found",
//       data: {},
//     });
//   }

//   res.status(200).json({
//     success: true,
//     message: "User retrieved successfully",
//     data: user,
//   });
// });

// // POST: register a new user
// // URL: /users
// // Body: { "name": "John Doe", "email": "", "password": "plain text" }
// // Method: POST
// // Description: Create a new user

// app.post("/users", async (req: Request, res: Response) => {
//   try {
//     // Validate request body -> Yup
//     await RegisterSchema.validate(req.body, { abortEarly: false });

//     // Check data validation on current JSON file (email & name unique)
//     const FILE_PATH = path.join(__dirname, "../json/data.json");
//     const RAW_DATA = await fs.readFile(FILE_PATH, "utf-8");
//     const DATA = JSON.parse(RAW_DATA);

//     // Check if email already exists
//     const existingUser = DATA.users.find(
//       (user: { email: string }) => user.email === req.body.email,
//     );
//     if (existingUser) {
//       throw new Error("Email already exists");
//     }

//     // create new user -> provide UID, plain text password, set createdAt and updatedAt
//     const newUser = {
//       id: crypto.randomUUID(),
//       name: req.body.name,
//       email: req.body.email,
//       password: req.body.password, // In a real application, hash the password before saving
//       actice: true, // Default status true
//       role: "user", // Default role
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     // update JSON file (json/data.json)
//     DATA.users.push(newUser);
//     await fs.writeFile("json/data.json", JSON.stringify(DATA, null, 2));

//     // Respond with success
//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       data: newUser,
//     });
//   } catch (error) {
//     if (error instanceof Yup.ValidationError) {
//       return res.status(400).json({
//         success: false,
//         message: "Validation error",
//         errors: error.errors,
//       });
//     } else if (error instanceof Error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//         data: {},
//       });
//     }
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       data: {},
//     });
//   }
//   // users.push({
//   //   id: crypto.randomUUID(),
//   //   name: req.body.name,
//   // });

//   // res.status(201).json({
//   //   success: true,
//   //   message: "User created successfully",
//   //   data: users[users.length - 1],
//   // });
// });

// // PUT/PATCH: update a user
// app.patch("/users/:id", (req: Request, res: Response) => {
//   const userId = req.params.id;
//   const userIndex = users.findIndex((user) => user.id === userId);

//   // Check if user exists
//   if (userIndex === -1) {
//     return res.status(404).json({
//       success: false,
//       message: "User not found",
//       data: {},
//     });
//   }

//   // Update user
//   if (!req.body.name || req.body.name === "") {
//     return res.status(400).json({
//       success: false,
//       message: "Name is required to update user",
//       data: {},
//     });
//   }

//   users[userIndex].name = req.body.name;
//   res.status(200).json({
//     success: true,
//     message: "User updated successfully",
//     data: users[userIndex],
//   });
// });

// // DELETE: delete a user
// app.delete("/users/:id", (req: Request, res: Response) => {
//   const userId = req.params.id;
//   const userIndex = users.findIndex((user) => user.id === userId);

//   // Check if user exists
//   if (userIndex === -1) {
//     return res.status(404).json({
//       success: false,
//       message: "User not found",
//       data: {},
//     });
//   }

//   // Remove user
//   users.splice(userIndex, 1);
//   res.status(200).json({
//     success: true,
//     message: "User deleted successfully",
//     data: {},
//   });
// });

// running app
app.listen(PORT);
