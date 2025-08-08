import { Request, Response, NextFunction } from "express";
import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";
import { RegisterSchema, ValidationError } from "@/utils/validation";
import { CustomError } from "@/utils/custom-error";

const UsersController = {
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const FILE_PATH = path.join(__dirname, "../../json/data.json");
      const RAW_DATA = await fs.readFile(FILE_PATH, "utf-8");
      const DATA = JSON.parse(RAW_DATA);

      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: DATA.users,
      });
    } catch (error) {
      next(error);
    }
  },
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;

      // READ JSON file from (json/data.json)
      const FILE_PATH = path.join(__dirname, "../../json/data.json");
      const RAW_DATA = await fs.readFile(FILE_PATH, "utf-8");
      const DATA = JSON.parse(RAW_DATA);

      // Find user by ID
      const user = DATA.users.find(
        (user: { id: string }) => user.id === userId,
      );

      // Check if user exists
      if (!user) {
        throw new CustomError(404, "Not Found", "No user found with this ID");
      }

      res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body -> Yup
      await RegisterSchema.validate(req.body, { abortEarly: false });

      // Check data validation on current JSON file (email & name unique)
      const FILE_PATH = path.join(__dirname, "../../json/data.json");
      const RAW_DATA = await fs.readFile(FILE_PATH, "utf-8");
      const DATA = JSON.parse(RAW_DATA);

      // Check if email already exists
      const existingUser = DATA.users.find(
        (user: { email: string }) => user.email === req.body.email,
      );
      if (existingUser) {
        throw new CustomError(400, "Bad Request", "Email already exists");
      }

      // create new user -> provide UID, plain text password, set createdAt and updatedAt
      const newUser = {
        id: crypto.randomUUID(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password, // In a real application, hash the password before saving
        actice: true, // Default status true
        role: "user", // Default role
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // update JSON file (json/data.json)
      DATA.users.push(newUser);
      await fs.writeFile("json/data.json", JSON.stringify(DATA, null, 2));

      // Respond with success
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  },
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;

      // READ JSON file from (json/data.json)
      const FILE_PATH = path.join(__dirname, "../../json/data.json");
      const RAW_DATA = await fs.readFile(FILE_PATH, "utf-8");
      const DATA = JSON.parse(RAW_DATA);

      // Find user by ID
      const userIndex = DATA.users.findIndex(
        (user: { id: string }) => user.id === userId,
      );

      // Check if user exists
      if (userIndex === -1) {
        throw new CustomError(404, "Not Found", "No user found with this ID");
      }

      // do input validation using Yup

      // Update user data
      const updatedUser = {
        ...DATA.users[userIndex],
        ...req.body, // Merge existing user data with new data
        updatedAt: new Date().toISOString(), // Update timestamp
      };

      // Update the user in the array
      DATA.users[userIndex] = updatedUser;

      // Write updated data back to JSON file
      await fs.writeFile(FILE_PATH, JSON.stringify(DATA, null, 2));

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;

      // READ JSON file from (json/data.json)
      const FILE_PATH = path.join(__dirname, "../../json/data.json");
      const RAW_DATA = await fs.readFile(FILE_PATH, "utf-8");
      const DATA = JSON.parse(RAW_DATA);

      // Find user by ID
      const userIndex = DATA.users.findIndex(
        (user: { id: string }) => user.id === userId,
      );

      // Check if user exists
      if (userIndex === -1) {
        throw new CustomError(404, "Not Found", "No user found with this ID");
      }

      // Remove the user from the array
      DATA.users.splice(userIndex, 1);

      // Write updated data back to JSON file
      await fs.writeFile(FILE_PATH, JSON.stringify(DATA, null, 2));

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: {},
      });
    } catch (error) {
      next(error);
    }
  },
};

export default UsersController;
