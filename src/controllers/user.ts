import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import {
  CustomError,
  ResponseHandler,
  RegisterSchema,
  JSONHandler,
  SUCCESS_CODES,
  SUCCESS_MESSAGE,
  ERROR_CODES,
  ERROR_MESSAGE,
  ERROR_DETAILS,
} from "@/utils";

const UsersController = {
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const DATA = await JSONHandler.read("../../json/data.json");

      res
        .status(SUCCESS_CODES.OPERATION_SUCCESSFUL)
        .json(
          ResponseHandler.success(
            SUCCESS_MESSAGE.OPERATION_SUCCESSFUL,
            DATA.users,
          ),
        );
    } catch (error) {
      next(error);
    }
  },
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;

      // READ JSON file from (json/data.json)
      const DATA = await JSONHandler.read("../../json/data.json");

      // Find user by ID
      const user = DATA.users.find(
        (user: { id: string }) => user.id === userId,
      );

      // Check if user exists
      if (!user) {
        throw new CustomError(
          ERROR_CODES.NOT_FOUND,
          ERROR_MESSAGE.NOT_FOUND,
          ERROR_DETAILS.NOT_FOUND,
        );
      }

      res
        .status(SUCCESS_CODES.OPERATION_SUCCESSFUL)
        .json(
          ResponseHandler.success(SUCCESS_MESSAGE.OPERATION_SUCCESSFUL, user),
        );
    } catch (error) {
      next(error);
    }
  },
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body -> Yup
      await RegisterSchema.validate(req.body, { abortEarly: false });

      // Check data validation on current JSON file (email & name unique)
      const DATA = await JSONHandler.read("../../json/data.json");

      // Check if email already exists
      const existingUser = DATA.users.find(
        (user: { email: string }) => user.email === req.body.email,
      );
      if (existingUser) {
        throw new CustomError(
          ERROR_CODES.BAD_REQUEST,
          ERROR_MESSAGE.BAD_REQUEST,
          ERROR_DETAILS.BAD_REQUEST,
        );
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
      await JSONHandler.write("../../json/data.json", DATA);

      // Respond with success
      res
        .status(SUCCESS_CODES.RESOURCE_CREATED)
        .json(
          ResponseHandler.success(SUCCESS_MESSAGE.RESOURCE_CREATED, newUser),
        );
    } catch (error) {
      next(error);
    }
  },
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;

      // READ JSON file from (json/data.json)
      const DATA = await JSONHandler.read("../../json/data.json");

      // Find user by ID
      const userIndex = DATA.users.findIndex(
        (user: { id: string }) => user.id === userId,
      );

      // Check if user exists
      if (userIndex === -1) {
        throw new CustomError(
          ERROR_CODES.NOT_FOUND,
          ERROR_MESSAGE.NOT_FOUND,
          ERROR_DETAILS.NOT_FOUND,
        );
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
      await JSONHandler.write("../../json/data.json", DATA);

      // Respond with success
      res
        .status(SUCCESS_CODES.RESOURCE_UPDATED)
        .json(
          ResponseHandler.success(
            SUCCESS_MESSAGE.RESOURCE_UPDATED,
            updatedUser,
          ),
        );
    } catch (error) {
      next(error);
    }
  },
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;

      // READ JSON file from (json/data.json)
      const DATA = await JSONHandler.read("../../json/data.json");

      // Find user by ID
      const userIndex = DATA.users.findIndex(
        (user: { id: string }) => user.id === userId,
      );

      // Check if user exists
      if (userIndex === -1) {
        throw new CustomError(
          ERROR_CODES.NOT_FOUND,
          ERROR_MESSAGE.NOT_FOUND,
          ERROR_DETAILS.NOT_FOUND,
        );
      }

      // Remove the user from the array
      DATA.users.splice(userIndex, 1);

      // Write updated data back to JSON file
      await JSONHandler.write("../../json/data.json", DATA);

      // Respond with success
      res
        .status(SUCCESS_CODES.RESOURCE_DELETED)
        .json(ResponseHandler.success(SUCCESS_MESSAGE.RESOURCE_DELETED, null));
    } catch (error) {
      next(error);
    }
  },
};

export default UsersController;
