import { Request, Response } from "express";
import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";
import { RegisterSchema, ValidationError } from "../utils/validation"; // Assuming you have a validation utility for Yup

const UsersController = {
  createUser: async (req: Request, res: Response) => {
    try {
      // Validate request body -> Yup
      await RegisterSchema.validate(req.body, { abortEarly: false });

      // Check data validation on current JSON file (email & name unique)
      const FILE_PATH = path.join(__dirname, "../../json/data.json");
      console.log(FILE_PATH);
      const RAW_DATA = await fs.readFile(FILE_PATH, "utf-8");
      const DATA = JSON.parse(RAW_DATA);

      // Check if email already exists
      const existingUser = DATA.users.find(
        (user: { email: string }) => user.email === req.body.email,
      );
      if (existingUser) {
        throw new Error("Email already exists");
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
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          message: error.message,
          data: {},
        });
      }
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: {},
      });
    }
  },
};

export default UsersController;
